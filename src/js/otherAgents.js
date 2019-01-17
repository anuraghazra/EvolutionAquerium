/**
 * @class AgentBuilder
 * @pattern Builder
 * @description
 * AgentBuilder class Builds a BaseAgent Class with
 * specific variables 
 */
class AgentBuilder {
  constructor(type) {
    this.acc = new Vector(0, 0);
    this.vel = new Vector(0, -2);

    this.type = type;
  }

  setPos(x, y) {
    this.pos = new Vector(x, y);
    return this;
  }
  setMaxRadius(r = 20) {
    this.maxRadius = r;
    return this;
  }
  setRadius(r = 10) {
    this.radius = r;
    return this;
  }
  setMaxSpeed(val = 1.5) {
    this.maxSpeed = val;
    return this;
  }
  setMaxForce(val = 0.05) {
    this.maxForce = val;
    return this;
  }
  setHealthDecrease(val = 0.003) {
    this.healthDecrease = val;
    return this;
  }
  setFoodMultiplier(arr) {
    this.goodFoodMultiplier = arr[0];
    this.badFoodMultiplier = arr[1];
    return this;
  }
  setColor(color) {
    this.color = color;
    return this;
  }
  setDNA(dna) {
    this.dna = dna;
    return this;
  }

  build() {
    return new BaseAgent(
      this.pos.x, this.pos.y,
      this.radius, this.dna,
      this.color, this
    );
  }
}


// CLASSES


/**
 * @class Agent
 * @extends BaseAgent
 */
let Agent = new AgentBuilder('CREATURE');


/**
 * @class Predator
 * @extends BaseAgent
 */
let Predator = new AgentBuilder('PREDATOR')
  .setRadius(10)
  .setMaxSpeed(2)
  .setMaxForce(0.05)
  .setHealthDecrease(0.002)
  .setColor([255, 0, 0])
  .setFoodMultiplier([0.5, -0.5]);


/**
 * @class Avoider
 * @extends Agent
 */
let Avoider = new AgentBuilder('AVOIDER')
  .setRadius(5)
  .setMaxRadius(10)
  .setMaxSpeed(4)
  .setMaxForce(0.2)
  .setHealthDecrease(0.003)
  .setColor([255, 165, 0])
  .setFoodMultiplier([0.5, -0.5])


/**
 * @class Eater
 * @extends Agent
 */
let Eater = new AgentBuilder('EATER')
  .setRadius(5)
  .setMaxRadius(20)
  .setMaxSpeed(1.7)
  .setMaxForce(0.05)
  .setHealthDecrease(0.001)
  .setColor([0, 191, 255])
  .setFoodMultiplier([0.5, 0])

/**
* @class Mother
* @extends Agent
*/
let Mother = new AgentBuilder('MOTHER')
  .setDNA([1, 1, 200, 200])
  .setRadius(15)
  .setMaxRadius(20)
  .setMaxSpeed(3)
  .setMaxForce(0.05)
  .setHealthDecrease(0.000001)
  .setColor([255, 255, 255])
  .setFoodMultiplier([0.5, 0])

//#region old classes
// class Predator extends Agent {
//   constructor(x, y, radius, dna, color) {
//     super(x, y, radius, dna, color);

//     this.radius = radius || 10;
//     this.maxRadius = 20;

//     this.maxSpeed = 2;
//     this.maxForce = 0.05;

//     this.healthDecrease = 0.003;
//     this.goodFoodMultiplier = 0.5;
//     this.badFoodMultiplier = -0.5;

//     // this.sex = AGENT_TYPE.PREDATOR;
//     this.color = [255, 0, 0];

//     this.dna = this.SetDNA(dna);
//     // if (!dna) {
//     //   this.dna = [];
//     //   this.dna[0] = 3;
//     //   this.dna[1] = -5;
//     //   this.dna[2] = random(0, 100);
//     //   this.dna[3] = random(0, 100);
//     // } else {
//     //   this.dna = dna;
//     // }

//   }

//   /**
//    * @method clone()
//    * @param {FLoat} probability 
//    * randomly returns a new Agent
//    */
//   clone(probability) {
//     if (Math.random() < probability) {
//       return new Predator(this.pos.x, this.pos.y, 5, this.dna);
//     }
//     return null;
//   }
// }



// class Avoider extends Agent {
//   constructor(x, y, radius, dna, color) {
//     super(x, y, radius, dna, color);

//     this.radius = radius || 5;
//     this.maxRadius = 10;

//     this.maxSpeed = 4;
//     this.maxForce = 0.2;

//     this.healthDecrease = 0.003;
//     this.goodFoodMultiplier = 0.5;
//     this.badFoodMultiplier = -0.5;

//     this.sex;
//     this.color = [255, 165, 0];

//     this.dna = this.SetDNA(dna);

//     // if (!dna) {
//     //   this.dna = [];
//     //   this.dna[0] = random(1, 2);
//     //   this.dna[1] = random(-2, -5);
//     //   this.dna[2] = random(0, 100);
//     //   this.dna[3] = random(50, 100);
//     // } else {
//     //   this.dna = dna;
//     // }
//   }

//   /**
//    * @method clone()
//    * @param {FLoat} probability 
//    * randomly returns a new Agent
//    */
//   clone(probability) {
//     if (Math.random() < probability) {
//       return new Avoider(this.pos.x, this.pos.y, 5, this.dna);
//     }
//     return null;
//   }
// }



// class Eater extends Agent {
//   constructor(x, y, radius, dna, color) {
//     super(x, y, radius, dna, color);

//     this.radius = radius || 5;
//     this.maxRadius = 20;

//     this.maxSpeed = 1.7;
//     this.maxForce = 0.05;

//     this.healthDecrease = 0.001;
//     this.goodFoodMultiplier = 0.5;
//     this.badFoodMultiplier = 0;

//     // this.sex = AGENT_TYPE.EATER;
//     this.color = [0, 191, 255];

//     this.dna = this.SetDNA(dna);
//     // if (!dna) {
//     //   this.dna = [];
//     //   this.dna[0] = random(0.8, -1);
//     //   this.dna[1] = random(1, 5);
//     //   this.dna[2] = random(0, 100);
//     //   this.dna[3] = random(50, 100);
//     // } else {
//     //   this.dna = dna;
//     // }
//   }

//   /**
//    * @method clone()
//    * @param {FLoat} probability 
//    * randomly returns a new Agent
//    */
//   clone(probability) {
//     if (Math.random() < probability) {
//       return new Eater(this.pos.x, this.pos.y, 5, this.dna);
//     }
//     return null;
//   }
// }
//#endregion