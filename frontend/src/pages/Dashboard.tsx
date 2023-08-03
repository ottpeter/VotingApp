import { useState, useEffect } from 'react';
import { PollElement,  PollList } from '../types/commonTypes';
import ActiveListElement from '../components/ActiveListElement';
import { getActiveList, getPollDetails } from '../utils/viewFunctions';
import { TfiArrowCircleRight, TfiArrowCircleLeft } from 'react-icons/tfi';
import { PuffLoader } from 'react-spinners';


export default function Dashboard() {
  const [pollCount, setPollCount] = useState<number>(0);
  const [pollList, setPollList] = useState<PollList>({});
  const [pollDetails, setPollDetails] = useState<PollElement[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, [page]);

  // This will be called in useEffect
  const fetchData = async () => {
    const fetchResult = (await getActiveList() as unknown) as PollList;             // This can contain expired elements
    const allPollDetails: PollElement[] = [];                                       // List of all Poll details, not just visible
    
    await Promise.all(                                                              // We need to fetch all the Poll details, one by one
      Object.keys(fetchResult).map(async (pollID, index) => {
        const current: PollElement = (await getPollDetails(Number(pollID)) as unknown) as PollElement;
        allPollDetails.push(current);
      })
    );

    const activeList = Object.assign({}, fetchResult);
    const currentUnixTimestamp = Math.floor(new Date().getTime()/1000);             // We filter out the recently expired Polls
    const activePolls = allPollDetails.filter((poll: PollElement) => {
      if (poll.endTime < currentUnixTimestamp) {
        delete activeList[poll.id];
      }
      return poll.endTime > currentUnixTimestamp;
    });

    const currentPage = slicePageFromList(activeList, page);
    
    const currentDetails = allPollDetails.filter((poll) => {                         // We only load the current page details into state
      return currentPage.hasOwnProperty(poll.id);
    });
    
    setPollCount(Object.keys(activePolls).length);
    setPollList(currentPage);
    setPollDetails(currentDetails);

    setLoading(false);
  }

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

  function changePage(page: number) {
    setLoading(true);
    setPage(page);
  }

  if (loading) return (
    <div id="mainLoader">
      <PuffLoader
        color={"#f9f871"}
        size={150}
        aria-label="Loading..."
        />
    </div>
  );
  
  else return (
    <div id="mainContent">
      <h1 id="mainTitle">Currently Active Polls</h1>

     {pollDetails && <ul id="dashboardPollList">
        {Object.keys(pollList).map((pollID, index) => {
          return <ActiveListElement pollElement={pollDetails[index]} key={pollID}/>
        })}
      </ul>}

      {(pollCount > 3) && <div id="arrows">
          {(page > 1) && (
            <button id="arrowLeft" onClick={() => changePage(page-1)}>
              <TfiArrowCircleLeft size={"50px"}/>
            </button>
          )}

          {/*<div className="flexGrow"></div>*/}
          
          {(pollCount > page*3) && (
            <button id="arrowRight" onClick={() => changePage(page+1)}>
              <TfiArrowCircleRight size={"50px"}/>
            </button>
          )}
      </div>}
    </div>
  )
}
