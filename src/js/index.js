// Global
let canvas = document.querySelector('#c');
let WIDTH = canvas.width = window.innerWidth;
let HEIGHT = canvas.height = 600;
let ctx = canvas.getContext('2d');


let MAX_CREATURES = 300;
const REPRODUCTION_RATE = 0.5;
const ENABLE_SUPER_DEBUG = false;

// constants for flexibilty
const CREATURE = 'CREATURE';
const PREDATOR = 'PREDATOR';
const AVOIDER = 'AVOIDER';
const EATER = 'EATER';
const FOOD = 'FOOD';
const POISON = 'POISON';

function load() {
  if (typeof window.orientation !== 'undefined') { MAX_CREATURES = 200 }

  const ecoSys = new EcoSystem();

  // creates a Array which you can access with ecoSys.entities 
  ecoSys.addEntities({
    FOOD: [],
    POISON: []
  });

  // register classes it will also create corresponding Arrays
  // which you can use by calling ecoSys.groups[your_given_name]
  ecoSys.registerAgents({
    CREATURE: Agent,
    PREDATOR: Predator,
    AVOIDER: Avoider,
    EATER: Eater,
  });

  // initialPopulation have to use the same name
  // which you configure in registerAgents
  ecoSys.initialPopulation({
    CREATURE: 150,
    PREDATOR: randomInt(5, 10),
    AVOIDER: randomInt(10, 20),
    EATER: randomInt(1, 4),
  });

  let debugAgent = null;
  if (ENABLE_SUPER_DEBUG) {
    canvas.addEventListener('mousedown', function (e) {
      for (let i = 0; i < ecoSys.groups.CREATURE.length; i++) {
        let a = ecoSys.groups.CREATURE[i];
        if (dist(e.offsetX, e.offsetY, a.pos.x, a.pos.y) < a.radius * 2) {
          debugAgent = a;
        }
      }
    })
  }

  let add = document.getElementById('addnew');
  canvas.addEventListener('click', function (e) {
    ecoSys.add(add.value, e.offsetX, e.offsetY)
  })

  function populationConstraints() {
    // Add And Reset
    if (random(1) < 0.03) addItem(ecoSys.entities.FOOD, 8);
    if (random(1) < 0.03) addItem(ecoSys.entities.POISON, 1);

    if (random(1) < 0.005) addPredators(ecoSys.groups.PREDATOR, 1);
    if (random(1) < 0.005) addAvoiders(ecoSys.groups.AVOIDER, 1);

    if (ecoSys.groups.CREATURE.length < 20) {
      addCreatures(ecoSys.groups.CREATURE, 10);
    }
    if (ecoSys.groups.EATER.length < 1) {
      addEaters(ecoSys.groups.EATER, 1);
    }
    if (ecoSys.entities.FOOD.length < 50) {
      addItem(ecoSys.entities.FOOD, 20);
    }
    if (ecoSys.groups.CREATURE.length > MAX_CREATURES) {
      ecoSys.groups.CREATURE.pop()
    };
  }


  var lastframe;
  var fps;
  //  ANIMATE LOOP
  function animate() {
    let grd = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 0, WIDTH / 2, HEIGHT / 2, WIDTH);
    grd.addColorStop(0, "rgba(25,25,25,1)");
    grd.addColorStop(1, "rgba(0,0,25,1)");
    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // ctx.fillStyle = '#252525';
    // ctx.fillRect(0, 0, WIDTH, HEIGHT);

    /**
     * likes food dislikes poison
     * run away form predators and eaters
     * cloneItSelf
     */
    ecoSys.addBehavior({
      name: CREATURE,
      like: FOOD,
      dislike: POISON,
      fear: {
        PREDATOR: [-4, 75],
        EATER: [-2, 100]
      },
      cloneItSelf: 0.0015,
      callback: function () {
        if (ecoSys.groups.CREATURE.length < MAX_CREATURES
          && random(1) < REPRODUCTION_RATE) {
          this.reproduce(ecoSys.groups.CREATURE);
        }
      }
    });

    /**
     * likes poison dislikes food
     * seeks and eats creatures
     * run away from eaters
     */
    ecoSys.addBehavior({
      name: PREDATOR,
      like: POISON,
      dislike: FOOD,
      likeDislikeWeight: [1, -1],
      fear: {
        EATER: [-10, 50],
        CREATURE: [1, 200, function (agents, i) {
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
      name: AVOIDER,
      like: FOOD,
      dislike: POISON,
      cloneItSelf: 0.0005,
      // likeDislikeWeight: [1, -1],
      fear: {
        CREATURE: [-0.9, 100],
        EATER: [-1, 100],
        PREDATOR: [-1, 100, function () {
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
      name: EATER,
      like: POISON,
      dislike: POISON,
      likeDislikeWeight: [1, 1],
      fear: {
        CREATURE: [1.0, 100, function (list, i) {
          list.splice(i, 1);
          this.health += this.goodFoodMultiplier;
          this.radius += this.goodFoodMultiplier;
        }],
        PREDATOR: [1.0, 100, function (list, i) {
          list.splice(i, 1);
          this.health += this.goodFoodMultiplier;
          this.radius += this.goodFoodMultiplier;
        }],
        AVOIDER: [1.0, 100, function (list, i) {
          list.splice(i, 1);
          this.health += this.goodFoodMultiplier;
          this.radius += this.goodFoodMultiplier;
        }],
      },
      callback: function () {
        if (random(0, 1) < 0.05) {
          addItem(ecoSys.entities.FOOD, 1, this.pos.x, this.pos.y)
        }
      }
    });

    // UPDATE & RENDER
    ecoSys.render();
    ecoSys.update();
    renderItem(ecoSys.entities.FOOD, 'white', 1, true);
    renderItem(ecoSys.entities.POISON, 'crimson', 2);

    populationConstraints();

    if (debugAgent && ENABLE_SUPER_DEBUG) {
      debugAgent.renderHealth(ctx);
      debugAgent.renderDebugDNA(ctx);
      debugAgent.renderDebug(ctx);
    }

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
      'Good Creatures': ecoSys.groups.CREATURE.length,
      'Predators': ecoSys.groups.PREDATOR.length,
      'Avoiders': ecoSys.groups.AVOIDER.length,
      'Eaters': ecoSys.groups.EATER.length,
      'Foods': ecoSys.entities.FOOD.length,
      'Poison': ecoSys.entities.POISON.length,
      'FPS': fps
    })
  }, 100);
}

window.onload = load;