import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PollElement, PollId } from '../types/commonTypes';
import getPollDetails from '../utils/viewFunctions';


export default function PollDetails() {
  const { rawId } = useParams();
  const id: PollId = Number(rawId);
  const [pollDetails, setPollDetails] = useState<PollElement | null>(null);

  useEffect(() => {
    // Fetch the actual data, we only have a pollID on default

    const fetchData = async () => {
      const result: PollElement= await getPollDetails(id);
      setPollDetails(result);
    };

    fetchData();
  }, []);


  return (
    pollDetails? (
      <div id="pollDetails">
        <div id="pollDetailsLeft">
          <p>{pollDetails.name}</p>
          <p>{pollDetails.description}</p>
        </div>
        <div id="pollDetailsRight">
          <p>{"Visual things here"}</p>
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
