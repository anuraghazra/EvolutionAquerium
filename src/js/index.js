// Global
let canvas = document.querySelector('#c');
let WIDTH = window.innerWidth;
let HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

let ctx = canvas.getContext('2d');

let MAX_CREATURES = 300;
const REPRODUCTION_RATE = 0.004;

// let walls = [];
// walls.push(new Wall(200, 200, 20, 250));
// walls.push(new Wall(800, 200, 20, 250));
// walls.push(new Wall(400, 250, 250, 20));
window.onload = function () {
  if (typeof window.orientation !== 'undefined') { MAX_CREATURES = 200 }

  let predators = [];
  let creatures = [];
  let avoiders = [];
  let eaters = [];
  let food = [];
  let poison = [];


  const INIT_VALUES = {
    food: random(50, 100),
    poison: random(50, 20),
    creatures: random(100, 150),
    predators: random(2, 10),
    avoiders: random(20, 25),
    eaters: random(1, 4)
  }

  // === ADD ITEMS
  function setup() {

    addItem(food, INIT_VALUES.food);
    addItem(poison, INIT_VALUES.poison);
    // addCreatures(creatures, INIT_VALUES.creatures);
    // addPredators(predators, INIT_VALUES.predators);
    // addAvoiders(avoiders, INIT_VALUES.avoiders);
    // addEaters(eaters, INIT_VALUES.eaters);
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


  


  const ecoSys = new EcoSystem();


  ecoSys.registerAgents({
    'CREATURE': Agent,
    'PREDATOR': Predator,
    'AVOIDER': Avoider,
    'EATER': Eater,
  })

  ecoSys.addEntities({
    'CREATURE': creatures,
    'PREDATOR': predators,
    'AVOIDER': avoiders,
    'EATER': eaters,
    'FOOD': food,
    'POISON': poison
  });

  ecoSys.initialPopulation({
    'CREATURE': random(100, 150),
    'PREDATOR': random(2, 10),
    'AVOIDER': random(20, 25),
    'EATER': random(1, 4),
  });

  var lastframe;
  var fps;

  //  ANIMATE LOOP
  function animate() {
    ctx.fillStyle = '#252525';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    /**
     * likes food dislikes poison
     * run away form predators and eaters
     * cloneItSelf
     */
    ecoSys.addBehavior({
      name: 'CREATURE',
      like: 'FOOD',
      dislike: 'POISON',
      fear: {
        'PREDATOR': [-4, 75],
        'EATER': [-2, 100]
      },
      cloneItSelf: 0.0015,
      callback: function () {
        if (
          creatures.length > 0 &&
          random(1) < REPRODUCTION_RATE
          && creatures.length < MAX_CREATURES
        ) {
          this.reproduce(creatures);
        }
      }
    });

    /**
     * likes poison dislikes food
     * seeks and eats creatures
     * run away from eaters
     */
    ecoSys.addBehavior({
      name: 'PREDATOR',
      like: 'POISON',
      dislike: 'FOOD',
      likeDislikeWeight: [1, -1],
      fear: {
        'EATER': [-10, 50],
        'CREATURE': [1, 200, function (agents, i) {
          agents.splice(i, 1);
          this.health += this.goodFoodMultiplier;
          this.radius += this.goodFoodMultiplier;
        }]
      },
    });

    /**
     * likes food dislikes poison
     * run away form predators, eaters, creatures
     */
    ecoSys.addBehavior({
      name: 'AVOIDER',
      like: 'FOOD',
      dislike: 'POISON',
      cloneItSelf: 0.0005,
      // likeDislikeWeight: [1, -1],
      fear: {
        'CREATURE': [-0.9, 100],
        'EATER': [-1, 100],
        'PREDATOR': [-1, 100, function () {
          this.health += this.badFoodMultiplier;
        }]
      },
    });

    /**
     * likes poison
     * emits food as waste compound
     * seeks creatures, predators, avoiders and EATS THEM
     */
    ecoSys.addBehavior({
      name: 'EATER',
      like: 'POISON',
      dislike: 'POISON',
      likeDislikeWeight: [1, 1],
      fear: {
        'CREATURE': [1.0, 100, function (list, i) {
          list.splice(i, 1);
          this.health += this.goodFoodMultiplier;
          this.radius += this.goodFoodMultiplier;
        }],
        'PREDATOR': [1.0, 100, function (list, i) {
          list.splice(i, 1);
          this.health += this.goodFoodMultiplier;
          this.radius += this.goodFoodMultiplier;
        }],
        'AVOIDER': [1.0, 100, function (list, i) {
          list.splice(i, 1);
          this.health += this.goodFoodMultiplier;
          this.radius += this.goodFoodMultiplier;
        }],
      },
      callback: function () {
        if (random(0, 1) < 0.05) {
          addItem(food, 1, this.pos.x, this.pos.y)
        }
      }
    });

    ecoSys.render();
    ecoSys.update();

    // RENDER
    renderItem(food, 'white', 1, true);
    renderItem(poison, 'crimson', 2);


    // Add And Reset
    if (random(1) < 0.03) addItem(food, 5);
    if (random(1) < 0.03) addItem(poison, 1);
    if (random(1) < 0.005) addPredators(predators, 1);
    if (random(1) < 0.005) addAvoiders(avoiders, 1);
    if (creatures.length < 50) addCreatures(creatures, 50);
    if (food.length < 50) addItem(food, 20);
    if (eaters.length < 1) addEaters(eaters, 1);
    if (creatures.length > MAX_CREATURES) creatures.pop();


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