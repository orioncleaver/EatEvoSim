const NeuralBrain = function(inW, outW) {
    /*constructor*/
    if (inW) this.inputW = inW;
    if (outW) this.outputW = outW;

    this.inputN = 9; //inputs + 1 (bias)
    this.hiddenN = 3;
    this.outputN = 8;

    this.init = function() {
        this.inputW = tf.randomNormal([this.inputN, this.hiddenN]);
        this.outputW = tf.randomNormal([this.hiddenN, this.outputN]);
    }

    this.predict = function(features) {
        const inputs = features.concat([1.0]);
        let output;
        tf.tidy(() => {
            const inputLayer = tf.tensor(inputs, [1, this.inputN]);
            const hiddenLayer = inputLayer.matMul(this.inputW).sigmoid();
            const outputLayer = hiddenLayer.matMul(this.outputW).sigmoid();
            output = outputLayer.dataSync();
        });
        return tf.argMax(output).dataSync()[0];
    }

    this.crossover = function(other) {
        let child1Brain, child2Brain;

        const odds = int(random(0, 100));
        if (odds < 70) {
            const inWeights = this.crossoverLayers(this.inputW, other.inputW);
            const outWeights = this.crossoverLayers(this.outputW, other.outputW);
            child1Brain = new NeuralBrain(inWeights[0], outWeights[0]);
            child2Brain = new NeuralBrain(inWeights[1], outWeights[1]);
        } else {
            child1Brain = this.copy();
            child2Brain = other.copy();
        }
        
        return [child1Brain, child2Brain];
    }

    this.crossoverLayers = function(tensor1, tensor2) {
        const t1 = tensor1.dataSync();
        const t2 = tensor2.dataSync();
        const layer1 = Array.from(t1);
        const layer2 = Array.from(t2);
        let resLayer1 = [];
        let resLayer2 = [];

        const odds = int(random(0, 100));
        if (odds < 30) {
            resLayer1 = this.twoPoint(layer1, layer2);
            resLayer2 = this.twoPoint(layer2, layer1);
        } else {
            resLayer1 = this.onePoint(layer1, layer2);
            resLayer2 = this.onePoint(layer2, layer1);
        }

        const result1 = tf.tensor2d(resLayer1, tensor1.shape);
        const result2 = tf.tensor2d(resLayer2, tensor2.shape);
        return [result1, result2];
    }

    /*crossover event*/
    this.onePoint = function(layer1, layer2) {
        let result = [];

        const start = Math.floor(random(0, layer1.length));
        const segment = layer2.slice(start);

        result = layer1.slice(0, start);
        result = result.concat(segment);
        return result;
    }
    
    /*crossover event*/
    this.twoPoint = function(layer1, layer2, length) {
        let result = [];
    
        const first = int(random(0, length));
        const second = int(random(first, length));
        const segment = layer2.slice(first, second);
        
        result = layer1.slice(0, first);
        result = result.concat(segment);
        result = result.concat(layer1.slice(second));
        return result;
    }
    
    this.mutate = function() {
        this.inputW = this.mutateLayer(this.inputW);
        this.outputW = this.mutateLayer(this.outputW);
    }

    this.mutateLayer = function(layer) {
        const t1 = layer.dataSync();
        const newDNA = Array.from(t1);
        for (let i = 0; i < newDNA.length; i++) {
            const odds = int(random(0,100));
            if (odds == 1) {
                newDNA[i] = random(0,1);
            }
            if (odds == 2) {
                newDNA[i] += .1;
                if (newDNA[i] > 1) {
                    newDNA[i] = 1;
                }
            }
            if (odds == 3) {
                newDNA[i] -= .1;
                if (newDNA[i] < 0) {
                    newDNA[i] = 0;
                }
            }
        }
    
        if (int(random(0,100)) == 1) {
            const first = int(random(0, newDNA.length));
            const second = int(random(0, newDNA.length));
            const temp = newDNA[first];
            newDNA[first] = newDNA[second];
            newDNA[second] = temp;
        }

        return tf.tensor2d(newDNA, layer.shape);
    }

    this.copy = function() {
        const copy = new NeuralBrain(this.inputN, this.hiddenN, this.outputN);
        copy.inputW = tf.clone(this.inputW);
        copy.outputW = tf.clone(this.outputW);
        return copy;
    }
}