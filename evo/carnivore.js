const Carnivore = function(pos) {
    this.x = pos[0];
    this.y = pos[1];
    
    this.minSpeed = 2;
    this.maxSpeed = 8;

    this.energy = 15;
    this.brain;
    this.isAlive = true;

    this.feelers = [];
    this.feelerL = 50;
    const numFeelers = 10;
    
    this.reproduce = 0;

    this.angle = 0;

    for (let i = 0; i < numFeelers; ++i) {
        this.feelers.push(new Sensor((this.angle + ((2 * Math.PI) / numFeelers) * i), [this.x, this.y], this.energy, this.feelerL, true));
    }

    this.start = new Date().getTime();

    this.update = function() {
        if (!this.isAlive) return;
        const features = this.generateFeatures();
        const control = this.brain.predictAll(features);
        //const control = [0, 1, 1];

        const speed = ((control[0] - .5) * (this.maxSpeed * 2));
        const turningSpeed = Math.PI / 40;
        this.angle += (control[1] - .5) * turningSpeed;
        const xVelocity = Math.cos(this.angle) * speed;
        const yVelocity = Math.sin(this.angle) * speed;       
        this.x += xVelocity;
        this.y += yVelocity;

        if (this.x < this.energy) this.x = canvasSize - this.energy;
        if (this.x > canvasSize - this.energy) this.x = this.energy;
        if (this.y < this.energy) this.y = canvasSize - this.energy;
        if (this.y > canvasSize - this.energy) this.y = this.energy;

        //expend energy (between .1 and .2)
        const energyUsed = .1 + ((Math.abs(speed) / this.maxSpeed) * .1);
        this.energy -= energyUsed;

        this.reproduce = control[2];

        //move feelers
        for (let i = 0; i < numFeelers; ++i) {
            this.feelers[i].adjust(this.x, this.y, this.energy, this.angle + ((2 * Math.PI) / numFeelers) * i);
        }
    }   
    this.draw = function() {
        if (!this.isAlive) return;
        
        stroke(0);
        fill(220,20,60);
    
        ellipse(this.x, this.y, this.energy * 2, this.energy * 2);
        
        this.feelers.forEach(c => {
            if (c.hitTarget) {
                stroke(0);
                line(c.startX, c.startY, c.endX, c.endY);
            }
        });
    }
    // [friends, foods, energy level, mouth value]
    this.generateFeatures = function() {
        result = [];
        this.feelers.forEach(c => {
            if (c.hitTarget) result.push(1);
            else result.push(-1);
        });

        return result;
    }
    this.getReproduce = function() {
        if (this.energy < 16) return false;
        else if (this.energy > 75) return true;

        if (this.reproduce >= .5) return true;
        
        return false;
    }
    this.isSafe = function() {
        return !(this.x + this.energy > canvasSize || this.x < this.energy || this.y + this.energy > canvasSize || this.y < this.energy);
    }
    this.die = function() {
        if (this.isAlive) this.isAlive = false;
    }
    this.intersects = function(otherCell) {
        return (dist(this.x, this.y, otherCell.x, otherCell.y) < Math.abs(this.energy + otherCell.energy));
    }
    this.radius = function() {
        return Math.sqrt(this.energy);
    }
    this.getAge = function() {
        const now = new Date().getTime();
        return (now - this.start) / 1000;
    }
    this.resetFeatures = function() {
        this.feelers.forEach(f => { f.hitTarget = false; f.value = -1; } );
    }
    this.eat = function(fields) {
        // eat during update_features
        return null
    }
    this.updateFeatures = function(cells) {
        for (let j = 0; j < cells.length; ++j) {
            // eat enemies 
            if (this.intersects(cells[j])) {
                cells[j].energy -= .12;
                this.energy += .18;
            }
            // update cilium
            for (let k = 0; k < this.feelers.length; ++k) {
                if (this.feelers[k].intersects(cells[j].x, cells[j].y, cells[j].energy)) {
                    this.feelers[k].hitTarget = true;
                }
            }
        }
    }
}