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
1. Selection (of most fit samples in population)
2. Crossover (between DNA of most fit samples)
3. Mutation (of the resulting DNA)

## Part 1 - Eat Evolution
Cells are placed on a grid where they can move one place per step (left, up, right, down). Cells die if they hit an edge of the grid. This simulation runs on a loop, and every N steps the current generation is replaced with a new generation.

### Linear Model
In this model, 'DNA' is represented as a list of directions that the cell will take. For example, N steps after the cell spawned, the cell will move in direction DNA\[ N \].

Crossover happens pairwise. Genes are selected based on their dominance, which is tracked in the gene over generations. The specifics for crossover are based on the paper *Selective Crossover in Genetic Algorithms: An Empirical Study* (Vekaria & Clack '98)

### Neural Model
In this model, 'DNA' is represented as the weights of a neural network. Each step of the simulation, a neural network takes environmental data as input and gives a direction to move as output. 

A 'gene' is represented as the set of weights that originate in a single node. Mutation happens pairwise among genes.

Crossover occurs between layers of weights, not pairwise. The potential crossover events are one-point crossover, two-point crossover, and gene swap.

### Genetic Algorithm
Each step, the GA does the following:
- All living cells are killed off and their final fitness are calculated
- The most fit cells reproduce, which involves crossover and mutation
- The new population is placed in the environment

### Fitness
Fitness increases when a cell eats food or is near food. Fitness decreases significantly when a cell dies.

## Part 2 - Neural Evolution
Cells are placed on an island. They have 'feelers' as input to a neural network model that dictates their movement and reproduction. Cells need energy to live. They expend energy when they move. If they move in the water or move fast, they expend more energy.

### Herbivore Cells
Herbivores eat grass on the island to gain energy. They have 'feelers' that feel for water, carnivores, and other herbivores. Grass can be depleted and regrow over time.

### Carnivore Cells
Carnivores eat herbivores to gain energy. They have 'feelers' that feel for water, herbivores, and other carnivores. 

### Genetic Algorithm
Each step, every cell does the following:
- Eats
- Updates 'feelers' based on their environment
- Move
- Conditionally reproduce
  - Neural network can decide to mate if intersecting another cell
  - Cells automatically reproduce asexually if their size gets too large

## TODO
### Part 1 - Eats
- Improve User Interface
    - Include current generation and past 10 generation average fitness data on screen
    - Include button for switching between linear and neural model
    - Include settings panel for adjusting config values in real-time
- Explore more complex crossover events for the neural model
### Part 2 - Evo
- Code Refactor
  - Herbivore and Carnivore need to inherit from common Sample (currently heavily copy/pasted)
  - Move map generation and drawing functionality to a WorldMap object
  - Add docstrings
- Improve User Interface
- Explore more complex crossover events for the neural model