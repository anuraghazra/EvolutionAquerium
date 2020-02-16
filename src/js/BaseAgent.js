// controls mutation rate
const mutationRate = 0.5;
/**
 * @class Agent
 */
class BaseAgent extends Renderer {
  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} radius 
   * @param {Array} dna 
   */
  constructor(x, y, radius = 5, dna, color, builder = {}) {
    super();
    this.pos = new Vector(x, y);
    this.acc = new Vector(0, 0);
    this.vel = new Vector(0, -2);

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

    this.female_names = [
      'hanna', 'mona', 'cutie',
      'sweety', 'sofia', 'rose',
      'laisy', 'daisy', 'mia'
    ];
    this.male_names = [
      'joe', 'jim', 'kim',
      'keo', 'shaun', 'morgan',
      'jery', 'tom', 'anu',
      'brian', 'ninja', 'daniel'
    ];

    this.type = builder.type;
    this.sex = random(1) < 0.5 ? 'MALE' : 'FEMALE';

    if (!this.color && this.getGender() === 'MALE') this.color = [0, 170, 0];
    if (!this.color && this.getGender() === 'FEMALE') this.color = [255, 39, 201];

    this.name = this.getRandomName()
    this.maxRadius = builder.maxRadius || (this.getGender() === 'FEMALE') ? 15 : 10;

    this.mutate = function (dnaindex, mr, value) {
      if (random(1) < mr) {
        dnaindex += random(value[0], value[1]);
      }
    };
    this.dna = this.setDNA(dna);
  }

  getRandomName() {
    if (this.getGender() === 'MALE') {
      return getRandomArrayItem(this.male_names);
    }
    return getRandomArrayItem(this.female_names);
  }

  getGender() {
    return this.sex;
  }

  setDNA(dna) {
    let tmpdna = [];

    if (dna == undefined) {
      tmpdna[0] = random(0.5, 1);     // food weight
      tmpdna[1] = random(-0.3, -0.8); // poison weight
      tmpdna[2] = random(20, 100);    // food perception
      tmpdna[3] = random(20, 100);    // poison perception
    } else {
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

  isDead() {
    return (this.health <= 0);
  }

  /**
   * @method boundaries()
   * check boundaries and limit agents within screen
   */
  boundaries() {
    let maxDist = 100;
    let desire = null;
    if (this.pos.x < maxDist) {
      desire = new Vector(this.maxSpeed, this.vel.y);
    }
    else if (this.pos.x > WIDTH - maxDist) {
      desire = new Vector(-this.maxSpeed, this.vel.y);
    }
    if (this.pos.y < maxDist) {
      desire = new Vector(this.vel.x, this.maxSpeed);
    }
    else if (this.pos.y > HEIGHT - maxDist) {
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
      let maxDist = dist(this.pos.x, this.pos.y, list[i].pos.x, list[i].pos.y);
      if (maxDist < this.radius) {
        callback && callback.call(this, list, i);
      } else {
        if (maxDist < record && maxDist < perception) {
          record = maxDist;
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
    } else {
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
      let maxDist = dist(this.pos.x, this.pos.y, list[i].pos.x, list[i].pos.y);
      // delete 
      if (maxDist < (5 + this.radius)) {
        list.splice(i, 1);
        this.health += nutri;
        this.radius += nutri;
        if (this.radius > this.maxRadius) {
          this.radius = this.maxRadius;
        }
      } else {
        if (maxDist < record && maxDist < perception) {
          record = maxDist;
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
    // this.pos.x, this.pos.y, 5, this.dna
    if (Math.random() < probability) {
      return this.builder.setPos(this.pos.x, this.pos.y).setRadius(5).build();
    }
    return null;
  }

  /**
   * Check if the Agent can reproduce
   * @param {BaseAgent} agentA 
   * @returns {Boolean} 
   */
  canReproduceWith(agentA) {
    let isAdult = (agentA.radius + this.radius > 16);
    let isSameGender = agentA.getGender() === this.getGender();
    let isHealthy = (agentA.health + this.health > 0.9);

    return (isAdult && !isSameGender && isHealthy)
  }

  /**
   * 
   * @param {Array} boids 
   * @param {BaseAgent} agentA 
   */
  birthNewChild(boids, agentA) {
    this.hasReproduced++;
    agentA.hasReproduced++;
    let x = this.pos.x + random(this.vel.x, agentA.vel.x);
    let y = this.pos.y + random(this.vel.y, agentA.vel.y);
    let newchild = this.builder
      .setPos(x, y)
      .setRadius(5)
      .setDNA(this.dna)
      .build()

    boids.push(newchild);
    // Only for debug purposes
    // let childColor = [155, 100, 255];
    // this.partners[agentA.uid] = agentA;
    // agentA.partners[this.uid] = this;
    // newchild.parent = this;
    // this.childs.push(newchild);
  }

  /**
   * @method reproduce()
   * @param {Array} boids
   * Reproduction System
   * checks male and female agents and starts Reproduction
   * if they are close enough 
   */
  reproduce(boids) {
    let maxDist = Infinity;
    let agentB = this;
    for (let i = 0; i < boids.length - 1; i++) {
      let agentA = boids[i];
      maxDist = dist(agentA.pos.x, agentA.pos.y, this.pos.x, this.pos.y);

      if (maxDist < (agentB.radius + agentA.radius)) {
        if (this.canReproduceWith(agentA)) {
          this.birthNewChild(boids, agentA);
          return;
        }
      }
    }
  }
}
