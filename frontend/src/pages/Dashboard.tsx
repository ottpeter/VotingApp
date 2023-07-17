import React, { useState, useEffect } from 'react';
import { PollElement, PollId, PollInitObject, PollList } from '../types/commonTypes';
import ActiveListElement from '../components/ActiveListElement';
import { createPoll } from '../utils/createPoll';


export default function Dashboard() {
  const [pollCount, setPollCount] = useState<number>(0);
  const [pollList, setPollList] = useState<PollList>({});
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    // do actual fetch
    // do actual fetch
    const fetchResult = mockActiveList;
    setPollCount(Object.keys(fetchResult).length);
    const currentPage = slicePageFromList(fetchResult, page);
    setPollList(currentPage);
  }, [page]);

  // Page number starts from 1. There are 3 elements in 1 page
  function slicePageFromList(fullList: PollList, pageNumber: number) {
    const sortedKeys = Object.keys(fullList).sort((a, b) => Number(a) - Number(b));
    const resultObj: PollList = {};
    const elementsPerPage = 3;
    const startIndex = (pageNumber - 1) * elementsPerPage;
  
    for (let i = 0; i < elementsPerPage; i++) {
      const index = startIndex + i;
      const key = sortedKeys[index];
      if (key) {
        const parsedKey = parseInt(key, 10); // Parse the key as a number
        resultObj[parsedKey] = fullList[parsedKey];
      }
    }
  
    return resultObj;
  }

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

  async function create() {
    const pollDetails: PollInitObject = {
      name: "Cities",
      desc: "This is the second poll, where you can choose from cities",
      end: Math.floor(new Date().getTime()/1000 + 3600),
      options: ["Boston", "New York", "Lisbon", "Paris", "Budapest", "Berlin"]
    }

    await createPoll(pollDetails);
  }



  return (
    <div id="dashboard">
      <h1 id="dashboardTitle">Currently Active Polls</h1>

      <ul id="dashboardPollList">
        {Object.keys(pollList).map((pollID) => (          
          <ActiveListElement pollID={Number(pollID)} pollElement={mockPollElement} />
        ))}
      </ul>

      {(pollCount > 3) && <div id="arrows">
          {(page > 1) && (
            <button id="arrowLeft" onClick={() => setPage(page-1)}>
              {"<"}
            </button>
          )}
          
          {(pollCount > page*3) && (
            <button id="arrowRight" onClick={() => setPage(page+1)}>
              {">"}
            </button>
          )}
      </div>}
    </div>
  )
}
