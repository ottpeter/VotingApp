import React from 'react';
import { PollElement, PollInitObject, PollList } from '../types/commonTypes';
import ActiveListElement from '../components/ActiveListElement';
import { createPoll } from '../utils/createPoll';


export default function Dashboard() {

  // this component will list all the active Polls as a list, the list elements contain relatively lot of data
  // will add pagination if there are more then 3-5 elements. Otherwise pagination will be turned off
  // will need to check if Polls are still active, after calling getActiveList()

  const mockActiveList: PollList = {
    7: "First Poll",
    8: "Second Poll"
  }

  // Will need to fetch these one-by-one. We don't want to display a lot of this on one page
  const mockPollElement: PollElement = {
    name: "First Poll",
    description: "This is the poll description",
    createdTime: 1689523474,
    endTime: 1689583490,
    totalVoteCount: 3,
    options: [
      {
        optionName: "Alice",
        voteCount: 2
      },{
        optionName: "Bob",
        voteCount: 1
      },{
        optionName: "Carol",
        voteCount: 0
      }
    ]
  }

  async function create() {
    const pollDetails: PollInitObject = {
      name: "Cities",
      desc: "This is the second poll, where you can choose from cities",
      end: Math.floor(new Date().getTime()/1000 + 3600),
      options: ["Boston", "New York", "Lisbon", "Paris", "Budapest", "Berlin"]
    }

    await createPoll(pollDetails);
  }

  function pollElementClicked(pollId: Number) {
    window.alert(`Poll ID is: ${pollId}`);
  }

  return (
    <div>This will be the Dashboard
      <button onClick={create}>CREATE NEW POLL</button>
      <ul>
        {Object.keys(mockActiveList).map((pollID) => (
          <li key={pollID} onClick={() => pollElementClicked(Number(pollID))}>
            <ActiveListElement pollElement={mockPollElement} />
          </li>
        ))}
      </ul>
    </div>
  )
}
