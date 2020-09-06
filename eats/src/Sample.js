var Sample = function(startPos, isRecessive) {
    /*constructor*/
    this.startPos = startPos;
    this.x = startPos[0];
    this.y = startPos[1];
    this.isRecessive = isRecessive;

    //brain object must contain predict, crossover, and mutation functions
    this.brain;
    this.numSteps = 0;
    this.running = true;
    this.parentFitness = 0;
    this.fitness = 1;
    this.timesAte = 0;
    
    /*inputs for neural model*/
    this.eyes = [8];

    /**
     * Initialize the brain based on config.
     */
    this.newBrain = function() {
        if (this.brainType == config.states.LINEAR) {
            this.brain = new Brain();
            this.brain.init(this.maxSteps);
        } else if (this.brainType = config.states.TFNEURAL) {
            this.brain = new NeuralBrain();
            this.brain.init();
        }
    }

    /**
     * Calculates features and updates position and fitness.
     * @param  {Array} targets List of coordinates where food is located.
     */
    this.update = function(targets) {
        if (!this.running) return;
        // set features based on brain type
        let features;
        if (this.brainType == config.states.LINEAR) {
            features = this.numSteps;
        } else if (this.brainType = config.states.TFNEURAL) {
            this.lookAround(targets);
            features = this.eyes;
        }

        // take step (make control const)
        let control = this.brain.predict(features);
        if (this.brainType = config.states.TFNEURAL) {
            control++;
        }
        switch (control) {
            case 0:
                break;
            case 1:
                this.x -= 1;
                break;
            case 2:
                this.x -= 1;
                this.y -= 1;
                break;
            case 3:
                this.y -= 1;
                break;
            case 4:
                this.x += 1;
                this.y -= 1;
                break;
            case 5:
                this.x += 1;
                break;
            case 6:
                this.x += 1;
                this.y += 1;
                break;
            case 7:
                this.y += 1;
                break;
            case 8:
                this.x -= 1;
                this.y += 1;
                break;
            default:
                console.log('do not enter');
                break;
        }
        this.numSteps++;

        // eat and respawn new food
        const numAte = this.eat(targets);
        
        // check resulting safety and fitness
        if (!this.isSafe()) this.die();
        this.fitness += 10 * numAte;
    }

    /**
     * Draws cell on screen.
     */
    this.draw = function() {
        if (!this.running) return;
        if (this.isRecessive) {
            stroke(color(255,165, 0));
        } else {
            stroke(color(0, 255, 0));
        }

        if (this.brainType == config.states.TFNEURAL) {
            if (this.eyes[0]) {
                line(gridCorrected(this.x), gridCorrected(this.y), gridCorrected(this.x - 5), gridCorrected(this.y));
            }
            if (this.eyes[1]) {
                line(gridCorrected(this.x), gridCorrected(this.y), gridCorrected(this.x), gridCorrected(this.y - 5));
            }
            if (this.eyes[2]) {
                line(gridCorrected(this.x), gridCorrected(this.y), gridCorrected(this.x + 5), gridCorrected(this.y));
            }
            if (this.eyes[3]) {
                line(gridCorrected(this.x), gridCorrected(this.y), gridCorrected(this.x), gridCorrected(this.y + 5));
            }
        }
        
        ellipse(gridCorrected(this.x), gridCorrected(this.y), 15, 15);
    }

    /**
     * Eats any food at current position, replaces it with a new food.
     * @return  {Number} The amount of food eaten.
     */
    this.eat = function(targets) {
        if (!this.running) return 0;
        let numAte = 0;
        for (let i = 0; i < targets.length; ++i) {
            if (this.x == targets[i][0] && this.y == targets[i][1]) {
                numAte += 1;
                targets.splice(i, 1);
                targets.push(spawnFood());
            }
        }
        this.timesAte += numAte;
        return numAte;
    }

    /**
     * Sets running to false, which will stop update and draw methods from running.
     */
    this.die = function() {
        if (this.running) {
            this.running = false;
        }
    }

    /**
     * Checks if position is within the grid.
     * @return {Boolean} True if position within grid, else False
     */
    this.isSafe = function () {
        return !(this.x > this.gridSize || this.x < 1 || this.y > this.gridSize || this.y < 1);
    }

    /**
     * Updates fitness based on proximity to food.
     * @param  {Array} targets List of coordinates where food is located.
     */
    this.checkEndFitness = function(targets) {
        let foodFitness = 0;

        for (let j = 0; j < targets.length; ++j) {
            let foodDist = dist(targets[j][0], targets[j][1], this.x, this.y);
            foodDist = (dist(0, 0, this.gridSize, this.gridSize) - foodDist) / dist(0, 0, this.gridSize, this.gridSize);
            foodDist *= 5;
            foodFitness += foodDist;
        }

        foodFitness /= targets.length;
        this.fitness += foodFitness;

        if (this.timesAte == 0 && !this.running) {
            this.fitness /= 10;
        }

        this.fitness *= this.fitness;

        if (this.brainType == config.states.LINEAR && (this.fitness > this.parentFitness)) {
            this.brain.adjustDominance();
        }
    }

    /**
     * Crosses this Sample with another to produce two new Samples.
     * @param  {Sample} other The other Sample.
     */
    this.crossover = function(other) {
        let child1 = new Sample(this.startPos, false);
        let child2 = new Sample(this.startPos, true);
        
        let brains = this.brain.crossover(other.brain);
        child1.brain = brains[0];
        child2.brain = brains[1];
        
        return [child1, child2];
    }

    /**
     * Mutates the brain.
     */
    this.mutate = function() {
        this.brain.mutate();
    }

    /**
     * Sets the features by looking for food.
     * @param  {Array} targets List of coordinates where food is located.
     */
    this.lookAround = function(targets) {
        const size = 1;
        const distance = 5;
        for (let i = 0; i < 8; ++i) {
            this.eyes[i] = 0;
        }
        targets.forEach(t => {
            if ((t[1] <= this.y + size) && (this.y - size <= t[1])) {
                if ((t[0] <= this.x - distance + size) && (this.x - distance - size <= t[0])) {
                    this.eyes[0] = 1;
                } else if ((t[0] <= this.x + distance + size) && (this.x + distance - size <= t[0])) {
                    this.eyes[2] = 1;
                }
            } else if ((t[0] <= this.x + size) && (this.x - size <= t[0])) {
                if ((t[1] <= this.y - distance + size) && (this.y - distance - size <= t[1])) {
                    this.eyes[1] = 1;
                } else if (((t[1] <= this.y + distance + size) && (this.y + distance - size <= t[1])) ) {
                    this.eyes[3] = 1;
                }
            }

            this.eyes[4] = this.x / this.gridSize;
            this.eyes[5] = this.y / this.gridSize;
            this.eyes[6] = (this.gridSize - this.x) / this.gridSize;
            this.eyes[7] = (this.gridSize - this.y) / this.gridSize;
        });
    }
}
