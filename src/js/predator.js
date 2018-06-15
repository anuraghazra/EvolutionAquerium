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
function Predator(x, y, radius) {
  Predator._super.apply(this,[x,y,radius])
  this.pos = new Vector(x, y);
  this.acc = new Vector(0, 0);
  this.vel = new Vector(0, 0);

  this.canvasWidth = 1280;
  this.canvasHeight = 600;

  this.radius = radius;

  this.maxSpeed = 2;
  this.maxForce = 0.1;

  this.health = 1;
  this.healthDie = 0.001;
  this.sex = 'pradator';
  this.maxRadius = (this.sex === 'pradator') ? 15 : false;

  this.goodFoodDie = 0;
  this.badFoodDie = 0;

  this.dna = [1,1];
  // this.dna[0] = 2-Math.random()*2;
  // this.dna[1] = 2-Math.random()*2;

  this.color = 'red';

  this.predatorUpdate = function() {
    this.maxSpeed = this.radius/2;
  }
}

function Avoider(x, y, radius) {
  Avoider._super.apply(this,[x,y,radius])
  this.pos = new Vector(x, y);
  this.acc = new Vector(0, 0);
  this.vel = new Vector(0, 0);

  this.canvasWidth = 1280;
  this.canvasHeight = 600;

  this.radius = radius;

  this.maxSpeed = 3;
  this.maxForce = 0.2;

  this.health = 1;
  this.healthDie = 0.001;
  this.sex = 'avoider';
  this.maxRadius = 10;

  this.goodFoodDie = 0.5;
  this.badFoodDie = -0.9;

  this.dna = [-1,-1];
  // this.dna[0] = 2-Math.random()*2;
  // this.dna[1] = 2-Math.random()*2;

  this.color = 'orange';

}

inherits(Agent, Predator);
inherits(Agent, Avoider);
