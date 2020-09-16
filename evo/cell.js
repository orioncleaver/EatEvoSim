const Cell = function(pos) {
    this.x = pos[0];
    this.y = pos[1];
    
    this.minSpeed = 2;
    this.maxSpeed = 8;

    this.energy = 5;
    this.mouthValue = 0;
    this.brain;
    this.isAlive = true;

    this.foodFeelers = [];
    this.foodLength = 10;
    const numFood = 8;

    this.friendFeelers = [];
    this.friendLength = 20;
    const numFriend = 4;
    
    this.reproduce = 0;

    this.angle = 0;

    this.foodFeelers.push(new Sensor(this.angle - Math.PI / 4, [this.x, this.y], this.energy, this.foodLength));
    this.foodFeelers.push(new Sensor(this.angle, [this.x, this.y], this.energy, this.foodLength));
    this.foodFeelers.push(new Sensor(this.angle + Math.PI / 4, [this.x, this.y], this.energy, this.foodLength));
    this.foodFeelers.push(new Sensor(this.angle + Math.PI, [this.x, this.y], this.energy, this.foodLength));

    // for (let i = 0; i < numFood; ++i) {
    //     if (i % 2 == 1) this.foodFeelers.push(new Sensor(((2 * Math.PI) / numFood) * i, [this.x, this.y], this.energy, this.foodLength));
    //     else this.foodFeelers.push(new Sensor(((2 * Math.PI) / numFood) * i, [this.x, this.y], this.energy, this.foodLength * 2.5));  
    // }
    for (let i = 0; i < numFriend; ++i) {
        this.friendFeelers.push(new Sensor((this.angle + ((2 * Math.PI) / numFriend) * i), [this.x, this.y], this.energy, this.friendLength, true));
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

        //expend energy (between .05 and .15)
        const energyUsed = .05 + ((Math.abs(speed) / this.maxSpeed) * .1);
        this.energy -= ((this.mouthValue != -1) ? energyUsed : energyUsed + .1);

        this.reproduce = control[2];

        //move feelers
        this.foodFeelers[0].adjust(this.x, this.y, this.energy, this.angle - Math.PI / 4);
        this.foodFeelers[1].adjust(this.x, this.y, this.energy, this.angle);
        this.foodFeelers[2].adjust(this.x, this.y, this.energy, this.angle + Math.PI / 4);
        this.foodFeelers[3].adjust(this.x, this.y, this.energy, this.angle + Math.PI);

        for (let i = 0; i < numFriend; ++i) {
            this.friendFeelers[i].adjust(this.x, this.y, this.energy, this.angle + ((2 * Math.PI) / numFriend) * i);
        }

        //this.foodFeelers.forEach(c => c.adjust(this.x, this.y, this.energy));
        //this.friendFeelers.forEach(c => c.adjust(this.x, this.y, this.energy));
    }   
    this.draw = function() {
        if (!this.isAlive) return;
        
        if (this.mouthValue > 0) {
            stroke(0,191,255);
            fill(color(176,224,230));
        } else {
            stroke(color(220,20,60));
            fill(219,112,147);
        }
        ellipse(this.x, this.y, this.energy * 2, this.energy * 2);
        
        // draw heart
        if (this.energy >= 16) {
            stroke(255,24,55, 255 * this.reproduce);
            if (this.energy >= 75) stroke(255,24,55);
            fill(255,24,55, 255 * this.reproduce);
            ellipse(this.x, this.y, this.energy / 3, this.energy / 3);
        }
        
        this.friendFeelers.forEach(c => {
            if (c.hitTarget) {
                stroke(0);
                line(c.startX, c.startY, c.endX, c.endY);
            }
        });
        
        this.foodFeelers.forEach(c => {
            if (!c.hitTarget) stroke(color(255,0,0));
            else  stroke(color(124,160,20));
            
            line(c.startX, c.startY, c.endX, c.endY);
        });
    }
    // [friends, foods, energy level, mouth value]
    this.generateFeatures = function() {
        result = [];
        this.friendFeelers.forEach(c => {
            if (c.hitTarget) result.push(1);
            else result.push(-1);
        });
        
        this.foodFeelers.forEach(c => {
            result.push(c.value);
        });

        result.push(Math.min(1.0, this.energy / 75));

        result.push(this.mouthValue);

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
       this.foodFeelers.forEach(f => { f.hitTarget = false; f.value = -1; } );
       this.friendFeelers.forEach(f => { f.hitTarget = false; f.value = -1; } );
       this.mouthValue = -1;
    }
    this.eat = function(fields) {
        for (let j = 0; j < fields.length; ++j) {
            // eat
            if (fields[j].intersects(this.x, this.y)) {
                fields[j].active = true;
                this.mouthValue = (fields[j].energy / fields[j].maxCap);
                if (fields[j].energy > 0) {
                    this.energy += .1;
                    fields[j].energy -= .1;

                    if (fields[j].energy < 0) fields[j].energy = 0;
                } 
                break;
            }
        }  
    }
    this.updateFeatures = function(fields, cells, this_index) {
        // update food feelers
        for (let k = 0; k < this.foodFeelers.length; ++k) {
            for (let j = 0; j < fields.length; ++j) {
                if (fields[j].intersects(this.foodFeelers[k].endX, this.foodFeelers[k].endY)) {
                    this.foodFeelers[k].hitTarget = true;
                    this.foodFeelers[k].value = fields[j].energy / fields[j].maxCap;
                    break;
                }
            }
        }

        // update friend cilium
        for (let j = 0; j < cells.length; ++j) {
            if (this_index != j) {
                for (let k = 0; k < this.friendFeelers.length; ++k) {
                    if (this.friendFeelers[k].intersects(cells[j].x, cells[j].y, cells[j].energy)) {
                        this.friendFeelers[k].hitTarget = true;
                    }
                }
            }
        }
    }
}