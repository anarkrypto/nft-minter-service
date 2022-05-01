import { weitoEther } from "./utils";
const ethers = require("ethers");
const {
  RPC_URL,
  MAX_ETHER_FEE,
  CONTRACT_ADDRESS,
  PRIVATE_KEY,
} = require("./config");
const { abi } = require("../artifacts/NFT.sol/MintNFT.json");

export function mint(to: string, amount: number, cid: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      // Set Provider
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

      // Set wallet from PRIVATE KEY
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

      // Set contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

      // Estimate fee
      const feeData = await provider.getFeeData();
      const gasEstimation = await contract.estimateGas.mint(to, amount, cid);
      const feeEstimation = gasEstimation * feeData.gasPrice; // in wei
      const etherFee = weitoEther(feeEstimation);

      // Check max fee
      if (etherFee > MAX_ETHER_FEE) {
        return reject("Fee is too high!");
      }

      // Transact
      const receipt = await contract.mint(to, amount, cid);

      resolve(receipt);
    } catch (err) {
      reject(err);
    }
  });
}

export function contractOwner(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    const owner = await contract.owner();
    resolve(owner);
  });
}

export function getTokenId(transactionHash: string): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const iface = new ethers.utils.Interface(abi);

      // Filtering by the event topic directly saves bandwidth and only
      // returns matching logs
      const filter = {
        address: CONTRACT_ADDRESS,
        topics: [iface.getEventTopic("TransferSingle")],
        transactionHash,
      };

      const logs = await provider.getLogs(filter);
      const events = logs.map((log: any) => iface.parseLog(log));
      resolve(Number(events[0].args.id));
    } catch (err) {
      reject(err);
    }
  });
}

export function getTokenUri(tokenId: number | string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

      const tokenUri = await contract.uri(tokenId);

      resolve(tokenUri);
    } catch (err) {
      reject(err);
    }
  });
}
