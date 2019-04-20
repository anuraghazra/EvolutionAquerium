// controls mutation rate
const mutationRate = 0.5;
/**
 * @class Agent
 */
class BaseAgent {

  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} radius 
   * @param {Array} dna 
   */
  constructor(x, y, radius, dna, color, builder) {
    this.pos = new Vector(x, y);
    this.acc = new Vector(0, 0);
    this.vel = new Vector(0, -2);

    if (builder === undefined) builder = {};
    this.builder = builder;


    this.age = 1;
    this.health = 1;
    this.radius = radius || 5;
    this.maxSpeed = builder.maxSpeed || 1.5;
    this.maxForce = builder.maxForce || 0.05;
    this.healthDecrease = builder.healthDecrease || 0.003;
    this.goodFoodMultiplier = builder.goodFoodMultiplier || 0.5;
    this.badFoodMultiplier = builder.badFoodMultiplier || -0.4;
    this.color = color;
    this.hasReproduced = 0;

    // only for debuging purposes
    // this.uid = randomInt(9999);
    // this.parent = null;
    // this.childs = [];
    // this.partners = {};

    this.flock = new Flock(this);
    this.flockMultiplier = {
      separate: -0.1,
      align: 0.8,
      cohesion: 0.7
    };

    this.type = builder.type;
    this.sex = (random(1) < 0.5) ? 'MALE' : 'FEMALE';

    if (!this.color && this.getGender() === 'MALE') this.color = [0, 170, 0]
    if (!this.color && this.getGender() === 'FEMALE') this.color = [255, 39, 201]
    // if (color == undefined) {
    // } else {
    //   let mappedcolor = this.color.map(i => i + random(-50, 50));
    //   if (this.getGender() === 'MALE') this.color = mappedcolor;
    //   if (this.getGender() === 'FEMALE') this.color = mappedcolor;
    // }

    let names_female = [
      'hanna', 'mona', 'cutie',
      'sweety', 'sofia', 'rose',
      'laisy', 'daisy', 'mia'
    ];
    let names_male = [
      'joe', 'jim', 'kim',
      'keo', 'shaun', 'morgan',
      'jery', 'tom', 'anu',
      'brian', 'ninja', 'daniel'
    ];

    this.name = (this.getGender() === 'MALE') ? this.getRandomName(names_male) : this.getRandomName(names_female);
    this.maxRadius = builder.maxRadius || ((this.getGender() === 'FEMALE') ? 15 : 10);

    this.mutate = function (dnaindex, mr, value) {
      if (random(1) < mr) {
        dnaindex += random(value[0], value[1]);
      }
    };
    this.dna = this.SetDNA(dna);
  }

  getRandomName(arr) {
    return arr[Math.floor(random(0, arr.length - 1))];
  }

  getGender() {
    return this.sex;
  }

  SetDNA(dna) {
    let tmpdna = [];

    if (dna == undefined) {
      // food weight
      // poison weight
      // food perception
      // posion perception
      tmpdna[0] = random(0.5, 1);
      tmpdna[1] = random(-0.3, -0.8);
      tmpdna[2] = random(20, 100);
      tmpdna[3] = random(20, 100);
    }
    else {
      tmpdna[0] = dna[0];
      tmpdna[1] = dna[1];
      tmpdna[2] = dna[2];
      tmpdna[3] = dna[3];
      this.mutate(tmpdna[0], mutationRate, [0.2, -0.2]);
      this.mutate(tmpdna[1], mutationRate, [-0.2, 0.2]);
      this.mutate(tmpdna[2], mutationRate, [-10, 20]);
      this.mutate(tmpdna[3], mutationRate, [-10, 20]);
    }
    return tmpdna;
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
    this.health = clamp(this.health, 0, 1);
    this.radius = clamp(this.radius, 0, this.maxRadius);
    this.age += 0.01;
  }

  /**
   * @method applyForce()
   * @param {Number} f 
   * applies force to acceleration
   */
  applyForce(f) { this.acc.add(f) }

  /**
   * @method dead()
   * return agent's is dead status
   */
  isDead() {
    return (this.health <= 0);
  }

  /**
   * @method boundaries()
   * check boundaries and limit agents within screen
   */
  boundaries() {
    let d = 100;
    let desire = null;
    if (this.pos.x < d) {
      desire = new Vector(this.maxSpeed, this.vel.y);
    }
    else if (this.pos.x > WIDTH - d) {
      desire = new Vector(-this.maxSpeed, this.vel.y);
    }
    if (this.pos.y < d) {
      desire = new Vector(this.vel.x, this.maxSpeed);
    }
    else if (this.pos.y > HEIGHT - d) {
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
  defineFear(list, weight, perception, callback) {
    let record = Infinity;
    let close = null;
    for (let i = list.length - 1; i >= 0; i--) {
      let d = dist(this.pos.x, this.pos.y, list[i].pos.x, list[i].pos.y);
      if (d < this.radius) {
        if (callback) {
          callback.call(this, list, i);
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
      this.applyForce(this.flock.seek(close).mult(weight));
    }
  }


  /**
   * @method Behavior()
   * @param {*} good 
   * @param {*} bad 
   * @param {*} weights 
   * food and poison handling 
   */
  Behavior(good, bad, weights) {
    let goodFood = this.eat(good, this.goodFoodMultiplier, this.dna[2]);
    let badFood = this.eat(bad, this.badFoodMultiplier, this.dna[3]);
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
   * @method applyFlock()
   * @param {*} agents 
   * calculates all the flocking code apply it to the acceleration
   */
  applyFlock(agents) {
    let sep = this.flock.separate(agents);
    let ali = this.flock.align(agents);
    let coh = this.flock.cohesion(agents);
    // let wander = this.flock.wander();

    sep.mult(this.flockMultiplier.separate);
    ali.mult(this.flockMultiplier.align);
    coh.mult(this.flockMultiplier.cohesion);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    // this.applyForce(wander);
  }

  /**
   * @method updateFlockBehavior()
   * @param {*} separate 
   * @param {*} align 
   * @param {*} cohesion 
   */
  updateFlockBehavior(separate, align, cohesion) {
    this.flockMultiplier = {
      separate: parseFloat(separate),
      align: parseFloat(align),
      cohesion: parseFloat(cohesion)
    };
  }

  /**
   * Eat Food
   * @param {Array} list
   * @param {Number} nutri
   * @param {Number} perception 
   * seeks the food and poison
   */
  eat(list, nutri, perception) {
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
      return this.flock.seek(close);
    }
    return new Vector(0, 0);
  }

  /**
   * @method clone()
   * @param {FLoat} probability 
   * randomly returns a new Agent
   */
  clone(probability) {
    if (Math.random() < probability) {
      // this.pos.x, this.pos.y, 5, this.dna
      return this.builder.setPos(this.pos.x, this.pos.y).setRadius(5).build();
    }
    return null;
  }


  /**
   * @method reproduce()
   * @param {Array} list
   * Reproduction System
   * checks male and female agents and starts Reproduction
   * if they are close enough 
   */
  reproduce(boids) {
    let d = Infinity;
    for (let i = 0; i < boids.length - 1; i++) {
      let agentA = boids[i];
      d = dist(agentA.pos.x, agentA.pos.y, this.pos.x, this.pos.y);

      if (d < (this.radius + agentA.radius)) {
        let isAdult = (agentA.radius > 8 && this.radius > 8);
        let isNotSameGender = (agentA.getGender() !== this.getGender());
        let isHealthy = (agentA.health > 0.5 && this.health > 0.5);
        if (isAdult && isNotSameGender && isHealthy) {
          this.hasReproduced++;
          agentA.hasReproduced++;
          let x = this.pos.x + random(this.vel.x, agentA.vel.x);
          let y = this.pos.y + random(this.vel.y, agentA.vel.y);
          // let childColor = [155, 100, 255];
          // x, y, 5, this.dna, childColor
          let newchild = this.builder
          .setPos(x, y)
          .setRadius(5)
          .setDNA(this.dna)
          .build()
          // .setColor(childColor)
          
          // Only for debug purposes
          // this.partners[agentA.uid] = agentA;
          // agentA.partners[this.uid] = this;
          // newchild.parent = this;
          // this.childs.push(newchild);
          boids.push(newchild);
          return;
        }
      }
    }
  }

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
