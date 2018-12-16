// Global
let width = window.innerWidth;
let height = 600;
let canvas = document.querySelector('#c');
canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');

window.onload = function () {
  let MAX_CREATURES = 350;
  const REPRODUCTION_RATE = 0.4;

  if (typeof window.orientation !== 'undefined') { MAX_CREATURES = 200 }

  let predators = [];
  let creatures = [];
  let avoiders = [];
  let eaters = [];
  let food = [];
  let poison = [];

  // === ADD ITEMS
  function setup() {
    addItem(food, random(50, 100));
    addItem(poison, random(50, 20));
    addCreatures(creatures, random(50, 100));
    addPredators(predators, random(2, 10));
    addAvoiders(avoiders, random(5, 8));
    addAvoiders(avoiders, random(10, 20));
    addEaters(eaters, random(1, 4));

    // UI add
    let add = document.getElementById('addnew');
    canvas.addEventListener('click', function (e) {
      switch (add.value) {
        case 'agent':
          creatures.push(new Agent(e.offsetX, e.offsetY, 10))
          break;
        case 'predator':
          predators.push(new Predator(e.offsetX, e.offsetY, 10))
          break;
        case 'avoider':
          avoiders.push(new Avoider(e.offsetX, e.offsetY, 10))
          break;
        case 'eater':
          eaters.push(new Eater(e.offsetX, e.offsetY, 5))
          break;
        case 'food':
          food.push({ pos: new Vector(e.offsetX, e.offsetY) })
          break;
        case 'poison':
          poison.push({ pos: new Vector(e.offsetX, e.offsetY) })
          break;
      }
    })
  }
  setup();


  //  ANIMATE LOOP
  function animate() {
    ctx.fillStyle = '#252525';
    ctx.fillRect(0, 0, width, height);

    // creatures
    // array, likes, dislikes, weights, callback
    batchUpdateAgents(creatures, food, poison, undefined, function (list, i) {
      let me = list[i];
      let child = list[i].clone(0.0015);
      if (child !== null) {
        list.push(child);
      }
      me.defineFear(predators, -4, 50);
      me.defineFear(eaters, -2, 100);
    });

    if (creatures.length > MAX_CREATURES) creatures.pop();
    if (creatures.length > 0 && Math.random() < REPRODUCTION_RATE) {
      creatures[0].reproduce(creatures);
    }

    // predators
    batchUpdateAgents(predators, poison, food, undefined, function (list, i) {
      let me = list[i];
      me.defineFear(creatures, 1, 200, function (list, i) {
        list.splice(i, 1);
        me.health += me.goodFoodMultiplier;
        me.radius += me.goodFoodMultiplier;
      })
      me.defineFear(eaters, -50, 100);
    });

    // avoiders
    batchUpdateAgents(avoiders, food, poison, [0.8, -0.5], function (list, i) {
      let me = list[i];
      me.defineFear(creatures, -0.9, 100);
      me.defineFear(eaters, -2, 100);
      me.defineFear(predators, -2, 100, function (list, i) {
        me.health += me.badFoodMultiplier;
      })
      me.defineFear(poison, -0.5, 100, function (list, i) {
        me.health += me.badFoodMultiplier;
      })
    });

    // eaters
    batchUpdateAgents(eaters, poison, poison, [1, 1], function (list, i) {
      let me = list[i];
      if (random(0, 1) < 0.1) {
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
      })
      me.defineFear(avoiders, 1.0, 100, function (list, i) {
        list.splice(i, 1);
        me.health += me.goodFoodMultiplier;
        me.radius += me.goodFoodMultiplier;
      })
      me.defineFear(poison, -5, 100);
    });


    // Add And Reset
    if (Math.random() < 0.03) addItem(food, 5);
    if (Math.random() < 0.03) addItem(poison, 1);
    if (Math.random() < 0.005) addPredators(predators, 1);
    if (Math.random() < 0.005) addAvoiders(avoiders, 1);

    if (food.length < 50) addItem(food, 20);
    if (creatures.length < 50) addCreatures(creatures, 50);
    if (eaters.length < 1) addEaters(eaters, 1);


    // render items
    renderItem(food, 'white', 1);
    renderItem(poison, 'crimson', 2);

    renderStats({
      'Good Creatures': creatures.length,
      'Predators': predators.length,
      'Avoiders': avoiders.length,
      'Eaters': eaters.length,
      'Foods': food.length,
      'Poison': poison.length
    })

    requestAnimationFrame(animate)
  }
  animate();

}