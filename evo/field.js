const Field = function(points) {
    this.point1 = points[0];
    this.point2 = points[1];
    this.point3 = points[2];

    this.maxCap = 1;
    this.energy = this.maxCap;

    this.active = false;

    this.intersects = function(x, y) {
        // Copy-pasted from https://stackoverflow.com/a/9747983/14107468
        const P = [x, y];
        // Compute vectors        
        function vec(from, to) {  return [to[0] - from[0], to[1] - from[1]];  }
        const v0 = vec(this.point1, this.point3);
        const v1 = vec(this.point1, this.point2);
        const v2 = vec(this.point1, P);
        // Compute dot products
        function dot(u, v) {  return u[0] * v[0] + u[1] * v[1];  }
        const dot00 = dot(v0, v0);
        const dot01 = dot(v0, v1);
        const dot02 = dot(v0, v2);
        const dot11 = dot(v1, v1);
        const dot12 = dot(v1, v2);
        // Compute barycentric coordinates
        const invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
        // Check if point is in triangle
        return (u >= 0) && (v >= 0) && (u + v < 1);
    }
    this.draw = function() {
        // background triangle 
        fill(143,188,143);
        triangle(this.point1[0], this.point1[1], this.point2[0], this.point2[1], this.point3[0], this.point3[1]);
        // food 
        stroke(60, 179, 113, 255 * (this.energy / this.maxCap));
        fill(60, 179, 113, 255 * (this.energy / this.maxCap));
        triangle(this.point1[0], this.point1[1], this.point2[0], this.point2[1], this.point3[0], this.point3[1]); 
    }
    this.midpoint = function() {
        const x = (this.point1[0] + this.point2[0] + this.point3[0]) / 3;
        const y = (this.point1[1] + this.point2[1] + this.point3[1]) / 3;
        return [x, y];
    }
}