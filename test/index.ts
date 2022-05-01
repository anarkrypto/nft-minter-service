import { mint, contractOwner, getTokenId, getTokenUri } from "../src/contract";
import { PRIVATE_KEY } from "../src/config";
import { expect } from "chai";
import { ethers } from "ethers";

// Define NFT data
const to = "0x746a28b9F4133757c293f7Cb95Cb6cda8E4913Ef";
const amount = 1;
const cid = "bafybeibnsoufr2renqzsh347nrx54wcubt5lgkeivez63xvivplfwhtpym";

let tokenId, txHash;

describe("** Check contract owner", async () => {
  it("Contract owner address should be the same as your PRIVATE_KEY env", async () => {
    const owner = await contractOwner();
    const { address } = new ethers.Wallet(PRIVATE_KEY);
    expect(address).to.be.equal(owner);
  }).timeout(15000);
});

describe("** Mint NFT", async () => {
  it("should create NFT and wait for confirmation", async () => {
    // Mint
    const receipt: any = await mint(to, amount, cid);

    expect(receipt).to.be.an("object");
    expect(receipt).to.have.property("hash");
    expect(receipt.hash).to.be.an("string");

    txHash = receipt.hash;

    expect(receipt).to.have.property("wait");
    expect(receipt.wait).to.be.an("function");

    // Waiting for confirmation...
    await receipt.wait();
  });
});

describe("** Get the new Token Id", () => {
  it("should return NFT id", async () => {
    // Gets token id from txHash
    tokenId = await getTokenId(txHash);

    expect(tokenId).to.be.an("number");
  }).timeout(15000);
});

describe("** Get Token URI", () => {
  it("should return NFT URI", async () => {
    const tokenUri = await getTokenUri(tokenId);
    expect(tokenUri).to.be.an("string");
  }).timeout(15000);
});
