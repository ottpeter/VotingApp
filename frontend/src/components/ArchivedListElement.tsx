import React from 'react';
import { PollId, PollName } from '../types/commonTypes';
import { useNavigate } from 'react-router-dom';

interface ArchivedListElementProps {
  pollId: PollId,
  pollName: PollName
}


export default function ArchivedListElement({pollId, pollName}: ArchivedListElementProps) {
  const navigate = useNavigate();

  // this will be a less vervose poll element, only name, can be clicked, and will lead to PollDetails

  function toDetailsPage() {
    console.log(`Navigating to: /details/${pollId}`);
    navigate(`/details/${pollId}`);
  }

  return (
    <li 
      key={pollId} 
      className="archivedListElement" 
      onClick={toDetailsPage}
    >
      <h2 className="archivedListElementTitle">{pollName}</h2>
    </li>
  )
}
