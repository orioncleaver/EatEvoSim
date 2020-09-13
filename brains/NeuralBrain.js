class NeuralBrain {

    constructor(inW = null, outW = null, inN = 10, hidN = 9, outN = 3) {
        this.inputN = inN;
        this.hiddenN = hidN;
        this.outputN = outN;

        this.inputW = inW
        this.outputW = outW
        
        // Initialize weights of neural network with random values.
        if (!this.inputW)
            this.inputW = tf.randomNormal([this.inputN, this.hiddenN]);
        if (!this.outputW)             
            this.outputW = tf.randomNormal([this.hiddenN, this.outputN]);
    }

    predictAll = function(features) {
        const inputs = features.concat([1.0]);
        let output;
        tf.tidy(() => {
            const inputLayer = tf.tensor(inputs, [1, this.inputN]);
            const hiddenLayer = inputLayer.matMul(this.inputW).sigmoid();
            const outputLayer = hiddenLayer.matMul(this.outputW).sigmoid();
            output = outputLayer.dataSync();
        });
        return output;
    }

    predictMax = function(features) {
        const output = this.predictAll(features);
        return tf.argMax(output).dataSync()[0]; 
    }

    crossover = function(other) {
        let child1Brain, child2Brain;

        const odds = int(random(0, 100));
        if (odds < 85) {
            const inWeights = this.crossoverLayers(this.inputW, other.inputW);
            const outWeights = this.crossoverLayers(this.outputW, other.outputW);
            child1Brain = new NeuralBrain(
                inWeights[0],
                outWeights[0],
                this.inputN,
                this.hiddenN,
                this.outputN);
            child2Brain = new NeuralBrain(
                inWeights[1],
                outWeights[1],
                this.inputN,
                this.hiddenN,
                this.outputN);
        } else {
            child1Brain = this.copy();
            child2Brain = other.copy();
        }
        
        return [child1Brain, child2Brain];
    }

    crossoverLayers(tensor1, tensor2) {
        const t1 = tensor1.dataSync();
        const t2 = tensor2.dataSync();
        const arr1 = Array.from(t1);
        const arr2 = Array.from(t2);
        let resultArr1 = [];
        let resultArr2 = [];

        const odds = int(random(0, 100));
        if (odds < 20) {
            resultArr1 = this.onePointCross(arr1, arr2);
            resultArr2 = this.onePointCross(arr2, arr1);
        } else if (odds < 40) {
            resultArr1 = this.twoPointCross(arr1, arr2);
            resultArr2 = this.twoPointCross(arr2, arr1);
        } else {
            resultArr1 = this.swapNeuronCross(arr1, arr2, tensor1.shape[1]);            
            resultArr2 = this.swapNeuronCross(arr2, arr1, tensor1.shape[1]);
        }

        const result1 = tf.tensor2d(resultArr1, tensor1.shape);
        const result2 = tf.tensor2d(resultArr2, tensor2.shape);

        return [result1, result2];
    }

    /**
     * Crossover event.
     */
    swapNeuronCross(layer1, layer2, neuronSize) {
        const first = int(random(0, layer2.length / neuronSize)) * neuronSize;
        const segment = layer2.slice(first, first + neuronSize);

        return this.insertSegmentIntoLayer(layer1, first, segment);
    }
    
    /**
     * Crossover event.
     */
    onePointCross(layer1, layer2) {
        const start = Math.floor(random(0, layer1.length));
        const segment = layer2.slice(start);

        return this.insertSegmentIntoLayer(layer1, start, segment);    
    }
    
    /**
     * Crossover event.
     */
    twoPointCross(layer1, layer2) {
        const first = int(random(0, layer1.length));
        const second = int(random(first, layer1.length));
        const segment = layer2.slice(first, second);

        return this.insertSegmentIntoLayer(layer1, first, segment);

    }
    
    mutate() {
        this.inputW = this.mutateLayer(this.inputW, this.hiddenN);
        this.outputW = this.mutateLayer(this.outputW, this.outputN);
    }

    mutateLayer(layer, neuronSize) {
        const t1 = layer.dataSync();
        let arr = Array.from(t1);
        for (let i = 0; i < arr.length; i += neuronSize) {
            const odds = int(random(0,50));
            if (odds == 1) {
                const segment = arr.slice(i, i + neuronSize);
                this.mutateNeuron(segment);
                
                arr = this.insertSegmentIntoLayer(arr, i, segment);
            }
        }
        return tf.tensor2d(arr, layer.shape);
    }

    mutateNeuron(neuron) {
        const odds = int(random(0,4));
        const index = int(random(0, neuron.length));
        if (odds == 0) {
            neuron[index] = random(-2,2);
        } else if (odds == 1) {
            neuron[index] *= 1.15;
            
            if (neuron[index] > 2)
                neuron[index] = 2;
            if (neuron[index] < -2)
                neuron[index] = -2;
        } else if (odds == 2) {
            neuron[index] *= .85;
        } else {
            const first = int(random(0, neuron.length));
            const second = int(random(0, neuron.length));
            const temp = neuron[first];
            neuron[first] = neuron[second];
            neuron[second] = temp;
        }
    }

    insertSegmentIntoLayer(layer, start, segment) {
        return layer.slice(0, start).concat(segment).concat(layer.slice(start+segment.length));
    }

    copy() {
        return new NeuralBrain(
            tf.clone(this.inputW), 
            tf.clone(this.outputW), 
            this.inputN, 
            this.hiddenN, 
            this.outputN
        );
    }
}