/**
 * @class Predator
 * @extends Agent
 */
class Predator extends Agent {

  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} radius 
   * @param {Array} dna 
   */
  constructor(x, y, radius, dna) {
    super();
    
    this.pos = new Vector(x, y);
    this.acc = new Vector(0, 0);
    this.vel = new Vector(0, -2);
    this.radius = radius;
    this.maxSpeed = 2;
    this.maxForce = 0.05;
    this.health = 1;
    this.healthDecrease = 0.003;
    this.goodFoodMultiplier = 0.5;
    this.badFoodMultiplier = -0.5;
    this.sex = 'predator';
    this.maxRadius = 20;
    this.dna = [];
    this.dna[0] = 3;
    this.dna[1] = -5;
    this.dna[2] = random(0, 100);
    this.dna[3] = random(0, 100);
    this.color = 'red';
    this.predatorUpdate = function () {
      this.maxSpeed = this.radius / 2;
    };
  }
}

/**
 * @class Avoider
 * @extends Agent
 */
class Avoider extends Agent {
  
  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} radius 
   */
  constructor(x, y, radius) {
    super(x, y, radius);

    this.pos = new Vector(x, y);
    this.acc = new Vector(0, 0);
    this.vel = new Vector(0, 2);
    this.radius = 5;
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    this.health = 1;
    this.healthDecrease = 0.003;
    this.sex = 'avoider';
    this.maxRadius = 10;
    this.goodFoodMultiplier = 0.5;
    this.badFoodMultiplier = -0.5;
    this.dna = [];
    this.dna[0] = random(0.8, -1);
    this.dna[1] = random(1, 5);
    this.dna[2] = random(0, 100);
    this.dna[3] = random(50, 100);
    this.color = 'orange';
    this.birthNew = function () {
      if (Math.random() < 0.05) {
        return new Agent(this.pos.x, this.pos.y, 5, this.dna);
      }
      return null;
    };
  }
}



/**
 * @class Eater
 * @extends Agent
 */
class Eater extends Agent {
  
  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} radius 
   */
  constructor(x, y, radius) {
    super(x, y, radius);

    this.pos = new Vector(x, y);
    this.acc = new Vector(0, 0);
    this.vel = new Vector(0, 2);
    this.radius = 5;
    this.maxSpeed = 1.7;
    this.maxForce = 0.05;
    this.health = 1;
    this.healthDecrease = 0.001;
    this.sex = 'eater';
    this.maxRadius = 20;
    this.goodFoodMultiplier = 1.0;
    this.badFoodMultiplier = 0;

    this.dna = [];
    this.dna[0] = random(0.8, -1);
    this.dna[1] = random(1, 5);
    this.dna[2] = random(0, 100);
    this.dna[3] = random(50, 100);
    this.color = 'deepskyblue';
    this.birthNew = function () {
      if (Math.random() < 0.05) {
        return new Agent(this.pos.x, this.pos.y, 5, this.dna);
      }
      return null;
    };
  }
}
