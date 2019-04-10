// * I WILL REFACTOR IT LATER
// * I WILL REFACTOR IT LATER
// * I WILL REFACTOR IT LATER

function addCreatures(list, max) {
  for (let i = 0; i < max; i++) {
    let x = random(WIDTH);
    let y = random(HEIGHT);
    let radius = randomInt(5, 7);
    if (isInsideWall(x, y, radius)) {
      x = random(WIDTH);
      y = random(HEIGHT);
    }
    list.push(Agent.setPos(x, y).setRadius(radius).build());
  }
}
function addPredators(list, max) {
  for (let i = 0; i < max; i++) {
    let x = random(WIDTH);
    let y = random(HEIGHT);
    let radius = randomInt(6, 10);
    if (isInsideWall(x, y, radius)) {
      x = random(WIDTH);
      y = random(HEIGHT);
    }
    list.push(Predator.setPos(x, y).setRadius(radius).build());
  }
}
function addAvoiders(list, max) {
  for (let i = 0; i < max; i++) {
    let x = random(WIDTH);
    let y = random(HEIGHT);
    let radius = randomInt(3, 8);
    if (isInsideWall(x, y, radius)) {
      x = random(WIDTH);
      y = random(HEIGHT);
    }
    list.push(Avoider.setPos(x, y).setRadius(radius).build());
  }
}
function addEaters(list, max) {
  for (let i = 0; i < max; i++) {
    let x = random(WIDTH);
    let y = random(HEIGHT);
    let radius = randomInt(3, 8);
    if (isInsideWall(x, y, radius)) {
      x = random(WIDTH);
      y = random(HEIGHT);
    }
    list.push(Eater.setPos(x, y).setRadius(radius).build());
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
let dnadebug_checkbox = document.getElementById('dnadebug');
let render_names = document.getElementById('names');

function batchRenderAgents(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].render(ctx);

    // DEBUG
    if (renderhealth_checkbox.checked) list[i].renderHealth(ctx);
    if (debug_checkbox.checked) list[i].renderDebug(ctx);
    if (dnadebug_checkbox.checked) list[i].renderDebugDNA(ctx);
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

  stats.textContent = renderData;
}


/** UTILS */
function random(min, max) {
  if (max === undefined) return Math.random() * min;
  return min + Math.random() * max
}
function randomInt(min, max) {
  return Math.floor(random(min, max));
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
function distSq(px, py, qx, qy) {
  let dx = px - qx;
  let dy = py - qy;
  return (dx * dx + dy * dy);
}
const TWO_PI = Math.PI * 2;
// function rgba(r, g, b, a) {
//   return `rgba(${r},${g},${b},${a})`;
// }