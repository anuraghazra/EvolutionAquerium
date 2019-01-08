// * I WILL REFACTOR IT LATER
// * I WILL REFACTOR IT LATER
// * I WILL REFACTOR IT LATER

function addCreatures(list, max) {
  for (let i = 0; i < max; i++) {
    let x = random(WIDTH);
    let y = random(HEIGHT);
    let radius = random(5, 7);
    if (isInsideWall(x, y, radius)) {
      x = random(WIDTH);
      y = random(HEIGHT);
    }
    list.push(new Agent(x, y, radius));
  }
}
function addPredators(list, max) {
  for (let i = 0; i < max; i++) {
    let x = random(WIDTH);
    let y = random(HEIGHT);
    let radius = random(6, 10);
    if (isInsideWall(x, y, radius)) {
      x = random(WIDTH);
      y = random(HEIGHT);
    }
    list.push(new Predator(x, y, radius));
  }
}
function addAvoiders(list, max) {
  for (let i = 0; i < max; i++) {
    let x = random(WIDTH);
    let y = random(HEIGHT);
    let radius = random(3, 8);
    if (isInsideWall(x, y, radius)) {
      x = random(WIDTH);
      y = random(HEIGHT);
    }
    list.push(new Avoider(x, y, radius));
  }
}
function addEaters(list, max) {
  for (let i = 0; i < max; i++) {
    let x = random(WIDTH);
    let y = random(HEIGHT);
    let radius = random(3, 8);
    if (isInsideWall(x, y, radius)) {
      x = random(WIDTH);
      y = random(HEIGHT);
    }
    list.push(new Eater(x, y, radius));
  }
}
function addItem(list, max, xx, yy) {
  for (let i = 0; i < max; i++) {
    let x = xx;
    let y = yy;
    if (x == undefined && y == undefined) {
      x = random(WIDTH);
      y = random(HEIGHT);
      if (isInsideWall(x, y, 0)) {
        x = random(WIDTH);
        y = random(HEIGHT);
      }
    }
    list.push({ pos: new Vector(x, y) });
  }
}

function isInsideWall(x, y, padding) {
  if (typeof walls === 'undefined') { return false } 
  for (let w = 0; w < walls.length; w++) {
    let wall = walls[w];
    if (
      (x + padding >= wall.x && x - padding <= wall.x + wall.width) &&
      (y + padding >= wall.y && y - padding <= wall.y + wall.height)) {
      return true;
    }
  }
  return false;
}

function renderItem(list, color, radius, rect) {
  for (let i = 0; i < list.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = color;
    if (rect) {
      ctx.fillRect(list[i].pos.x, list[i].pos.y, radius * 2, radius * 2);
    } else {
      // ctx.arc(list[i].pos.x, list[i].pos.y, (radius || 5), 0, Math.PI * 2);      
      ctx.fillRect(list[i].pos.x, list[i].pos.y, radius * 2, radius * 2);
    }
    ctx.fill();
    ctx.closePath();
  }
}

let flk_slider_separate = document.getElementById('separate');
let flk_slider_align = document.getElementById('align');
let flk_slider_cohesion = document.getElementById('cohesion');
let renderhealth_checkbox = document.getElementById('render_health');
let debug_checkbox = document.getElementById('debug');
let render_names = document.getElementById('names');

/**
 * @method batchUpdateAgents()
 * @param {Array} list 
 * @param {Array} like 
 * @param {Array} dislike 
 * @param {2DArray} weight 
 * @param {Function} callback 
 * updates the flocking, behavior, boundaries, and renders all the agents
 * and also checks for dead state
 */
function batchUpdateAgents(list, foodPoison, weight, callback) {
  for (let i = list.length - 1; i >= 0; i--) {
    list[i].updateFlockBehavior(flk_slider_separate.value, flk_slider_align.value, flk_slider_cohesion.value);
    list[i].applyFlock(list);
    list[i].Behavior(foodPoison[0], foodPoison[1], weight);
    list[i].boundaries();
    list[i].update();

    if (callback) {
      callback.call(null, list, i);
    }

    if (list[i].dead()) {
      let x = list[i].pos.x;
      let y = list[i].pos.y;
      foodPoison[0].push({ pos: new Vector(x, y) });
      list.splice(i, 1);
    }
  }
}

function batchRenderAgents(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].render(ctx);

    // DEBUG
    if (renderhealth_checkbox.checked) list[i].renderHealth(ctx);
    if (debug_checkbox.checked) list[i].renderDebug(ctx);
    if (render_names.checked) list[i].renderNames(ctx);
  }
}


/**
 * @metod renderStats()
 * @param {*} data 
 */
let stats = document.getElementById('stats');
function renderStats(data) {
  renderData = '';
  for (let i in data) {
    renderData += ' | ' + i + ' : ' + data[i]
  }
  // ctx.fillStyle = 'white';
  // ctx.font = '13px Arial';
  // ctx.fillText(renderData, 10, 20);
  // ctx.fill();
  stats.textContent = renderData;
}


/** UTILS */
function random(min, max) {
  if (max === undefined) return Math.random() * min;
  return min + Math.random() * max
}
function clamp(value, min, max) {
  if (value >= max) {
    return max;
  } else if (value <= min) {
    return min;
  }
  return value;
}

function dist(px, py, qx, qy) {
  let dx = px - qx;
  let dy = py - qy;
  return Math.sqrt(dx * dx + dy * dy);
}
const TWO_PI = Math.PI * 2;
// function rgba(r, g, b, a) {
//   return `rgba(${r},${g},${b},${a})`;
// }