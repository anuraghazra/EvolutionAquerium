// * I WILL REFACTOR IT LATER
// * I WILL REFACTOR IT LATER
// * I WILL REFACTOR IT LATER

function addCreatures(list, max) {
  for (let i = 0; i < max; i++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    let radius = 5 + Math.random() * 6;
    list.push(new Agent(x, y, radius));
  }
}
function addPredators(list, max) {
  for (let i = 0; i < max; i++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    let radius = 6 + Math.random() * 10;
    list.push(new Predator(x, y, radius));
  }
}
function addAvoiders(list, max) {
  for (let i = 0; i < max; i++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    let radius = 3 + Math.random() * 8;
    list.push(new Avoider(x, y, radius));
  }
}
function addEaters(list, max) {
  for (let i = 0; i < max; i++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    let radius = 3 + Math.random() * 8;
    list.push(new Eater(x, y, radius));
  }
}
function addItem(list, max, xx, yy) {
  for (let i = 0; i < max; i++) {
    let x = xx;
    let y = yy;
    if (x == undefined && y == undefined) {
      x = Math.random() * width;
      y = Math.random() * height;
    }
    list.push({ pos: new Vector(x, y) });
  }
}


function renderItem(list, color, radius, rect) {
  for (let i = 0; i < list.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = color;
    if (rect) {
      ctx.fillRect(list[i].pos.x, list[i].pos.y, radius*2, radius*2);
    } else {
      ctx.arc(list[i].pos.x, list[i].pos.y, (radius || 5), 0, Math.PI * 2);
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
function batchUpdateAgents(list, like, dislike, weight, callback) {
  for (let i = list.length-1; i >= 0; i--) {
    list[i].updateFlockBehavior(flk_slider_separate.value, flk_slider_align.value, flk_slider_cohesion.value);
    list[i].applyFlock(list);
    list[i].Behavior(like, dislike, weight);
    list[i].boundaries();
    list[i].update();
    list[i].render(ctx);

    // DEBUG
    if (renderhealth_checkbox.checked) list[i].renderHealth(ctx);
    if (debug_checkbox.checked) list[i].renderDebug(ctx)
    
    if(callback) {
      callback.call(null,list,i);
    }
    
    if(list[i].dead()) {
      let x = list[i].pos.x;
      let y = list[i].pos.y;
      like.push({ pos: new Vector(x, y) });
      list.splice(i,1);
    }
  }
}


/**
 * @metod renderStats()
 * @param {*} data 
 */
function renderStats(data) {
  renderData = '';
  for (let i in data) {
    renderData += ' | ' + i + ' : ' + data[i]
  }
  ctx.fillStyle = 'white';
  ctx.font = '13px Arial';
  ctx.fillText(renderData, 10,20);
  ctx.fill();
}


/** UTILS */
function random(min, max) {
  if (max === undefined) return Math.random()*min;
  return min+Math.random()*max
}
function clamp(min, max, value) {
  if(value > max) {
    return value;
  }
  if (value < min) {
    return min;
  }
  return value;
}

function dist(px, py, qx, qy) {
  let dx = px-qx;
  let dy = py-qy;
  return Math.sqrt(dx*dx+dy*dy);
}
function rgba(r, g, b, a) {
  return `rgba(${r},${g},${b},${a})`;
}