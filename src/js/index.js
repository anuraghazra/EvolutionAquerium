// let p = new p5();
// console.log(p);
window.onload = function () {

  let canvas = document.querySelector('#c');
  let width = 1280;
  let height = 600;
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext('2d');

  
  let creatures = [];
  let predators = [];
  let avoiders = [];
  let food = [];
  let poison = [];


  function renderStats() {
    let data = 'Good Creatures : ' + creatures.length 
              + ', Predators : ' + predators.length
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(data, 15,25);
    ctx.fill();
  }
  function addCreatures(list, max) {
    for (let i = 0; i < max; i++) {
      let x = Math.random()*width;
      let y = Math.random()*height;
      let radius = 5+Math.random()*6;
      list.push(new Agent(x,y, radius));
    } 
  }
  function addPredator(list, max) {
    for (let i = 0; i < max; i++) {
      let x = Math.random()*width;
      let y = Math.random()*height;
      let radius = 5+Math.random()*6;
      list.push(new Predator(x,y, radius));
    } 
  }
  function addAvoiders(list, max) {
    for (let i = 0; i < max; i++) {
      let x = Math.random()*width;
      let y = Math.random()*height;
      let radius = 5+Math.random()*6;
      list.push(new Avoider(x,y, radius));
    } 
  }

  function addItem(list, max) {
    for (let i = 0; i < max; i++) {
      let x = Math.random()*width;
      let y = Math.random()*height;
      list.push({pos : new Vector(x, y)});
    }
  }
  function renderItem(list, color, radius) {
    for (let i = 0; i < list.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(list[i].pos.x, list[i].pos.y, (radius||5), 0, Math.PI*2);
      ctx.fill();
      ctx.closePath();
    }
  }

  // ADD ITEMS
  function setup() {
    addItem(food, 200);
    addItem(poison, 0);
    addCreatures(creatures, 20);
    addPredator(predators, 5);
    addAvoiders(avoiders, 5);
  }
  setup();
  function animate() {
    ctx.fillStyle = '#252525'
    ctx.fillRect(0, 0, width, height);

    // agent
    for (let i = creatures.length-1; i >= 0; i--) {
      creatures[i].behaviour(food, poison);
      // creatures[i].behaviour([],predators ,[1,-1]);
      creatures[i].update();
      creatures[i].render(ctx);
      if(creatures[i].dead()) {
        creatures.splice(i,1);
      }
    }
    for (let i = predators.length-1; i >= 0; i--) {
      predators[i].behaviour(creatures, poison);
      predators[i].update();
      predators[i].predatorUpdate();
      predators[i].render(ctx);
      if(predators[i].dead()) {
        predators.splice(i,1);
      }
    }
    for (let i = avoiders.length-1; i >= 0; i--) {
      avoiders[i].behaviour(predators, poison, [-0.5,-0.1]);
      avoiders[i].behaviour(food, poison, [1,-0.1]);
      avoiders[i].update();
      avoiders[i].render(ctx);
      if(avoiders[i].dead()) {
        avoiders.splice(i,1);
      }
    }

    if(Math.random() < 0.8) {
      if(creatures.length > 1) {
        creatures[0].reproduce(creatures);
      }
    }

    if(Math.random() < 0.1) {
      addItem(food, 1);
    }
    if(Math.random() < 0.1) {
      addItem(poison, 1);
    }
    if(Math.random() < 0.01) {
      addPredator(predators, 1);
    }
    

    // render items
    renderItem(food,'lightgreen',3);
    renderItem(poison,'crimson',2);


    renderStats();
    requestAnimationFrame(animate)
  }
  animate();

}