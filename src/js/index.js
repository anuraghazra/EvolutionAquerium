// Global
let canvas = document.querySelector('#c');
let WIDTH = window.innerWidth;
let HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

let ctx = canvas.getContext('2d');
// let walls = [];

let MAX_CREATURES = 300;
const REPRODUCTION_RATE = 0.004;
const CONFIG = {

}

window.onload = function () {
  if (typeof window.orientation !== 'undefined') { MAX_CREATURES = 200 }

  let predators = [];
  let creatures = [];
  let avoiders = [];
  let eaters = [];
  let food = [];
  let poison = [];

  // walls.push(new Wall(200, 200, 20, 250));
  // walls.push(new Wall(800, 200, 20, 250));
  // walls.push(new Wall(400, 250, 250, 20));

  const INIT_VALUES = {
    food: random(50, 100),
    poison: random(50, 20),
    creatures: random(50, 100),
    predators: random(2, 10),
    avoiders: random(20, 25),
    eaters: random(1, 4)
  }


  // === ADD ITEMS
  function setup() {
    addItem(food, INIT_VALUES.food);
    addItem(poison, INIT_VALUES.poison);
    addCreatures(creatures, INIT_VALUES.creatures);
    addPredators(predators, INIT_VALUES.predators);
    addAvoiders(avoiders, INIT_VALUES.avoiders);
    addEaters(eaters, INIT_VALUES.eaters);


    function UIAdd(list, Base, data) {
      list.push(new Base(data.x, data.y, data.r))
    }
    // UI add
    let add = document.getElementById('addnew');
    canvas.addEventListener('click', function (e) {
      switch (add.value) {
        case AGENT_TYPE.MALE || AGENT_TYPE.FEMALE:
          UIAdd(creatures, Agent, { x: e.offsetX, y: e.offsetY, r: 10 });
          break;
        case AGENT_TYPE.PREDATOR:
          UIAdd(predators, Predator, { x: e.offsetX, y: e.offsetY, r: 10 });
          break;
        case AGENT_TYPE.AVOIDER:
          UIAdd(avoiders, Avoider, { x: e.offsetX, y: e.offsetY, r: 10 });
          break;
        case AGENT_TYPE.EATER:
          UIAdd(eaters, Eater, { x: e.offsetX, y: e.offsetY, r: 5 });
          break;
        case 'FOOD':
          food.push({ pos: new Vector(e.offsetX, e.offsetY) })
          break;
        case 'POISON':
          poison.push({ pos: new Vector(e.offsetX, e.offsetY) })
          break;
      }
    })
  }
  setup();


  var lastframe;
  var fps;

  // const ecoSys = new EcoSystem()
  // ecoSys.add('CREATURE', creatures);
  // ecoSys.add('PREDATOR', predators);
  // ecoSys.add('AVOIDER', avoiders);
  // ecoSys.add('EATER', eaters);
  // ecoSys.add('FOOD', food)
  // ecoSys.add('POISON', poison)


  //  ANIMATE LOOP
  function animate() {
    ctx.fillStyle = '#252525';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);


    // ecoSys.addBehavior({
    //   name: 'CREATURE',
    //   like: 'FOOD',
    //   dislike: 'POISON',
    //   fear: {
    //     'PREDATOR': [-4, 50],
    //     'EATER': [-2, 100]
    //   },
    //   cloneItSelf: 0.0015,
    //   callback: function (agent) {
    //     if (
    //       creatures.length > 0 &&
    //       random(1) < REPRODUCTION_RATE
    //       && creatures.length < MAX_CREATURES
    //     ) {
    //       agent.reproduce(creatures);
    //     }
    //   }
    // });
    // ecoSys.addBehavior({
    //   name: 'PREDATOR',
    //   like: 'POISON',
    //   dislike: 'FOOD',
    //   likeDislikeWeight : [1, -1],
    //   fear: {
    //     'EATER': [-10, 50]
    //   },
    //   cloneItSelf: 0.0015,
    //   callback: function (agent) {
    //     if (
    //       creatures.length > 0 &&
    //       random(1) < REPRODUCTION_RATE
    //       && creatures.length < MAX_CREATURES
    //     ) {
    //       agent.reproduce(creatures);
    //     }
    //   }
    // });


    // ecoSys.update();
    // ecoSys.render();


    
    // Creatures
    batchUpdateAgents(creatures, [food, poison], undefined, function (list, i) {
      let me = list[i];
      let child = list[i].clone(0.0015);
      if (child !== null) {
        list.push(child);
      }

      me.defineFear(predators, -4, 50);
      me.defineFear(eaters, -2, 100);

      if (creatures.length > 0 && random(1) < REPRODUCTION_RATE && creatures.length < MAX_CREATURES) {
        me.reproduce(creatures);
      }
    });

    // Predators
    batchUpdateAgents(predators, [poison, food], undefined, function (list, i) {
      let me = list[i];
      me.defineFear(creatures, 1, 200, function (list, i) {
        list.splice(i, 1);
        me.health += me.goodFoodMultiplier;
        me.radius += me.goodFoodMultiplier;
      })
      me.defineFear(eaters, -10, 50);
    });

    // Avoiders
    batchUpdateAgents(avoiders, [food, poison], [1, -1], function (list, i) {
      let me = list[i];
      me.defineFear(creatures, -0.9, 100);
      me.defineFear(eaters, -2, 100);
      me.defineFear(predators, -2, 100, function () {
        me.health += me.badFoodMultiplier;
      })
    });


    // Eaters
    batchUpdateAgents(eaters, [poison, poison], [1, 1], function (list, i) {
      let me = list[i];
      if (random(0, 1) < 0.05) {
        addItem(food, 1, me.pos.x, me.pos.y)
      }

      me.defineFear(creatures, 1.0, 100, function (list, i) {
        list.splice(i, 1);
        me.health += me.goodFoodMultiplier;
        me.radius += me.goodFoodMultiplier;
      })
      me.defineFear(predators, 1.0, 100, function (list, i) {
        list.splice(i, 1);
        me.health += me.goodFoodMultiplier;
        me.radius += me.goodFoodMultiplier;
      })
      me.defineFear(avoiders, 1.0, 100, function (list, i) {
        list.splice(i, 1);
        me.health += me.goodFoodMultiplier;
        me.radius += me.goodFoodMultiplier;
      })
    });

    // RENDER
    renderItem(food, 'white', 1, true);
    renderItem(poison, 'crimson', 2);
    batchRenderAgents(creatures);
    batchRenderAgents(predators);
    batchRenderAgents(avoiders);
    batchRenderAgents(eaters);


    // Add And Reset
    if (random(1) < 0.03) addItem(food, 5);
    if (random(1) < 0.03) addItem(poison, 1);
    if (random(1) < 0.005) addPredators(predators, 1);
    if (random(1) < 0.005) addAvoiders(avoiders, 1);
    if (creatures.length < 50) addCreatures(creatures, 50);
    if (creatures.length > MAX_CREATURES) creatures.shift();
    if (food.length < 50) addItem(food, 20);
    if (eaters.length < 1) addEaters(eaters, 1);


    // WALLS
    // FOR LOOP HELL :p
    // for (let w = 0; w < walls.length; w++) {
    //   walls[w].render(ctx);
    //   for (const c of creatures) {
    //     walls[w].collide(c);
    //   }
    //   for (p of predators) {
    //     walls[w].collide(p);
    //   }
    //   for (a of avodiers) {
    //     walls[w].collide(a);
    //   }
    //   for (e of eaters) {
    //     walls[w].collide(e);
    //   }
    // }

    requestAnimationFrame(animate);
    if (!lastframe) {
      lastframe = Date.now();
      fps = 0;
      return;
    }
    delta = (Date.now() - lastframe) / 1000;
    lastframe = Date.now();
    fps = (1 / delta).toFixed(2);
  }
  animate();

  // Stats
  window.setInterval(function () {
    renderStats({
      'Good Creatures': creatures.length,
      'Predators': predators.length,
      'Avoiders': avoiders.length,
      'Eaters': eaters.length,
      'Foods': food.length,
      'Poison': poison.length,
      'FPS': fps
    })
  }, 100);
}