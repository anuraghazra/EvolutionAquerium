class Renderer {
  renderHealth(ctx) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(this.pos.x - 10, this.pos.y - 10, this.health * 20, 3);
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(this.pos.x - 10, this.pos.y - 10, 1 * 20, 2);
    ctx.restore();
  }

  renderDebug(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.arc(this.pos.x, this.pos.y, clamp(this.dna[2], 0, 100), 0, TWO_PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.arc(this.pos.x, this.pos.y, clamp(this.dna[3], 0, 100), 0, TWO_PI);
    ctx.stroke();
    ctx.closePath();
  }

  renderDebugDNA(ctx) {
    let angle = this.vel.heading() + (Math.PI / 2);
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(angle);
    ctx.strokeStyle = 'green';
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -this.dna[0] * 20);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -this.dna[1] * 20);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  renderNames(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillText(this.name, this.pos.x - this.radius, this.pos.y - this.radius - 5);
    ctx.fill();
    ctx.closePath();
  }

  /**
   * Only For Debugging Purposes
   * @param {*} ctx 
   */
  renderAgentDebug(ctx) {
    if (!ENABLE_SUPER_DEBUG) return;
    let x = (this.pos.x - this.radius);
    let y = (this.pos.y - this.radius) - 30;

    let lineheight = -20;
    let data = {
      pos: 'x : ' + (this.pos.x).toFixed(2) + ' y : ' + (this.pos.y).toFixed(2),
      reproduced: this.hasReproduced,
      age: (this.age).toFixed(1),
      gender: this.getGender(),
      uid: this.uid,
      type: this.type,
    }
    ctx.beginPath();
    ctx.fillStyle = 'white';
    for (const i in data) {
      ctx.fillText(i + ': ' + data[i], x - 30, y - lineheight);
      lineheight += 12;
    }
    ctx.fill();
    ctx.closePath();

    for (const i in this.partners) {
      if (this.partners[i] !== undefined) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.partners[i].pos.x, this.partners[i].pos.y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    for (let j = this.childs.length; j >= 0; j--) {
      if (this.childs[j]) {
        ctx.beginPath();
        ctx.strokeStyle = 'deepskyblue';
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.childs[j].pos.x, this.childs[j].pos.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  /**
   * Render Agent
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.beginPath();

    ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.health})`;
    let angle = this.vel.heading();

    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(angle);
    ctx.moveTo(this.radius, 0);
    ctx.lineTo(-this.radius, -this.radius + 2);
    ctx.lineTo(-this.radius, this.radius - 4);
    ctx.lineTo(this.radius, 0);
    ctx.fill();
    ctx.restore();

    ctx.closePath();
  }
}