let ga;

let foods = [];

let actionTimer;
let timerSlider;
let showEvolution;

let gridSize;

function setup() {
    createCanvas(config.canvasSize, config.canvasSize);
    showEvolution = true;

    let brainType = config.states.TFNEURAL;

    let popSize, maxSteps, numFood;

    // load in data to appropriate places
    if (brainType == config.states.LINEAR) {
        popSize = linearConfig.popSize;
        maxSteps = linearConfig.maxSteps;
        numFood = linearConfig.numFood;
        gridSize = linearConfig.gridSize;
    } else if (brainType == config.states.TFNEURAL) {
        popSize = neuralConfig.popSize;
        maxSteps = neuralConfig.maxSteps;
        numFood = neuralConfig.numFood;
        gridSize = neuralConfig.gridSize;
    }
    Sample.prototype.brainType = brainType;
    Sample.prototype.maxSteps = maxSteps;
    Sample.prototype.gridSize = gridSize;

    const startPos = [2];
    startPos[0] = int(random(3, gridSize - 1));
    startPos[1] = int(random(3, gridSize - 1));
    //init bots and genetic algorithm
    const initPop = [];
    for (let i = 0; i < popSize; ++i) {
        initPop.push(new Sample(startPos, false));
        initPop[i].newBrain();
    }
    ga = new geneticAlg(initPop, popSize, maxSteps, startPos, brainType);

    for (let i = 0; i < numFood; ++i) {
        foods.push(spawnFood());
    }

    timerSlider = document.getElementById('slider');
    actionTimer = setTimeout(run, timerSlider.value);
    document.getElementById('do10').addEventListener('click', () => {
        showEvolution = !showEvolution;
        clearTimeout();
        for (let i = 0; i < maxSteps*10; ++i) {
            run();
        }
        actionTimer = setTimeout(run, timerSlider.value);
        showEvolution = !showEvolution;
    });
}

function run() {
    ga.step(foods);

    draw();

    if (showEvolution) {
        actionTimer = setTimeout(run, timerSlider.value);
    }
}

function draw() {
    drawMap();
    if (showEvolution) {
        ga.samples.forEach((s) => { if (s.running) s.draw() });
    }
    
    noLoop();
}

function gridCorrected(x) {
    const meter = (config.canvasSize - 2 * config.offset) / (gridSize + 1);
    return config.offset + x*(meter);
}

function spawnFood() {
    const x = Math.floor(random(1, gridSize - 1));
    const y = Math.floor(random(1, gridSize - 1));
    return [x, y];
}

function drawMap() {
    clear();
    background(255);
    //draw grid
    stroke(color(255, 25, 0));
    line(config.offset, config.offset, config.offset, config.canvasSize - config.offset);
    line(config.offset, config.offset, config.canvasSize - config.offset, config.offset);
    line(config.canvasSize - config.offset, config.canvasSize - config.offset, config.offset, config.canvasSize - config.offset);
    line(config.canvasSize - config.offset, config.canvasSize - config.offset, config.canvasSize - config.offset, config.offset);
    stroke(0);
    for (let i = 1; i <= gridSize; ++i) {
        line(gridCorrected(i), config.offset, gridCorrected(i), config.canvasSize - config.offset);
        line(config.offset, gridCorrected(i), config.canvasSize - config.offset, gridCorrected(i));
    }
    //draw food
    stroke(color(255, 25, 0));
    foods.forEach((f) => {
        ellipse(gridCorrected(f[0]), gridCorrected(f[1]), 20, 20);
    });
    //draw info
    textAlign(LEFT);
    text("Left alive: " + ga.numAlive(), 120, config.offset - 20);
    text("Action: " + ga.numSteps + "/" + ga.maxSteps, 200, config.offset - 20);
    text("Generation: " + ga.numGenerations, 290, config.offset - 20);
}