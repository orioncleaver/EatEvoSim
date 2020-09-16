const Sensor = function(a, pos, energy, l, isI = false) {
    const length = l;
    const isInternal = isI;

    this.hitTarget;
    this.value;

    this.adjust = function(x, y, radius, ang) {
        this.angle = ang;
        if (isInternal) {
            this.startX = x;
            this.startY = y;
            const rX = this.startX + radius * Math.cos(this.angle);
            const rY = this.startY + radius * Math.sin(this.angle);
            this.endX = rX + length * Math.cos(this.angle);
            this.endY = rY + length * Math.sin(this.angle);
        } else {
            this.startX = x + radius * Math.cos(this.angle);
            this.startY = y + radius * Math.sin(this.angle);
            this.endX = this.startX + length * Math.cos(this.angle);
            this.endY = this.startY + length * Math.sin(this.angle);
        }
    } 
    this.adjust(pos[0], pos[1], energy, a); 
    
    // https://codereview.stackexchange.com/questions/192477/circle-line-segment-collision
    this.intersects = function(circX, circY, r) {
        let dist;
        const v1x = this.endX - this.startX;
        const v1y = this.endY - this.startY;
        const v2x = circX - this.startX;
        const v2y = circY - this.startY;
        // get the unit distance along the line of the closest point to
        // circle center
        const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);
        
        // if the point is on the line segment get the distance squared
        // from that point to the circle center
        if(u >= 0 && u <= 1){
            dist  = (this.startX + v1x * u - circX) ** 2 + (this.startY+ v1y * u - circY) ** 2;
        } else {
            // if closest point not on the line segment
            // use the unit distance to determine which end is closest
            // and get dist square to circle
            dist = u < 0 ?
                  (this.startX - circX) ** 2 + (this.startY- circY) ** 2 :
                  (this.endX - circX) ** 2 + (this.endY - circY) ** 2;
        }
        return dist < r * r;
    }
}