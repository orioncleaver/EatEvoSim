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

    /**
     * Runs one step of the algorithm.
     * @param  {Array} targets List of coordinates where food is located.
     */
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

    /**
     * Spawns a new generation of samples from the most fit samples of this generation.
     * @param  {Array} targets List of coordinates where food is located.
     */
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
        const parentPool = this.selectionWheel();
        
        //generate new population
        this.samples = [];
        if (parentPool.length > 0) {
            for (let i = 0; i < this.sampleSize / 2; i++) {
                const children = this.mate(random(parentPool), random(parentPool));
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

     /**
     * Creates a parent pool where each sample is proportionally represented based on fitness.
     * @return {Array.<Sample>} A list of Samples from the previous generation.
     */   
    this.selectionWheel = function() {
        let result = [];
        this.samples.forEach((s) => {
            for (let i = 0; i < Math.ceil(s.fitness); ++i) {
                result.push(s);
            }
        });
        return result;
    }

    /**
     * Crossover two samples and mutate the DNA of the new samples.
     * @param  {Sample} sample1 A sample.
     * @param  {Sample} sample2 Another sample.
     * @return {Array.<Sample>} A list of Samples from the previous generation.
     */
    this.mate = function(sample1, sample2) {
        let children = sample1.crossover(sample2);
        children.forEach(c => c.mutate());
        return children;
    }

     /**
     * Counts the samples currently running and returns the count.
     */   
    this.numAlive = function() {
        let count = 0;
        for (let i = 0; i < this.sampleSize; ++i) {
            if (this.samples[i].running) ++count;
        }
        return count;
    }

     /**
     * Logs information about the current generation to console.
     */   
    this.printGenInfo = function(totalFitness) {
        console.log("Gen " + this.numGenerations + ":");
        console.log("   fitness: " + totalFitness);
        console.log("   avg: " + totalFitness / this.sampleSize);
    }
}
