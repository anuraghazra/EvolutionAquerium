// Global
let width = window.innerWidth;
let height = 600;
let canvas = document.querySelector('#c');
canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');

window.onload = function () {

  let predators = [];
  let creatures = [];
  let avoiders = [];
  let food = [];
  let poison = [];

  // ================================ ADD ITEMS
  function setup() {
    addItem(food, random(20,100));
    addItem(poison, random(50,20));
    addCreatures(creatures, random(30,50));
    // addPredators(predators, random(2,10));
    addAvoiders(avoiders, random(5,8));
    // addItem(food, 10);
    // addItem(poison, 10);
    // addCreatures(creatures, 5);
    // addPredators(predators, 1);
    // addAvoiders(avoiders, random(1,8));
  }
  setup();

  // UI add
  let add = document.getElementById('addnew');
  canvas.addEventListener('click', function(e) {
    switch(add.value) {
      case 'agent' : 
        creatures.push(new Agent(e.offsetX, e.offsetY,10))
        break;
      case 'predator' : 
        predators.push(new Predator(e.offsetX, e.offsetY,10))
        break;
      case 'avoider' : 
        avoiders.push(new Avoider(e.offsetX, e.offsetY,10))
        break;
      case 'food' : 
        food.push({pos : new Vector(e.offsetX, e.offsetY)})
        break;
      case 'poison' : 
        poison.push({pos : new Vector(e.offsetX, e.offsetY)})
        break;
    }
  })


  function animate() {
    ctx.fillStyle = '#252525';
    ctx.fillRect(0, 0, width, height);

    // agent
    batchUpdateAgents(creatures, food, poison, function(list, i) {
      let me = list[i];
      let child = list[i].clone(0.0015);
      if(child !== null) {
        list.push(child);
      }
      me.defineFear(predators, -5, 100);
      me.defineFear(creatures, -5, 20);
    });
    
    if(creatures.length > 0 && Math.random() < 0.8) {
      creatures[0].reproduce(creatures);
    }

    // predators
    batchUpdateAgents(predators, poison, food, function(list, i) {
      let me = list[i];
      me.defineFear(creatures, 2, 200, function(list, i) {
        list.splice(i,1);
        me.health += me.goodFoodDie;
        me.radius += me.goodFoodDie;
        if(me.radius > me.maxRadius) {me.radius = me.maxRadius}
      })
    });
    
    // avoiders
    batchUpdateAgents(avoiders, food, poison, function(list, i) {
      let me = list[i];
      me.defineFear(predators, -1, 100, function(list, i) {
        me.health += me.badFoodDie;
      })
    });

    if(Math.random() < 0.03) {
      addItem(food, 5);
    }
    if(Math.random() < 0.03) {
      addItem(poison, 1);
    }
    if(Math.random() < 0.005) {
      addPredators(predators, 1);
    }
    if(Math.random() < 0.005) {
      addAvoiders(avoiders, 1);
    }
    
    if(creatures.length < 1) {
      addCreatures(creatures, 5);
    }
    

    // render items
    renderItem(food,'white',1);
    renderItem(poison,'crimson',2);

    renderStats({
      'Good Creatures' : creatures.length,
      'Predators' : predators.length,
      'Avoiders' : avoiders.length,
      'Foods' : food.length,
      'Poison' : poison.length
    })


    requestAnimationFrame(animate)
  }
  animate();

}