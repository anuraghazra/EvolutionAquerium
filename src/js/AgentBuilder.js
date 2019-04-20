/**
 * @class AgentBuilder
 * @pattern Builder
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
  setRadius(r = 5) {
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
 * @extends BaseAgent
 */
let Avoider = new AgentBuilder('AVOIDER')
  .setRadius(5)
  .setMaxRadius(8)
  .setMaxSpeed(4)
  .setMaxForce(0.2)
  .setHealthDecrease(0.003)
  .setColor([255, 165, 0])
  .setFoodMultiplier([0.5, -0.5])


/**
 * @class Eater
 * @extends BaseAgent
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
* @extends BaseAgent
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