function Agent(x, y, radius) {
  this.pos = new Vector(x, y);
  this.acc = new Vector(0, 0);
  this.vel = new Vector(0, -2);

  this.canvasWidth = 1280;
  this.canvasHeight = 600;

  this.radius = radius;

  this.maxSpeed = 2;
  this.maxForce = 0.05;

  this.health = 1;
  this.healthDie = 0.005; 
  this.goodFoodDie = 2;
  this.badFoodDie = -0.3;
  
  this.sex = (Math.random() < 0.5) ? 'male' : 'female';
  this.maxRadius = (this.sex === 'male') ? 15 : 10;

  this.dna = [1,-1];
  this.dna[0] = 2-Math.random()*2;
  this.dna[1] = 2-Math.random()*2;

  // Update Position
  this.update = function() {
    this.vel.add(this.acc);

    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);

    this.acc.mult(0);

    this.health -= this.healthDie;

    // Collision
    if(this.pos.x < 0) {
      this.pos.x = this.canvasWidth;
    }
    if(this.pos.x > this.canvasWidth) {
      this.pos.x = 0;
    }
    if(this.pos.y < 0) {
      this.pos.y = this.canvasHeight;
    }
    if(this.pos.y > this.canvasHeight) {
      this.pos.y = 0;
    }
  }

  this.applyForce = function(f) {
    this.acc.add(f);
  }

  this.dead = function() {
    return (this.health < 0);
  }


  /**
   * behaviours
   * @param {*} good 
   * @param {*} bad 
   */
  this.behaviour = function(good, bad, weights) {

    let goodFood = this.eat(good, this.goodFoodDie);
    let badFood = this.eat(bad, this.badFoodDie);

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


  function dist(px, py, qx, qy) {
    let dx = px-qx;
    let dy = py-qy;
    return Math.sqrt(dx*dx+dy*dy);
  }

  /**
   * Eat Food
   * @param {} list 
   */
  this.eat = function(list, nutri) {
    let record = Infinity;
    let close = -1;

    for (let i = 0; i < list.length; i++) {
      let d = dist(this.pos.x, this.pos.y, list[i].pos.x, list[i].pos.y);
      if(d < record) {
        record = d;
        close = i;
      }
    }
    
    // delete and seek
    if(record < 5) {
      list.splice(close, 1);
      this.health += nutri;
      this.radius += nutri;
      if(this.health > 1) {
        this.health = 1;
      }
      if(this.radius > this.maxRadius) {
        this.radius = this.maxRadius;
      }
    } else if(close > -1) {
      return this.seek(list[close]);
    }
    return new Vector(0,0);
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
        
        if (d < agentB.radius+agentA.radius) {
          if ( (agentB.sex === 'male' && agentA.sex === 'female') 
            || (agentA.sex === 'male' && agentB.sex === 'female') ) {

            let x = agentA.pos.x;
            let y = agentA.pos.y;
            list.push(new Agent(x, y, 4)
                      );
            if (callback) {
              callback();
            }
            continue;
          }
          return;
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
    ctx.closePath();
    ctx.restore();
  }
}