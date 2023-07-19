import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Option, PollElement, PollId } from '../types/commonTypes';
import { getPollDetails } from '../utils/viewFunctions';
import { voteOnPoll } from '../utils/voteOnPoll';
import { PuffLoader } from 'react-spinners';
import { generateRandomColor } from '../utils/randomColor';
import { Chart, ChartOptions, ChartData, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';
Chart.register(ArcElement, Tooltip, Legend);


export default function PollDetails() {
  const { id } = useParams();
  const pollID: PollId = Number(id);
  const isMobile =  window.innerWidth <=600;
  const currentUnixTime = Math.floor(new Date().getTime()/1000);
  const [pollDetails, setPollDetails] = useState<PollElement | undefined>(undefined);
  const [data, setData] = useState<ChartData | null>(null);

  useEffect(() => {
    // Fetch the actual data, we only have a pollID on default
    const fetchData = async () => {
      const result: PollElement = (await getPollDetails(pollID) as unknown) as PollElement;
      if (result === undefined) console.error("getPollDetails returned undefined!");
      setPollDetails(result);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!pollDetails) return;

    const pollData = pollDetails.options.map((option: Option, index: number) => ({
      id: index,
      optionName: option.optionName,
      voteCount: option.voteCount
    }));
    
    const preparedData: ChartData = {
      labels: pollData.map((datapoint) => datapoint.optionName),
      datasets: [
          {
            label: "Vote count",  
            data: pollData.map((datapoint) => datapoint.voteCount),
            borderWidth: 1,
            backgroundColor: pollData.map(() => {
              const color = generateRandomColor();
              return color;
            }),
          }
      ]
    }
    
    setData(preparedData as ChartData);
  }, [pollDetails]);

  function vote(optionIndex: number) {
    const params = {};

    toast.promise(
      voteOnPoll(pollID, optionIndex),
      {
        pending: "Transaction is pending...",
        success: "You voted!",
        error: "There was an error while trying to send the transaction."
      }
    );
  }

  function createDateString(unixTime: number) {
    const timeObj = new Date(unixTime*1000);
    return timeObj.toDateString();
  }

  const chartOptions: ChartOptions<"doughnut"> = {
    //indexAxis: 'y', 
    maintainAspectRatio: false, 
    responsive: true,
    plugins: {
      legend: {
        display: false,    
        position: "right"    
      },
      tooltip: {
        enabled: true,
      },
    },
  }


  return (
    <div id="mainContent">

      {pollDetails? (

        <div id="pollDetails">
          <div id="pollDetailsLeft">
            
            <h1 id="pollDetailsTitle" aria-label="Title">{pollDetails.name}</h1>
            
            {isMobile && data && (
              <div id="dougnutContainer">
                <Doughnut 
                  data={(data as unknown) as ChartData<"doughnut", any, any>} 
                  options={chartOptions} className="theChart" 
                />
              </div>
            )}
            
            <p className="pollDetailsText" aria-label="Description">{pollDetails.description}</p>

            {/** Check if the poll expired */}
            {(pollDetails.endTime > currentUnixTime) ? (
              <p className="pollDetailsText" aria-label="Expiration Info">
                {"Will expire: "}
                {createDateString(Number(pollDetails.endTime))}
              </p>
              ) : (
                <p className="pollDetailsText" aria-label="Expiration Info">
                  {"Expired: "}
                  {createDateString(Number(pollDetails.endTime))}
                </p>
            )}

            <p className="pollDetailsText">{"Total Vote Count:   "}{pollDetails.totalVoteCount}</p>

              {(pollDetails.endTime > currentUnixTime) ? (
                <>
                  <div className="flexGrow"></div>
                  <h2 className="pollDetails2ndTitle">{"Click on an option to vote!"}</h2>
                  <ul id="voteList">
                    {pollDetails.options.map((option: Option, index) => (
                      <li 
                        key={index}
                        className="voteOption"
                        onClick={() => vote(index)}
                      >
                        {option.optionName}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="pollDetailsText">{"This poll has ended."}</p>
              )}
          </div>
          {!isMobile && <div id="pollDetailsRight">
            {data && (
              <div id="dougnutContainer">
                <Doughnut 
                  data={(data as unknown) as ChartData<"doughnut", any, any>} 
                  options={chartOptions} className="theChart" 
                />
              </div>
            )}
          </div>}
        </div>

      ) : (

        <div id="pollDetails" className="centered">
          <PuffLoader 
            color={"#f9f871"}
            size={150}
            aria-label="Loading..."
          />
        </div>

      )}

    </div>
  )
}
