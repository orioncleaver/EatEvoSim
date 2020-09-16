const GeneticAlg = function() {
    const fields = [];

    const cells = new Population(Cell, 32, 64);
    const preds = new Population(Carnivore, 20, 48);

    this.init = function() {
        generateMap();

        cells.init();
        preds.init();
    }
    this.step = function() {
        drawMap();
        cells.drawInformation(100, name='Herbivores');
        preds.drawInformation(200, name='Carnivores');
        // reset fields
        for (let i = 0; i < fields.length; ++i) {
            fields[i].active = false;
        }

        // population management
        cells.removeDead();
        preds.removeDead();
        cells.removeExcess();
        preds.removeExcess();
        cells.addMinimum();
        preds.addMinimum();

        // update populations
        cells.update(fields);
        preds.update(cells.getSamples());

        // grow back inactive fields
        for (let i = 0; i < fields.length; ++i) {
            if (!fields[i].active) {
                fields[i].energy += .15;
            } else {
                fields[i].energy += .1;
            }
            if (fields[i].energy > fields[i].maxCap) fields[i].energy = fields[i].maxCap;
        }
    }

    /********************/
    /* WORLD GENERATION */
    /********************/
    function generateMap() {
        const regionPoints = gridDistribution(4);
    
        const regions = delaunayTransform(regionPoints);
        
        let points = [];
        regions.forEach(r => points = points.concat(generatePointsInRegion(new Field(r))));
    
        const triangles = delaunayTransform(points);
    
        triangles.forEach(t => fields.push(new Field(t)));
    }


    // divides screen and distributes random points
    function gridDistribution(divs) {
        const l = canvasSize / divs;
        let points = [];
        for (let i = 0; i < divs; ++i) {
            for (let j = 0; j < divs; ++j) {
                const p = [random(l * i, l * i + l), random(l * j, l * j + l)];
                points.push(p);
            }
        }
        return points;
    }
    
    function delaunayTransform(points) {
        const result = Delaunator.from(points)
        const triangles = []
        for (let i = 0; i < result.triangles.length; i += 3) {
            triangles.push([
                points[result.triangles[i]],
                points[result.triangles[i + 1]],
                points[result.triangles[i + 2]]
            ]);
        }
        return triangles;
    }
    
    function generatePointsInRegion(region) {
        const minX = Math.min(region.point1[0], region.point2[0], region.point3[0]);
        const minY = Math.min(region.point1[1], region.point2[1], region.point3[1]);
        const maxX = Math.max(region.point1[0], region.point2[0], region.point3[0]);
        const maxY = Math.max(region.point1[1], region.point2[1], region.point3[1]);
        let points = [];
        const regionDensity = int(random(4,12));
        for (let i = 0; i < regionDensity; ++i) {
            let p = [random(minX, maxX), random(minY, maxY)];
            while (!region.intersects(p[0], p[1])) {
                p = [random(minX, maxX), random(minY, maxY)];
            }
            points.push(p);
        }
        return points;
    }   
    
    function drawMap() {
        clear();
        background(0);
        stroke(color(0,255,0));
        fields.forEach(f => f.draw());
        for (let i = 0; i < fields.length; ++i) {
            stroke(255);
            const pos = fields[i].midpoint();
            text(i, pos[0], pos[1]);
        }
        fill(205);
        rect(canvasSize, 0, 200, canvasSize)
    }
}