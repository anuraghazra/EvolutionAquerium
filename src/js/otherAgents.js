function inherits(parent, child) {
  child._super = parent;
  child.prototype = Object.create(parent.prototype, {
    constructor : {
      value : child,
      enumerable : false, 
      writable : true,
      configurable : true
    }
  })
}
function Predator(x, y, radius, dna) {
  Predator._super.apply(this,[x,y,radius])
  this.pos = new Vector(x, y);
  this.acc = new Vector(0, 0);
  this.vel = new Vector(0, -2);

  this.radius = radius;

  this.maxSpeed = 2;
  this.maxForce = 0.05;

  this.health = 1;
  this.healthDecrease = 0.002; 
  this.goodFoodDie = 0.5;
  this.badFoodDie = -0.2;
  this.sex = 'pradator';
  this.maxRadius = 20;

  this.dna = [];
  // food wheight
  this.dna[0] = 3;
  // poison wheight
  this.dna[1] = -5
  // food perception
  this.dna[2] = random(0,100);
  // posion perception
  this.dna[3] = random(0,100);

  this.color = 'red';

  this.predatorUpdate = function() {
    this.maxSpeed = this.radius/2;
  }
  
}

function Avoider(x, y, radius) {
  Avoider._super.apply(this,[x,y,radius])
  this.pos = new Vector(x, y);
  this.acc = new Vector(0, 0);
  this.vel = new Vector(0, 2);

  this.radius = 5;

  this.maxSpeed = 5;
  this.maxForce = 0.4;

  this.health = 1;
  this.healthDecrease = 0.002;
  this.sex = 'avoider';
  this.maxRadius = 10;

  this.goodFoodDie = 0.5;
  this.badFoodDie = -1;

  this.dna = [];
  // food wheight
  this.dna[0] = random(0.8,-1);
  // poison wheight
  this.dna[1] = random(-0.8,1);
  // food perception
  this.dna[2] = random(0,100);
  // posion perception
  this.dna[3] = random(0,100);

  console.log('food :' + this.dna[0] + '| poison : ' + this.dna[1])

  this.color = 'orange';

  this.birthNew = function() {
    if(Math.random() < 0.05) {
      return new Agent(this.pos.x, this.pos.y, 5, this.dna)
    }
    return null;
  }
}

inherits(Agent, Predator);
inherits(Agent, Avoider);
