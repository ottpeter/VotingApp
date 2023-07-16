import { PollId } from "../types/commonTypes";


export default async function getPollDetails(id: PollId) {
  
  /**MOCK */

  return {
    name: "Sample Poll",
    description: "This is a sample poll",
    createdTime: 1655863200, 
    endTime: 1656468800,
    totalVoteCount: 100,
    options: [
      {
        optionName: "Option 1",
        voteCount: 50
      },
      {
        optionName: "Option 2",
        voteCount: 30
      },
      {
        optionName: "Option 3",
        voteCount: 20  
      }
    ]
  }
}