/**
 * @class EcoSystem
 */
class EcoSystem {

  constructor() {
    this.groups = {};     // agents
    this.entities = {};   // generic container (food, poison)
    this.agents = {};     // agent classes
    this.behaviors = {};  // calculated behaviors
  }

  /**
   * @method addEntities
   * @param {Object} names 
   */
  addEntities(names) {
    for (const i in names) {
      this.entities[i] = names[i];
    }
  }

  /**
   * @method registerAgents
   * @param {Object} agents 
   * agents object is a Object of BaseAgent Constructor
   */
  registerAgents(agents) {
    this.agents = agents;
    for (const i in agents) {
      this.groups[i] = []
    }
  }

  /**
   * @method initialPopulation
   * @param {Object} init 
   */
  initialPopulation(init) {
    this.initPopulation = init;
    for (const i in this.initPopulation) {
      if (this.groups[i] !== undefined) {
        this.addAgent(this.agents[i], this.groups[i], this.initPopulation[i]);
      }
    }
  }

  /**
   * @method add
   * @param {String} type 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Nmber} radius 
   * adds creatures to groups object
   */
  add(type, x, y, radius) {
    radius = radius || 5;
    let name = this.agents[type]
    this.groups[type].push(name.setPos(x, y).setRadius(radius).build());
  }


  /**
   * @metho addAgent
   * @param {AgentBuilder} name 
   * @param {Array} list 
   * @param {Number} max 
   * adds agents to specific list in random pos
   */
  addAgent(name, list, max) {
    for (let i = 0; i < max; i++) {
      let x = random(WIDTH);
      let y = random(HEIGHT);
      let radius = random(4, 5);
      if (isInsideWall(x, y, radius)) {
        x = random(WIDTH);
        y = random(HEIGHT);
      }
      if (name instanceof AgentBuilder) {
        list.push(name.setPos(x, y).setRadius(radius).build());
      }
    }
  }



  /**
   * @method addBehavior
   * @param {Object} config 
   * @param {String} config.name
   * @param {String} config.like
   * @param {String} config.dislike
   * @param {Array} config.likeDislikeWeight
   * @param {Number} config.cloneItSelf
   * @param {Object} config.fear
   * @param {Function} config.callback
   */
  addBehavior(config) {
    let agents = this.groups[config.name];
    let foodPoison = [this.entities[config.like], this.entities[config.dislike]];
    let likeDislikeWeight = config.likeDislikeWeight;
    let callback = config.callback;
    let fear = [];
    let cloneItSelf = config.cloneItSelf;

    if (!agents) return;
    // PARSE FEAR ARRAY
    for (const i in config.fear) {
      fear.push([this.groups[i], config.fear[i][0], config.fear[i][1], config.fear[i][2]]);
    }
    this.behaviors[config.name] = { agents, foodPoison, likeDislikeWeight, callback, fear, cloneItSelf }
  }

  /**
   * @method update
   * updates all the behaviors 
   */
  update() {
    for (const a in this.behaviors) {
      let behave = this.behaviors[a];
      this.batchUpdateAgents(behave.agents, behave.foodPoison, behave.likeDislikeWeight, (list, i) => {
        let current = list[i];

        // CLONE (i can do that with callback but just experimenting)
        if (behave.cloneItSelf) {
          let child = list[i].clone(behave.cloneItSelf);
          if (child !== null) {
            list.push(child);
          }
        }

        // APPLY FEAR
        for (let i = 0; i < behave.fear.length; i++) {
          current.defineFear.apply(current, behave.fear[i]);
        }

        behave.callback && behave.callback.call(current);
      })
    }
  }


  /**
   * @method batchUpdateAgents
   * @param {Array} list 
   * @param {Array} foodPoison 
   * @param {Number} weight 
   * @param {Function} callback 
   */
  batchUpdateAgents(list, foodPoison, weight, callback) {
    for (let i = list.length - 1; i >= 0; i--) {
      list[i].update();
      list[i].updateFlockBehavior(flk_slider_separate.value, flk_slider_align.value, flk_slider_cohesion.value);
      list[i].applyFlock(list);
      if (foodPoison[0] !== undefined && foodPoison[1] !== undefined) {
        list[i].Behavior(foodPoison[0], foodPoison[1], weight);
      }
      list[i].boundaries();

      if (callback) {
        callback.call(list[i], list, i);
      }

      // Kill the agent
      if (list[i].isDead()) {
        let x = list[i].pos.x;
        let y = list[i].pos.y;
        foodPoison && foodPoison[0].push({ pos: new Vector(x, y) });
        list.splice(i, 1);
      }
    }
  }


  /**
   * @method render
   */
  render() {
    for (const i in this.groups) {
      if (this.groups[i][0] instanceof BaseAgent) {
        batchRenderAgents(this.groups[i]);
      }
    }
  }
}