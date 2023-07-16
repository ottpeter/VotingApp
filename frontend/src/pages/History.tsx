import React from 'react';
import { PollList } from '../types/commonTypes';
import ArchivedListElement from '../components/ArchivedListElement';


export default function History() {
  
  // this component will list all the polls that every existed, exluding the active ones
  // list elements contain less data on default, but can be clicked... this is questionable, probably they should contain lot of data
  // either a closed or an open poll can be clicked, and viewed in detail, that will lead to the same component, that's the idea
  // here has to be pagination, and that's not just a fallback, it's always there
  // Probalby only name will be displayed, because then we don't need to do extra fetch

  const pastPollsList: PollList = {
    1: "This is a poll",
    2: "The title of a poll",
    3: "The Third Poll",
    4: "Poll about an interesting question",
    5: "Poll Five",
    6: "This is the last poll that is closed"
  }

  return (
    <>
      <div>This will be the History</div>
      <ul>
        {Object.keys(pastPollsList).map((pollID) => (
          <ArchivedListElement pollId={Number(pollID)} pollName={pastPollsList[Number(pollID)]} />
        ))}
      </ul>
    </>
  )
}
