class Wall {

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  collide(agent) {
    let desire = null;

    if (
      (agent.pos.x+agent.radius >= this.x && agent.pos.x-agent.radius <= this.x + this.width) &&
      (agent.pos.y+agent.radius >= this.y && agent.pos.y-agent.radius <= this.y + this.height)) {
      desire = agent.vel.negative();
    }
    // math stuff
    if (desire !== null) {
      desire.normalize();
      desire.mult(1000);
      let steer = Vector.add(desire, agent.vel);
      steer.limit(1);
      agent.applyForce(steer);
    }
  }


  render(ctx) {
    ctx.fillStyle = 'rgb(25,25,25)';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}