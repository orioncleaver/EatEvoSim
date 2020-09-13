const Brain = function() {
    this.DNA = [];

    /**
     * Initialize a random sequence of DNA of length N.
     * @param  {Number} N Number of steps taken in the simulation.
     */
    this.init = function(N) {
        for (let i = 0; i < N; ++i) {
            this.DNA.push([int(random(0,9)), false, random(0,1)]);
        }
    }

    /**
     * Takes in current state information and predicts next move.
     * @param  {Number} step Current step in the simulation.
     * @return {Number} Direction to move this step.
     */
    this.predict = function(step) {
        return this.DNA[step][0];
    }

    /**
     * Crosses the DNA of this Brain with another to produce two offspring.
     * @param  {Brain} other The other Brain.
     * @return {Array.<Brain>} Two new Brains.
     */
    this.crossover = function(other) {
        let child1Brain = new Brain();
        let child2Brain = new Brain();

        const odds = int(random(0, 100));
        if (odds < 70) {
            //dominate child
            for (let i = 0; i < this.DNA.length; ++i) {
                if ((this.DNA[i][2] > other.DNA[i][2]) && this.DNA[i][0] !== other.DNA[i][0]) {
                    child1Brain.DNA.push([other.DNA[i][0], true, other.DNA[i][2]]);
                } else {
                    child1Brain.DNA.push([this.DNA[i][0], false, this.DNA[i][2]]);
                }
            }
            //recessive child
            for (let i = 0; i < this.DNA.length; ++i) {
                if ((this.DNA[i][2] <= other.DNA[i][2]) && this.DNA[i][0] !== other.DNA[i][0]) {
                    child2Brain.DNA.push([other.DNA[i][0], true, other.DNA[i][2]]);
                } else {
                    child2Brain.DNA.push([this.DNA[i][0], false, this.DNA[i][2]]);
                }
            }
        } else {
            child1Brain.DNA = this.DNA;
            child2Brain.DNA = other.DNA;
        }

        return  [child1Brain, child2Brain];
    }

    /**
     * Mutates the DNA in-place.
     */
    this.mutate = function() {
        //bit-wise adjustments
        for (let i = 0; i < this.DNA.length; i++) {
            const odds = int(random(0,160));
            if (odds == 1) {
                this.DNA[i][0] = int(random(0,9));
                this.DNA[i][2] = random(0,1);
            }
            if (odds == 2) {
                this.DNA[i][0] += 1;
                if (this.DNA[i][0] > 8) {
                    this.DNA[i][0] = 1;
                }
            }
            if (odds == 3) {
                this.DNA[i][0] -= 1;
                if (this.DNA[i][0] < 1) {
                    this.DNA[i][0] = 8;
                }
            }
        }

        //swap 2 values
        const odds = int(random(0, 100));
        if (odds === 1) {
            const first = int(random(0, this.DNA.length));
            const second = int(random(0, this.DNA.length));
            const temp = this.DNA[first];
            this.DNA[first] = this.DNA[second];
            this.DNA[second] = temp;
        }
    }

    /**
     * Uniformly increases dominance across the DNA.
     */
    this.adjustDominance = function() {
        for (let i = 0; i < this.DNA.length; ++i) {   
            if (this.DNA[i][1]) {
                this.DNA[i][2] += .1;
                if (this.DNA[i][2] > 1) {
                    this.DNA[i][2] = 1;
                }
            }
        }
    }
}