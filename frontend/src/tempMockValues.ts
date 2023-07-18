import { PollElement, PollList } from "./types/commonTypes"

const mockActiveList: PollList = {
  7: "First Poll",
  8: "Second Poll",
  9: "Poll Nine",
  10: "Ten",
  11: "Eleven",
  12: "Twelve",
  13: "Thirteen",
  14: "Poll 14"
}

// Will need to fetch these one-by-one. We don't want to display a lot of this on one page
const mockPollElement: PollElement = {
  id: 0,
  name: "First Poll with long name max reached",
  description: "This is the poll description and it is a long poll description. The maximum allowed description is 128 bytes, which is usually 128 characters.",
  createdTime: 1689523474,
  endTime: 1689583490,
  totalVoteCount: 3,
  options: [
    {
      optionName: "Alice",
      voteCount: 8
    },{
      optionName: "Bob",
      voteCount: 1
    },{
      optionName: "Carol",
      voteCount: 5
    },
    {
      optionName: "Diana",
      voteCount: 2
    },{
      optionName: "Euxledia",
      voteCount: 1
    },{
      optionName: "Frank",
      voteCount: 0
    },
    {
      optionName: "Gred",
      voteCount: 2
    },{
      optionName: "Josh",
      voteCount: 1
    },{
      optionName: "Xenia",
      voteCount: 3
    },
    {
      optionName: "Alfred",
      voteCount: 2
    },{
      optionName: "Bianka",
      voteCount: 5
    },{
      optionName: "Kate",
      voteCount: 6
    },
    {
      optionName: "Jennifer",
      voteCount: 6
    },{
      optionName: "Laura",
      voteCount: 5
    },{
      optionName: "Tifanny",
      voteCount: 2
    }
  ]
}