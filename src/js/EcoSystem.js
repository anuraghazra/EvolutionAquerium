class EcoSystem {

  constructor(names) {
    // ALL THE ARRAYS
    this.names = names;
  }


  addBehavior(config) {
    let agent = this.names[config.name];
    let foodPoison = [this.names[config.like], this.names[config.dislike]];
    let likeDislikeWeight = config.likeDislikeWeight;
    let callback = config.callback;
    let fear = [];
    
    if (!agent) return;

    // PARSE FEAR ARRAY
    for (const i in config.fear) {
      fear.push([this.names[i], config.fear[i][0], config.fear[i][1], config.fear[i][2]]);
    }

    // GLOBAL FUNCTION :p
    batchUpdateAgents(agent, foodPoison, likeDislikeWeight, function (list, i) {
      let current = list[i];
      
      // CLONE (i can do that with callback but just experimenting)
      if (config.cloneItSelf) {
        let child = list[i].clone(config.cloneItSelf);
        if (child !== null) {
          list.push(child);
        }  
      }
      
      // APPLY FEAR
      for (let i = 0; i < fear.length; i++) {
        current.defineFear.apply(current, fear[i]);
      }

      callback && callback.call(current);
    });
  }


  render() {
    for (const i in this.names) {
      if (this.names[i][0] instanceof Agent) {
        batchRenderAgents(this.names[i]);
      }
    }
  }
}