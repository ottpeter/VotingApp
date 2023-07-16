import React from 'react';
import { PollElement } from '../types/commonTypes';

interface ActiveListElementProps {
  pollElement: PollElement;
}


export default function ActiveListElement({pollElement}: ActiveListElementProps) {

  // This will be one Poll element, it is still active, it is a little bit more visual than the closed one, it is working with PollElement type
  // The closed one also workes with Poll Element type


  return (
    <div className="activeListElement">
      <div className="activeListElLeftSide">
        <p>{pollElement.name}</p>
        <p>{pollElement.description}</p>
      </div>
      <div className="activeListElRightSide">
        {"some visual stuff"}
      </div>
    </div>
  )
}
