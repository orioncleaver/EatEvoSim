/* Generalized Genetic Algorithm */
const geneticAlg = function(population, populationSize, maxSteps, startPosition, brainType) {
    /*constructor*/
    this.samples = population;
    this.sampleSize = populationSize;
    this.maxSteps = maxSteps;
    this.startPos = startPosition;
    this.brainType = brainType;

    /*private vars*/
    this.numSteps = 0;
    this.numGenerations = 0;

    this.step = function(targets) {
        if (this.numSteps >= this.maxSteps || this.numAlive() == 0)  {
            this.newGeneration(targets);
            this.numSteps = 0;
        }
        this.numSteps++;

        this.samples.forEach(s => {
            s.update(targets);
        });
    }
    
    this.newGeneration = function(targets) {
        this.numGenerations++;
        //check fitness
        let totalFitness = 0;
        this.samples.forEach(s => {
            s.checkEndFitness(targets);
            
            totalFitness += s.fitness;
        });
        this.printGenInfo(totalFitness);

        //select parent pool
        let parentPool = [];
        if (this.brainType == config.states.LINEAR || this.brainType == config.states.TFNEURAL) {
            parentPool = this.selectionWheel();
        }
        
        //generate new population
        this.samples = [];
        if (parentPool.length > 0) {
            for (let i = 0; i < this.sampleSize / 2; i++) {
                let children = this.mate(random(parentPool), random(parentPool));
                children.forEach((c) => {
                    c.parentFitness = c.fitness;
                    this.samples.push(c);
                });
            }
        } else { // if no one had any fitness, start from scratch
            for (let i = 0; i < this.sampleSize; i++) {
                this.samples.push(new Sample(this.startPos, false));
                this.samples[i].newBrain();
            }
        }
    }    
    
    this.selectionWheel = function() {
        let result = [];
        this.samples.forEach((s) => {
            for (let i = 0; i < Math.ceil(s.fitness); ++i) {
                result.push(s);
            }
        });
        return result;
    }

    this.mate = function(sample1, sample2) {
        let children = sample1.crossover(sample2);
        children.forEach(c => c.mutate());
        return children;
    }

    this.numAlive = function() {
        let count = 0;
        for (let i = 0; i < this.sampleSize; ++i) {
            if (this.samples[i].running) ++count;
        }
        return count;
    }

    this.printGenInfo = function(totalFitness) {
        console.log("Gen " + this.numGenerations + ":");
        console.log("   fitness: " + totalFitness);
        console.log("   avg: " + totalFitness / this.sampleSize);
    }
}
