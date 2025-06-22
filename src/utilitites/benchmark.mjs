import Blockchain from "../models/Blockchain.mjs";

const blockchain = new Blockchain();

const times = [];

let previousTime, nextTime, nextBlock, timediff, average;

for (let i = 0; i < 10000; i++) {
  previousTime = blockchain.chain[blockchain.chain.length - 1].timestamp;

  blockchain.addBlock({ data: `Test block ${i}` });

  nextBlock = blockchain.chain.at(-1);
  nextTime = nextBlock.timestamp;

  timediff = nextTime - previousTime;
  times.push(timediff);

  average = times.reduce((sum, values) => sum + values) / times.length;
  console.log(
    `Time it took to mine a block: blocknr ${
      i + 1
    }. Time it took: ${timediff}ms. Difficultylevel: ${
      nextBlock.difficulty
    }. Avg. time: ${average.toFixed(2)}ms. Hash: ${nextBlock.hash}`
  );
}
