import { Contract, TransactionReceipt, TransactionResponse, ethers } from 'ethers';
import abiFile from "../contracts/VotingApp.sol/VotingApp.json";
import { CONTRACT_ADDRESS } from '../variables';
import { PollInitObject } from '../types/commonTypes';
const abi = abiFile.abi;
declare let window: any;


export function createPoll(pollDetails: PollInitObject): Promise<TransactionReceipt> {
  return new Promise(async (resolve, reject) => {
    if (!window.ethereum) {
      reject(new Error("window.ethereum is not available"));
      return;
    }
  
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract: Contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    try {
      const response: TransactionResponse = await contract.createPoll(pollDetails.name, pollDetails.desc, pollDetails.end, pollDetails.options);
      console.log(`TransactionResponse TX hash: ${response.hash}`);
      const receipt: TransactionReceipt | null = await response.wait();
      if (receipt === null) {
        reject(new Error("ERROR! Transaction Receipt is null at createPoll"));
        return;
      }
      console.log("Receipt: ", receipt);
      resolve(receipt);
    } catch (err) {
      console.error("There was an error while calling createPoll: ", err);
      reject(err);
    }
  });
}
