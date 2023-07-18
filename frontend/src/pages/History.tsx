import { useEffect, useState } from 'react';
import { PollId, PollList } from '../types/commonTypes';
import ArchivedListElement from '../components/ArchivedListElement';
import { useNavigate, useParams } from 'react-router-dom';
import { getIdNameList } from '../utils/viewFunctions';
import { toast } from 'react-toastify';
import { TfiArrowCircleRight, TfiArrowCircleLeft } from 'react-icons/tfi';


export default function History() {
  const { pagenum } = useParams();
  const navigate = useNavigate();
  const currentPage: number = Number(pagenum) || 1;
  const LIMIT = 500;                                                  // How many items/page. Probably we will filter some out, so how many to fetch, and how many to display is different
  const perPage = 5;
  const [pollList, setPollList] = useState<PollList | null>(null);
  const [rigtArrow, setRightArrow] = useState<boolean>(false);
  

  useEffect(() => {
    setRightArrow(false);
    
    const fetch = async () => {
      const result = await getIdNameList(0, LIMIT);
      if (result === undefined) toast.error("There was en error while fetching poll list. Most likely those polls don't exist yet.");
      const resultList = (result as unknown) as PollList;                                           // All results

      const first = (perPage*currentPage)-perPage                                                   // Filter only selected page
      const last = perPage*currentPage;
      const keyList: PollList = {};
      Object.keys(resultList).sort((a, b) => Number(a) - Number(b)).slice(first, last).map((key) => {
        const id: PollId = Number(key);
        keyList[id] = resultList[id];
      });
      
      if (Object.keys(resultList).length > last) setRightArrow(true);                               // Toggle the pagination arrow
      setPollList(keyList);
    }

    fetch();
  }, [currentPage]);


  return (
    <div id="mainContent">
      <h1 id="mainTitle">List of All Polls</h1>

      {pollList && (
        <ul id="historyPollList">
          {Object.keys(pollList).map((pollID) => (
            <ArchivedListElement pollId={Number(pollID)} pollName={pollList[Number(pollID)]} />
          ))}
        </ul>
      )}

      {(pollList) && <div id="arrows">
          {(currentPage > 1) && (
            <button id="arrowLeft" onClick={() => navigate(`/history/${currentPage-1}`)}>
              <TfiArrowCircleLeft size={"50px"}/>
            </button>
          )}
          
          {(rigtArrow) && (
            <button id="arrowRight" onClick={() => navigate(`/history/${currentPage+1}`)}>
              <TfiArrowCircleRight size={"50px"}/>
            </button>
          )}
      </div>}
    </div>
  )
}
