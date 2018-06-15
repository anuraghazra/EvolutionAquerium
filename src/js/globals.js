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
function addItem(list, max) {
  for (let i = 0; i < max; i++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    list.push({ pos: new Vector(x, y) });
  }
}
function renderItem(list, color, radius) {
  for (let i = 0; i < list.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(list[i].pos.x, list[i].pos.y, (radius || 5), 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

function random(min, max) {
  return min+Math.random()*max;
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