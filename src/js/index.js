// Global
let width = 1280;
let height = 600;
let canvas = document.querySelector('#c');
canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');

window.onload = function () {

  let creatures = [];
  let food = [];
  let poison = [];

  // ================================ ADD ITEMS
  function setup() {
    addItem(food, 100);
    addItem(poison, 20);
    addCreatures(creatures, 20);
  }
  setup();

  canvas.addEventListener('click', function(e) {
    creatures.push(new Agent(e.offsetX, e.offsetY,10))
  })


  function animate() {
    ctx.fillStyle = '#252525';
    ctx.fillRect(0, 0, width, height);

    // agent
    for (let i = creatures.length-1; i >= 0; i--) {
      creatures[i].behaviour(food, poison);
      creatures[i].boundaries();
      creatures[i].update();
      creatures[i].render(ctx);
      // if(Math.random() < 0.5) {
        if(creatures[i].sex === 'male') {
          creatures[i].attact(creatures,0.2, 100)
        }
      // }
      
      // let newAgent = creatures[i].clone();
      // if(newAgent !== null) {
      //   creatures.push(newAgent);
      // }
      if(Math.random() < 0.5) {
        creatures[i].reproduce(creatures);
      }

      if(creatures[i].dead()) {
        let x = creatures[i].pos.x;
        let y = creatures[i].pos.y;
        food.push({ pos: new Vector(x, y) });
        creatures.splice(i,1);
      }

    }

    if(Math.random() < 0.03) {
      addItem(food, 1);
    }
    if(Math.random() < 0.03) {
      addItem(poison, 1);
    }
    

    // render items
    renderItem(food,'lightgreen',3);
    renderItem(poison,'crimson',2);

    requestAnimationFrame(animate)
  }
  animate();

}