import { Contract, TransactionReceipt, TransactionResponse, ethers } from 'ethers';
import abiFile from "../contracts/VotingApp.sol/VotingApp.json";
import { CONTRACT_ADDRESS } from '../variables';
import { PollInitObject } from '../types/commonTypes';
const abi = abiFile.abi;
declare let window: any;


// Creates a new poll, input parameters are name, description, expiration date, and list of options,
// which are inside PollInitObject
export async function createPoll(pollDetails: PollInitObject) {
  if (!window.ethereum) return;
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract: Contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  
  contract.createPoll(pollDetails.name, pollDetails.desc, pollDetails.end, pollDetails.options)
  .then((response: TransactionResponse) => {
    console.log(`TransactionResponse TX hash: ${response.hash}`);
    return response.wait();
  })
  .then((receipt: TransactionReceipt | null) => {
    if (receipt === null) throw `ERROR! Transaction Receipt is null at createPoll`;
    console.log("Receipt: ", receipt);
  })
  .catch((err: Error) => console.error("There was an error while calling createPoll: ", err));
}