# EvoEatSim
### An Exploration into Neuro-Evolution and Genetic Algorithms

## Introduction
The aim of this project is to design simulations that leverage various genetic algorithms to create unique and interesting survival strategies from neural networks

In each of these simulations, a population of cells must survive in their environment and eat food to gain fitness. 

### Technologies
- p5.js for graphics
- TensorFlow.js for neural networks

### Genetic Algorithm (GA)
At it's core, a GA does three things:
1. Selection
2. Crossover
3. Mutation

## Part 1 - EatEvo
Cells are placed on a grid where they can move one place per step (left, up, right, down). Cells die if they hit an edge of the grid. This simulation runs on a loop, and every N steps the current generation is replaced with a new generation.

### Genetic Algorithm
Every N steps, the GA does the following:
- All living cells are killed off and their final fitness are calculated
- The most fit cells reproduce, which involves crossover and mutation
- The new population is placed in the environment

### Fitness
Fitness increases when a cell eats food or is near food. Fitness decreases significantly when a cell dies.

### Linear Model
In this model, "DNA" is represented as a list of directions that the cell will take. For example, N steps after the cell spawned, the cell will move in direction DNA\[ N \].

Crossover happens pairwise. Genes are selected based on their dominance, which is tracked in the gene over generations. The specifics for crossover are based on the paper *Selective Crossover in Genetic Algorithms: An Empirical Study* (Vekaria & Clack '98)

### Neural Model
In this model, "DNA" is represented as the weights of a neural network. Each step of the simulation, a neural network takes environmental data as input and gives a direction to move as output. 

Crossover occurs between layers of weights, not pairwise. This includes one point and two point crossover at each layer of two neural networks.

<!-- ## Part 2 - NeuralEvo
Cells are placed on an island. They have 'feelers' for input. They expend energy to live and use more energy the faster they move and when they move on the water.

There are herbivore cells and carnivore cells. 
- Herbivores eat grass on the island to gain energy. They have 'feelers' that feel for water, carnivores, and other herbivores. Grass can be depleted and regrow over time.
- Carnivores eat herbivores to gain energy. They have 'feelers' that feel for water, herbivores, and other carnivores. 

### Genetic Algorithm

### Fitness

### Neural Network -->

## TODO
### Part 1 - Eats
- Improve User Interface
    - Include current generation and past 10 generation average fitness data on screen
    - Include button for switching between linear and neural model
    - Include settings panel for adjusting config values in real-time
- Explore more complex crossover and mutation events for the neural model
<!-- ### Part 2 - Evo
- Improve User Interface -->