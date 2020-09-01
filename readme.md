# EvoEatSim
#### An Exploration into Evolution and Genetic Algorithms

In each of these simulations, a population of cells must survive in their environment and eat food to gain fitness. 

I use p5.js for graphics and TensorFlow.js for the neural networks.

## Part 1 - Eats
Cells are placed on a grid where they are rewarding for finding food and die if they touch the edge.

### Genetic Algorithm (GA)
Every N steps, the GA does the following:
- All living cells are killed off and their fitness are calculated
- The most fit cells mate, which involves crossover of the "DNA" of two cells and mutation of the resulting "DNA"
- The new population is placed in the environment

### Linear Model
In the linear model, "DNA" is represented as an array of directions that the cell will take. 

For example, N steps after the cell spawned, the cell will move in direction DNA\[ N \].

Crossover happens bit-wise. Genes are selected based on their dominance, which is tracked in the gene over generations. 

The specifics for crossover are based on the paper <cite>Selective Crossover in Genetic Algorithms: An Empirical Study</cite> (Vekaria & Clack '98)

### Neural Model
In the neural model, "DNA" is represented as the weights of a neural network.

Each step, a neural network takes environmental data as input and gives a direction to move as output. 

Crossover occurs at a layer-by-layer level between two neural networks.

### TODO
Include fitness data on screen
Include UI for switching between linear and neural model
Include UI for adjusting configs
