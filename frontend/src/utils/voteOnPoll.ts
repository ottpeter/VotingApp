import { Contract, TransactionReceipt, TransactionResponse, ethers } from 'ethers';
import abiFile from "../contracts/VotingApp.sol/VotingApp.json";
import { CONTRACT_ADDRESS } from '../variables';
import { PollId } from '../types/commonTypes';
const abi = abiFile.abi;
declare let window: any;

// Votes on a specified Poll, first parameter is PollId, second is number of option (starting from 0)
// PollIds start from 1
export async function voteOnPoll(pollID: PollId, optionIndex: number): Promise<TransactionReceipt> {
  return new Promise(async (resolve, reject) => {
    if (!window.ethereum) {
      reject(new Error("window.ethereum is not available"));
      return;
    };

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract: Contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    contract.vote(pollID, optionIndex)
      .then((response: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${response.hash}`);
        return response.wait();
      })
      .then((receipt: TransactionReceipt | null) => {
        if (receipt === null) {
          reject(new Error("TransactionReceipt is null!"));
          return;
        };
        resolve(receipt);
      })
      .catch((err: Error) => {
        console.error(`There was an error while trying to vote on proposal ${pollID}, optionIndex: ${optionIndex}`, err);
        reject(new Error(`There was an error while trying to vote on proposal ${pollID}, optionIndex: ${optionIndex}`));
        return;
      });
  });
}