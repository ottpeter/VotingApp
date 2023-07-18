import { ethers } from 'ethers';
import { ListAllResult, PollElement, PollId, PollList, PollViewResult } from "../types/commonTypes";
import abiFile from "../contracts/VotingApp.sol/VotingApp.json";
import { CONTRACT_ADDRESS  } from "../variables";
declare let window: any;
const abi = abiFile.abi;


// Will give back a single Poll object, with details
// Input is PollId, which starts with 1
export async function getPollDetails(id: PollId) {
  if (!window.ethereum) return;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  
  const pollResult = await contract.viewPoll(id)
    .then((result: PollViewResult) => {
      const pollView: PollElement = parsePollView(id ,[result[0], result[1]]);
      return pollView;
    })
    .catch((err: Error) => console.error("There was an error while calling viewPoll: ", err));

  return pollResult;
}

// Will give back an object, where the key is PollID, and the value is PollName 
// Input is from index and limit, if limit > end, will go to end.
export async function getIdNameList(from: PollId, limit: number) {
  if (!window.ethereum) return;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

  const listAllResult = await contract.listAll(from, limit)
    .then((result: ListAllResult) => {
      const idNameList = parseList(result);
      return idNameList;
    })
    .catch((err: Error) => console.error("There was an error while calling listAll: ", err));

  return listAllResult;
}

// Will give back list of Polls that used to be active last time removeExpired() run
// Before displaying these elements, UNIX timestamp needs to be checked for each
export async function getActiveList() {
  if(!window.ethereum) return;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

  const listActiveResult = await contract.listActive()
    .then((result: ListAllResult) => {
      const activeList = parseList(result);
      return activeList;
    })
    .catch((err: Error) => console.error("There was an error while calling listActive: ", err));

    return listActiveResult;
}


// Will create a single object from the 2 objects that viewPoll gives back
function parsePollView(pollID: PollId, [PollViewObj, PollOptionsArray]: [any[], any[][]]) {
  const result = {
    id: pollID,
    name: PollViewObj[0],
    description: PollViewObj[1],
    createdTime: PollViewObj[2],
    endTime: PollViewObj[3],
    totalVoteCount: Number(PollViewObj[4][0]),
    options: PollOptionsArray.map((value) => ({
      optionName: value[0],
      voteCount: Number(value[1][0])
    }))
  }

  return result;
}

// This will put the poll list returned from listAll or listActive on an object,
// where key is PollId, and value is PollName
function parseList(input: ListAllResult) {
  const result: PollList = {};
  input.map((element) => result[element[0]] = element[1]);

  return result;
}