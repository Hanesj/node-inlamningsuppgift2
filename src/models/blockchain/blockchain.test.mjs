import Blockchain from "./Blockchain.mjs";
import Block from "./Block.mjs";
import { beforeEach, describe, expect, it } from "vitest";
import { GENESIS_BLOCK } from "./genesis.mjs";

describe("Blockchain", () => {
  let blockchain;
  let blockchain_2, org_chain;
  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain_2 = new Blockchain();
    org_chain = blockchain.chain;
  });
  it("should containt an array of blocks", () => {
    expect(blockchain.chain instanceof Array).toBeTruthy();
  });

  it("should start with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("should add a new block to the chain", () => {
    const data = "Amazon";
    blockchain.addBlock({ data });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });
  describe("isValid() chain function", () => {
    describe("genesis block is not first block or is missing", () => {
      it("should return false", () => {
        blockchain.chain[0] = "strange-block";
        expect(Blockchain.isValid(blockchain.chain)).toBeFalsy();
      });
    });

    describe("when the chain has genesis block and consists of multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Loni" });
        blockchain.addBlock({ data: "Tuni" });
        blockchain.addBlock({ data: "JOI" });
        blockchain.addBlock({ data: "WERTA" });
      });

      describe("and the lastHash has changed", () => {
        it("should return false", () => {
          blockchain.chain[1].lastHash = "Oops";
          expect(Blockchain.isValid(blockchain.chain)).toBeFalsy();
        });
      });

      describe("and the chain contains a block with invalid info", () => {
        it("should return false", () => {
          blockchain.chain[blockchain.chain.length - 1].data = "Nuda";
          expect(Blockchain.isValid(blockchain.chain)).toBeFalsy();
        });
      });
      describe("and the chain does not contain any invalid blocks", () => {
        it("should return true", () => {
          expect(Blockchain.isValid(blockchain.chain)).toBeTruthy();
        });
      });
    });
  });

  describe("replace chain", () => {
    describe("when the new chain is not longer", () => {
      it("should not replace the chain", () => {
        blockchain_2.chain[0] = { data: "New data in block" };
        blockchain.replaceChain(blockchain_2.chain);

        expect(blockchain.chain).toEqual(org_chain);
      });
    });
    describe("when the new chain is longer", () => {
      beforeEach(() => {
        blockchain_2.addBlock({ data: "Loge" });
        blockchain_2.addBlock({ data: "Tuge" });
      });
      describe("but is invalid", () => {
        it("should not replace the chain", () => {
          blockchain_2.chain[1].hash = "Changed hash";
          blockchain.replaceChain(blockchain_2.chain);

          expect(blockchain.chain).toEqual(org_chain);
        });
      });
      describe("but is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(blockchain_2.chain);
        });
        it("should replace the chain", () => {
          expect(blockchain_2.chain).toEqual(blockchain.chain);
        });
      });
    });
  });
});
