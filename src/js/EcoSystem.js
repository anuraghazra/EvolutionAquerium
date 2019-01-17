class EcoSystem {

  constructor() {
    // ALL THE ARRAYS
    this.groups = {};     // agents
    this.entities = {};   // generic container (food, poison)
    this.agents = {};     // agent classes
    this.behaviors = {};  // calculated behaviors
  }

  addEntities(names) {
    for (const i in names) {
      this.entities[i] = names[i];
    }
  }

  initialPopulation(init) {
    this.initPopulation = init;

    for (const i in this.initPopulation) {
      if (this.groups[i] !== undefined) {
        this.addAgent(this.agents[i], this.groups[i], this.initPopulation[i]);
      }
    }
  }

  registerAgents(agents) {
    for (const i in agents) {
      this.agents[i] = agents[i];
      this.groups[i] = new Array();
    }
  }

  addAgent(name, list, max) {
    for (let i = 0; i < max; i++) {
      let x = random(WIDTH);
      let y = random(HEIGHT);
      let radius = random(5, 7);
      if (isInsideWall(x, y, radius)) {
        x = random(WIDTH);
        y = random(HEIGHT);
      }
      if (name instanceof AgentBuilder) {
        list.push(name.setPos(x, y).setRadius(radius).build());
      }
    }
  }

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

  update() {
    for (const a in this.behaviors) {
      let behave = this.behaviors[a];
      this.batchUpdateAgents(behave.agents, behave.foodPoison, behave.likeDislikeWeight, function (list, i) {
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
      }.bind(this))
    }
  }


  /**
   * @method batchUpdateAgents()
   * @param {Array} list 
   * @param {Array} like 
   * @param {Array} dislike 
   * @param {2DArray} weight 
   * @param {Function} callback 
   * updates the flocking, behavior, boundaries, and renders all the agents
   * and also checks for dead state
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
        foodPoison&&foodPoison[0].push({ pos: new Vector(x, y) });
        list.splice(i, 1);
      }
    }
  }

  render() {
    for (const i in this.groups) {
      if (this.groups[i][0] instanceof BaseAgent) {
        batchRenderAgents(this.groups[i]);
      }
    }
  }
}