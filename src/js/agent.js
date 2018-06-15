const mutationRate = 0.8;
function Agent(x, y, radius, dna) {
  this.pos = new Vector(x, y);
  this.acc = new Vector(0, 0);
  this.vel = new Vector(0, -2);

  this.canvasWidth = 1280;
  this.canvasHeight = 600;

  this.radius = radius;

  this.maxSpeed = 2;
  this.maxForce = 0.05;

  this.health = 1;
  this.healthDecrease = 0.005; 
  this.goodFoodDie = 0.5;
  this.badFoodDie = -0.8;
  
  this.sex = (Math.random() < 0.5) ? 'male' : 'female';
  this.maxRadius = (this.sex === 'male') ? 15 : 10;

  this.dna = [];
  if(dna == undefined) {
    // food wheight
    this.dna[0] = random(2,-2);
    // poison wheight
    this.dna[1] = random(2,-2);
    // food perception
    this.dna[2] = random(0,100);
    // posion perception
    this.dna[3] = random(0,100);
  } else {
    this.dna[0] = dna[0];
    if(Math.random() < mutationRate) {
      this.dna[0] += random(-0.85,0.85);
    }
    this.dna[1] = dna[1];
    if(Math.random() < mutationRate) {
      this.dna[1] += random(-0.85,0.85);
    }
    this.dna[2] = dna[2];
    if(Math.random() < mutationRate) {
      this.dna[2] += random(-9.5,9.5);
    }
    this.dna[3] = dna[3];
    if(Math.random() < mutationRate) {
      this.dna[3] += random(-9.5,9.5);
    }
  }

  // Update Position
  this.update = function() {
    this.vel.add(this.acc);

    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);

    this.acc.mult(0);

    this.health -= this.healthDecrease;
  }

  this.applyForce = function(f) {
    this.acc.add(f);
  }

  this.dead = function() {
    return (this.health < 0);
  }

  this.boundaries = function() {
    let d = 50;
    let desire = null;

    if(this.pos.x < d) {
      desire = new Vector(this.maxSpeed, this.vel.y);
    } else if (this.pos.x > width - d) {
      desire = new Vector(-this.maxSpeed, this.vel.y);
    }

    if(this.pos.y < d) {
      desire = new Vector(this.vel.x, this.maxSpeed);
    } else if (this.pos.y > height - d) {
      desire = new Vector(this.vel.x, -this.maxSpeed);
    }

    if(desire !== null) {
      desire.normalize();
      desire.mult(this.maxSpeed);
      let steer =  desire.subBy(this.vel);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  }



  this.attact = function(wit, weight, perception) {
    let record = Infinity;
    let close = null;

    for (let i = wit.length-1; i >= 0 ; i--) {
      let d = dist(this.pos.x, this.pos.y, wit[i].pos.x, wit[i].pos.y);
      if(d < perception) {
        record = d;
        close = wit[i];
      }
    }
    
    // seek
    if(close !== null) {
      this.applyForce(this.seek(close).mult(weight));
    }
  }

  /**
   * behaviours
   * @param {*} good 
   * @param {*} bad 
   */
  this.behaviour = function(good, bad, weights) {

    let goodFood = this.eat(good, this.goodFoodDie, this.dna[2]);
    let badFood = this.eat(bad, this.badFoodDie, this.dna[3]);
    

    if(!weights) {
      goodFood.mult(this.dna[0]);
      badFood.mult(this.dna[1]);
    } else {
      goodFood.mult(weights[0]);
      badFood.mult(weights[1]);
    }

    this.applyForce(goodFood);
    this.applyForce(badFood);
    
  }

  // SEEK Algorithm
  this.seek = function(target) {
    let desired = null;
    desired = target.pos.subBy(this.pos);
    desired.setMag(this.maxSpeed);

    let steer = desired.subBy(this.vel);
    steer.limit(this.maxForce);
    // this.applyForce(steer);
    return steer;
  }

  /**
   * Eat Food
   * @param {} list 
   */
  this.eat = function(list, nutri, perception) {
    let record = Infinity;
    let close = null;

    for (let i = list.length-1; i >= 0 ; i--) {
      let d = dist(this.pos.x, this.pos.y, list[i].pos.x, list[i].pos.y);

      // delete 
      if(d < (5+this.radius)) {
        list.splice(i, 1);
        this.health += nutri;
        this.radius += nutri;
        if(this.radius > this.maxRadius) {
          this.radius = this.maxRadius
        }
        clamp(0,1,this.health);

      } else {
        if(d < record && d < perception) {
          record = d;
          close = list[i];
        }
      }
    }
    
    // seek
    if(close !== null) {
      return this.seek(close);
    }

    return new Vector(0,0);
  }

  this.clone = function() {
    if(Math.random() < 0.002) {
      return new Agent(this.pos.x, this.pos.y, 5, this.dna)
    }
    return null;
  }

  /**
   * Reproduction System
   * @param {*} list 
   * @param {*} callback 
   */
  this.reproduce = function (list, callback) {
    let d = Infinity;
    for (let i = 0; i < list.length - 1; i++) {
      let agentA = list[i];
      for (let j = i + 1; j < list.length; j++) {
        let agentB = list[j];
        // get the distance
        let d = dist(agentA.pos.x, agentA.pos.y, agentB.pos.x, agentB.pos.y);
        
        if (d < (agentB.radius+agentA.radius)) {
          if ( ((agentB.sex === 'male' && agentA.sex === 'female') 
            || (agentA.sex === 'male' && agentB.sex === 'female') )) {

            if(Math.random() < 0.001) {
              let x = Math.cos(agentB.vel.heading()) +this.pos.x;
              let y = Math.sin(agentB.vel.heading()) +this.pos.y;
              list.push(new Agent(x, y, 5, this.dna));
            }
            return;
          }
        }
      }
    }
  }

  /**
   * Render Agent
   * @param {*} ctx 
   */
  this.render = function(ctx) {
    ctx.beginPath();

    if(this.sex === 'male') {
      ctx.fillStyle = 'rgba(0,170,0,'+this.health+')';
    } else if (this.sex === 'female') {
      ctx.fillStyle = 'rgba(255,39,201,'+this.health+')';
    } else if(this.sex === 'pradator') {
      ctx.fillStyle = 'rgba(255,0,0,'+this.health+')';
    } else {
      ctx.fillStyle = this.color;
    }

    let angle = this.vel.heading() + Math.PI/180;

    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(angle);
    ctx.moveTo(this.radius,0);
    ctx.lineTo(-this.radius,-this.radius+2);
    ctx.lineTo(-this.radius,this.radius-4);
    ctx.lineTo(this.radius,0);
    
    ctx.fill();
    
    // DEBUG
    
    // ctx.beginPath();
    // ctx.strokeStyle = 'green';
    // ctx.arc(0,0,clamp(0,100,this.dna[2]), 0, Math.PI*2);
    // ctx.stroke();
    // ctx.closePath();

    // ctx.beginPath();
    // ctx.strokeStyle = 'red';
    // ctx.arc(0,0,clamp(0,100,this.dna[3]), 0, Math.PI*2);
    // ctx.stroke();
    // ctx.closePath();
    
    ctx.closePath();
    ctx.restore();
  }
}