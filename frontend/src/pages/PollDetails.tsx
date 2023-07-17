import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Option, PollElement, PollId } from '../types/commonTypes';
import { getActiveList, getIdNameList, getPollDetails } from '../utils/viewFunctions';
import { voteOnPoll } from '../utils/voteOnPoll';


export default function PollDetails() {
  const { id } = useParams();
  const pollID: PollId = Number(id);
  const [pollDetails, setPollDetails] = useState<PollElement | undefined>(undefined);

  useEffect(() => {
    // Fetch the actual data, we only have a pollID on default
    const fetchData = async () => {
      const result: PollElement = (await getPollDetails(pollID) as unknown) as PollElement;
      if (result === undefined) console.error("getPollDetails returned undefined!");
      setPollDetails(result);
    };

    fetchData();
  }, []);

  async function vote(optinIndex: number) {
    await voteOnPoll(pollID, optinIndex)
  }


  return (
    pollDetails? (
      <div id="pollDetails">
        <div id="pollDetailsLeft">
          <p>{pollDetails.name}</p>
          <p>{pollDetails.description}</p>
          <ul>
            {pollDetails.options.map((voteOption: Option, index) => {
              return (
                <li key={voteOption.optionName} onClick={() => vote(index)}>
                  {voteOption.optionName} - {voteOption.voteCount}
                </li>
              );
            })}
            <p>{"Total Vote Count: "}{pollDetails.totalVoteCount}</p>
          </ul>
        </div>
        <div id="pollDetailsRight">
          <p>{"Visual things here. And so on."}</p>
        </div>
      </div>
    ) : (
      <div id="pollDetails">
        <div id="pollDetailsLeft">
          <p>{"data is still loading"}</p>
          <p>{"data is still loading"}</p>
        </div>
        <div id="pollDetailsRight">
          <p>{"Visual things here"}</p>
        </div>
      </div>
    )
  )
}
