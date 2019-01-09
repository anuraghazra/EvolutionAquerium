/**
 * @class Predator
 * @extends Agent
 */
class Predator extends Agent {
  constructor(x, y, radius, dna, color) {
    super(x, y, radius, dna, color);

    this.radius = radius || 10;
    this.maxRadius = 20;

    this.maxSpeed = 2;
    this.maxForce = 0.05;

    this.healthDecrease = 0.003;
    this.goodFoodMultiplier = 0.5;
    this.badFoodMultiplier = -0.5;

    this.sex = AGENT_TYPE.PREDATOR;
    this.color = [255, 0, 0];

    this.dna = this.SetDNA(dna);
    // if (!dna) {
    //   this.dna = [];
    //   this.dna[0] = 3;
    //   this.dna[1] = -5;
    //   this.dna[2] = random(0, 100);
    //   this.dna[3] = random(0, 100);
    // } else {
    //   this.dna = dna;
    // }

  }

  /**
   * @method clone()
   * @param {FLoat} probability 
   * randomly returns a new Agent
   */
  clone(probability) {
    if (Math.random() < probability) {
      return new Predator(this.pos.x, this.pos.y, 5, this.dna);
    }
    return null;
  }
}

/**
 * @class Avoider
 * @extends Agent
 */
class Avoider extends Agent {
  constructor(x, y, radius, dna, color) {
    super(x, y, radius, dna, color);

    this.radius = radius || 5;
    this.maxRadius = 10;

    this.maxSpeed = 4;
    this.maxForce = 0.2;

    this.healthDecrease = 0.003;
    this.goodFoodMultiplier = 0.5;
    this.badFoodMultiplier = -0.5;

    this.sex = AGENT_TYPE.AVOIDER;
    this.color = [255, 165, 0];

    this.dna = this.SetDNA(dna);

    // if (!dna) {
    //   this.dna = [];
    //   this.dna[0] = random(1, 2);
    //   this.dna[1] = random(-2, -5);
    //   this.dna[2] = random(0, 100);
    //   this.dna[3] = random(50, 100);
    // } else {
    //   this.dna = dna;
    // }
  }

  /**
   * @method clone()
   * @param {FLoat} probability 
   * randomly returns a new Agent
   */
  clone(probability) {
    if (Math.random() < probability) {
      return new Avoider(this.pos.x, this.pos.y, 5, this.dna);
    }
    return null;
  }
}

/**
 * @class Eater
 * @extends Agent
 */
class Eater extends Agent {
  constructor(x, y, radius, dna, color) {
    super(x, y, radius, dna, color);

    this.radius = radius || 5;
    this.maxRadius = 20;

    this.maxSpeed = 1.7;
    this.maxForce = 0.05;

    this.healthDecrease = 0.001;
    this.goodFoodMultiplier = 0.5;
    this.badFoodMultiplier = 0;

    this.sex = AGENT_TYPE.EATER;
    this.color = [0, 191, 255];

    this.dna = this.SetDNA(dna);
    // if (!dna) {
    //   this.dna = [];
    //   this.dna[0] = random(0.8, -1);
    //   this.dna[1] = random(1, 5);
    //   this.dna[2] = random(0, 100);
    //   this.dna[3] = random(50, 100);
    // } else {
    //   this.dna = dna;
    // }
  }

  /**
   * @method clone()
   * @param {FLoat} probability 
   * randomly returns a new Agent
   */
  clone(probability) {
    if (Math.random() < probability) {
      return new Eater(this.pos.x, this.pos.y, 5, this.dna);
    }
    return null;
  }
}
