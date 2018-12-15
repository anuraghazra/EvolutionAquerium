// controls mutation rate
const mutationRate = 0.5;

/**
 * @class Agent
 */
class Agent {

  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} radius 
   * @param {Array} dna 
   */
  constructor(x, y, radius, dna) {
    this.pos = new Vector(x, y);
    this.acc = new Vector(0, 0);
    this.vel = new Vector(0, -2);
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.radius = radius;
    this.maxSpeed = 1.5;
    this.maxForce = 0.05;
    this.health = 1;
    this.healthDecrease = 0.003;
    this.goodFoodDie = 0.5;
    this.badFoodDie = -0.4;

    /**
     * ? flockMultiplier //
     */
    this.flockMultiplier = {
      separate: 0.8,
      align: 0.7,
      cohesion: 0.4
    };

    

    this.sex = (Math.random() < 0.5) ? 'male' : 'female';
    this.maxRadius = (this.sex === 'male') ? 15 : 10;
    this.dna = [];
    this.mutate = function (index, mr, value) {
      if (Math.random() < mr) {
        this.dna[index] += random(value[0], value[1]);
      }
    };
    if (dna == undefined) {
      // food wheight
      this.dna[0] = 1;
      // poison wheight
      this.dna[1] = -1;
      // food perception
      this.dna[2] = random(20, 100);
      // posion perception
      this.dna[3] = random(20, 100);
    }
    else {
      this.dna[0] = dna[0];
      this.dna[1] = dna[1];
      this.dna[2] = dna[2];
      this.dna[3] = dna[3];
      this.mutate(0, mutationRate, [0.2, -0.2]);
      this.mutate(1, mutationRate, [-0.2, 0.2]);
      this.mutate(2, mutationRate, [-10, 20]);
      this.mutate(3, mutationRate, [-10, 20]);
    }
    // if(this.sex === 'male' || this.sex === 'female') {
    //   console.log('food :' + this.dna[0] + '| poison : ' + this.dna[1])
    // }

    
    let names_female = ['hanna', 'mona', 'kim', 'sweet', 'sofia', 'rose', 'laisy', 'daisy', 'mia'];
    let names_male = ['joe', 'jim', 'kim', 'keo', 'shaun', 'morgan', 'jery', 'tom', 'anu', 'brian', 'ninja'];
    if (this.sex === 'female') {
      this.name = names_female[Math.floor(random(0, names_female.length - 1))];
    }
    else if (this.sex === 'male') {
      this.name = names_male[Math.floor(random(0, names_male.length - 1))];
    }
  }

  /**
   * @method update()
   * updates velocity, position, and acceleration
   */
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.health -= this.healthDecrease;
  }
  
  /**
   * @method applyForce()
   * @param {Number} f 
   * applies force to acceleration
   */
  applyForce (f) { this.acc.add(f) }

  /**
   * @method dead()
   * return agent's is dead status
   */
  dead () {
    return (this.health < 0);
  }

  /**
   * @method boundaries()
   * check boundaries and limit agents within screen
   */
  boundaries () {
    let d = 50;
    let desire = null;
    if (this.pos.x < d) {
      desire = new Vector(this.maxSpeed, this.vel.y);
    }
    else if (this.pos.x > width - d) {
      desire = new Vector(-this.maxSpeed, this.vel.y);
    }
    if (this.pos.y < d) {
      desire = new Vector(this.vel.x, this.maxSpeed);
    }
    else if (this.pos.y > height - d) {
      desire = new Vector(this.vel.x, -this.maxSpeed);
    }
    if (desire !== null) {
      desire.normalize();
      desire.mult(this.maxSpeed);
      let steer = Vector.sub(desire, this.vel);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  }


  /**
   * @method defineFear()
   * @param {Array} wit
   * @param {Number} weight
   * @param {Number} perception
   * @param {Function} callback
   * a robust function to define fear which also can be used inversly 
   */
  defineFear (wit, weight, perception, callback) {
    let record = Infinity;
    let close = null;
    for (let i = wit.length - 1; i >= 0; i--) {
      let d = dist(this.pos.x, this.pos.y, wit[i].pos.x, wit[i].pos.y);
      if (d < this.radius) {
        if (callback) {
          callback.call(null, wit, i);
        }
      }
      else {
        if (d < record && d < perception) {
          record = d;
          close = wit[i];
        }
      }
    }
    // seek
    if (close !== null) {
      this.applyForce(this.seek(close).mult(weight));
    }
  }


  /**
   * @method Behavior()
   * @param {*} good 
   * @param {*} bad 
   * @param {*} weights 
   * food and poison handling 
   */
  Behavior (good, bad, weights) {
    let goodFood = this.eat(good, this.goodFoodDie, this.dna[2]);
    let badFood = this.eat(bad, this.badFoodDie, this.dna[3]);
    if (!weights) {
      goodFood.mult(this.dna[0]);
      badFood.mult(this.dna[1]);
    }
    else {
      goodFood.mult(weights[0]);
      badFood.mult(weights[1]);
    }
    this.applyForce(goodFood);
    this.applyForce(badFood);
  }

  /**
   * @method flock()
   * @param {*} agents 
   * calculates all the flocking code apply it to the acceleration
   */
  flock (agents) {
    let sep = this.separate(agents);
    let ali = this.align(agents);
    let coh = this.cohesion(agents);
    sep.mult(this.flockMultiplier.separate);
    ali.mult(this.flockMultiplier.align);
    coh.mult(this.flockMultiplier.cohesion);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }


  /**
   * @method seek()
   * @param {*} target 
   * simple method to seek something
   */
  seek (target) {
    let desired = null;
    desired = Vector.sub(target.pos, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    // this.applyForce(steer);
    return steer;
  }


  /**
   * @method separate()
   * @param {Array} agents 
   * part of flocking system
   */
  separate (agents) {
    let desiredseperation = this.radius * 4;
    let sum = new Vector();
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      let d = Vector.dist(this.pos, agents[i].pos);
      if (agents[i] !== this && (d > 0) && (d < desiredseperation)) {
        let diff = Vector.sub(this.pos, agents[i].pos);
        diff.normalize();
        diff.div(d);
        sum.add(diff);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
    else {
      return new Vector(0, 0);
    }
  };

  /**
   * @method align()
   * @param {Array} agents 
   * part of flocking system
   */
  align (agents) {
    let neighbordist = 50;
    let sum = new Vector(0, 0);
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      let d = Vector.dist(this.pos, agents[i].pos);
      if (agents[i] != this && (d > 0) && (d < neighbordist)) {
        sum.add(agents[i].vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
    else {
      return new Vector(0, 0);
    }
  }


  /**
   * @method cohesion()
   * @param {Array} agents 
   * part of flocking system
   */
  cohesion (agents) {
    let neighbordist = 20;
    let sum = new Vector(0, 0);
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      let d = Vector.dist(this.pos, agents[i].pos);
      if (agents[i] !== this && (d > 0) && (d < neighbordist)) {
        sum.add(agents[i].pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.sub(this.pos);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
    else {
      return new Vector(0, 0);
    }
  }


  /**
   * Eat Food
   * @param {Array} list
   * @param {Number} nutri
   * @param {Number} perception 
   * seeks the food and poison
   */
  eat (list, nutri, perception) {
    let record = Infinity;
    let close = null;
    for (let i = list.length - 1; i >= 0; i--) {
      let d = dist(this.pos.x, this.pos.y, list[i].pos.x, list[i].pos.y);
      // delete 
      if (d < (5 + this.radius)) {
        list.splice(i, 1);
        this.health += nutri;
        this.radius += nutri;
        if (this.radius > this.maxRadius) {
          this.radius = this.maxRadius;
        }
        if (this.health > 1) {
          this.health = 1;
        }
      }
      else {
        if (d < record && d < perception) {
          record = d;
          close = list[i];
        }
      }
    }
    // seek
    if (close !== null) {
      return this.seek(close);
    }
    return new Vector(0, 0);
  }

  /**
   * @method clone()
   * @param {FLoat} probability 
   * randomly returns a new Agent
   */
  clone (probability) {
    if (Math.random() < probability) {
      return new Agent(this.pos.x, this.pos.y, 5, this.dna);
    }
    return null;
  }

  
  /**
   * @method reproduce()
   * @param {Array} list
   * @param {Function} callback
   * Reproduction System
   * checks male and female agents and starts Reproduction
   * if they are close enough 
   */
  reproduce (list, callback) {
    let d = Infinity;
    for (let i = 0; i < list.length - 1; i++) {
      let agentA = list[i];
      for (let j = i + 1; j < list.length; j++) {
        let agentB = list[j];
        // get the distance
        let d = dist(agentA.pos.x, agentA.pos.y, agentB.pos.x, agentB.pos.y);
        if (d < (agentB.radius + agentA.radius)) {
          if ((agentA.radius > 8 && agentB.radius > 8)) {
            let x = agentB.pos.x + random(agentB.vel.x, agentA.vel.x);
            let y = agentB.pos.y + random(agentB.vel.y, agentA.vel.y);
            list.push(new Agent(x, y, 5, this.dna));
            return;
          }
        }
      }
    }
  }


  /**
   * Render Agent
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.beginPath();
    if (document.getElementById('names').checked) {
      ctx.fillStyle = 'white';
      ctx.fillText(this.name, this.pos.x - this.radius, this.pos.y - this.radius - 5);
      ctx.fill();
    }
    if (this.sex === 'male') {
      ctx.fillStyle = 'rgba(0,170,0,' + this.health + ')';
    }
    else if (this.sex === 'female') {
      ctx.fillStyle = 'rgba(255,39,201,' + this.health + ')';
    }
    else if (this.sex === 'pradator') {
      ctx.fillStyle = 'rgba(255,0,0,' + this.health + ')';
    }
    else if (this.sex === 'avoider') {
      ctx.fillStyle = 'rgba(255, 165, 0, ' + this.health + ')';
    }
    let angle = this.vel.heading() + Math.PI / 180;
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(angle);
    ctx.moveTo(this.radius, 0);
    ctx.lineTo(-this.radius, -this.radius + 2);
    ctx.lineTo(-this.radius, this.radius - 4);
    ctx.lineTo(this.radius, 0);
    ctx.fill();
    // DEBUG
    if (document.getElementById('debug').checked) {
      ctx.beginPath();
      ctx.strokeStyle = 'green';
      ctx.arc(0, 0, clamp(0, 100, this.dna[2]), 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.arc(0, 0, clamp(0, 100, this.dna[3]), 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
    ctx.closePath();
    ctx.restore();
  }
}
