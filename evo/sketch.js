const canvasSize = 800;
const ga = new GeneticAlg();

function setup() {
    createCanvas(canvasSize + 200, canvasSize);
    
    ga.init();
}

function draw() {
    ga.step();
}