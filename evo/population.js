const Population = function(Constructor_Type, minPopulation, maxPopulation) {
    const minPop = minPopulation;
    const maxPop = maxPopulation;
    const Type = Constructor_Type;
    const samples = [];

    let totalAge = 0;
    let oldest = 0;
    
    this.init = function() {
        for (let i = 0; i < minPop; ++i) {
            samples.push(new_sample())
        }
    }

    this.update = function(fields) {
        totalAge = 0;
        oldest = 0;
        for (let i = 0; i < samples.length; ++i) {
            // collect meta-data
            const age = samples[i].getAge();
            totalAge += age;
            if (oldest < age) oldest = age;
            
            //reset features 
            samples[i].resetFeatures();

            //eat
            samples[i].eat(fields)

            if (Type === Cell)
                samples[i].updateFeatures(fields, samples, i);
            if (Type === Carnivore)
                samples[i].updateFeatures(fields);

            samples[i].update();

            // asexual reproduction
            if (samples[i].energy > 75 && int(random(0,45)) == 1) {
                let child = mate(samples[i]);
                if (child) samples.push(child);
            }
            
            // sexual reproduction
            if (samples[i].getReproduce()) {
                for (let j = 0; j < samples.length; ++j) {
                    if (i != j && samples[i].intersects(samples[j])) {
                        let child = mate(samples[i], samples[j]);
                        if (child) samples.push(child);
                        
                        break;
                    }
                }
            }

            samples[i].draw();
        }
    }

    this.drawInformation = function(height, name='default') {
        const spacer = 16;
        fill(0);
        stroke(0);
        textAlign(LEFT);
        text(name, canvasSize + 10, height)
        text("Left alive: " + samples.length, canvasSize + 10, height + spacer);
        text("Avg age: " + totalAge / samples.length, canvasSize + 10, height + spacer*2);
        text("oldest: " + oldest, canvasSize + 10, height + spacer*3);
    }

    this.addMinimum = function() {
        if (samples.length >= minPop) return;

        const parentWheel = selectionWheel();

        while (samples.length < minPop) {
            //random spawn events
            const odds = int(random(0,3));
            if (odds == 0) {
                samples.push(new_sample());
            } else if (odds == 1) {
                samples.push(new_sample(random(parentWheel)));
            } else  {
                samples.push(mate(random(parentWheel), random(parentWheel)));
            }
            samples[samples.length - 1].energy = 15;
        }
    }

    this.removeExcess = function() {
        while (samples.length > maxPop)
            removeOne();
    }

    this.removeDead = function() {
        for (let i = 0; i < samples.length; ++i) {
            if (!samples[i].isAlive || samples[i].energy < 0)
                removeOne(i);
        }
    }

    this.getSamples = function() {
        return samples
    }
    
    function selectionWheel() {
        let result = [];
    
        const now = new Date().getTime();
        samples.forEach((sample) => {
            const fitness = (now - sample.start) / 1000;
            for (let i = 0; i < Math.ceil(fitness); ++i) {
                result.push(sample);
            }
        });
    
        return result;
    }

    function removeOne(index=null) {
        if (index === null) 
            samples.splice(int(random(0, samples.length)), 1);
        else
            samples.splice(index, 1);
    }

    function new_sample(parent) {
        let child = new Type([random(0, canvasSize), random(0, canvasSize)]);
    
        if (parent) {
            child.brain = parent.brain.copy();
            child.brain.mutate();
        } else {
            child.brain = new NeuralBrain(null,null,11,5,2);
        }
    
        return child;
    }

    function mate(parent1, parent2) {
        let child;

        if (parent2) {
            parent1.energy -= 2;
            parent2.energy -= 2;
            child = new Type([random([parent1.x, parent2.x]), random([parent1.y, parent2.y])]);
        
            child.brain = parent1.brain.crossover(parent2.brain)[0];
            child.brain.mutate();
        } else {
            if (parent1.energy <= 16) return;
            parent1.energy -= 2;
            child = new Type([parent1.x, parent1.y]);
            
            child.brain = parent1.brain.copy();
            child.brain.mutate();
        }

        return child;
    }
}