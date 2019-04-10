

// let walls = [];
// walls.push(new Wall(200, 200, 20, 250));
// walls.push(new Wall(800, 200, 20, 250));
// walls.push(new Wall(400, 250, 250, 20));


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

// let predators = [];
// let creatures = [];
// let avoiders = [];
// let eaters = [];


// === ADD ITEMS
function setup() {

  // addItem(food, INIT_VALUES.food);
  // addItem(poison, INIT_VALUES.poison);

  // function UIAdd(list, Base, data) {
  //   list.push((Base.setPos(data.x, data.y).setRadius(data.r).build()));
  // }
  // UI add
  let add = document.getElementById('addnew');
  canvas.addEventListener('click', function (e) {
    UIAdd(creatures, Agent, { x: e.offsetX, y: e.offsetY, r: 5 });
    switch (add.value) {
      case AGENT_TYPE.MALE || AGENT_TYPE.FEMALE:
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