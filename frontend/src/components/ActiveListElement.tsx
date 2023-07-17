import React from 'react';
import { Option, PollElement, PollId } from '../types/commonTypes';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ChartOptions } from 'chart.js';
import { useNavigate } from 'react-router-dom';
Chart.register(CategoryScale);
Chart.register(LinearScale)
Chart.register(BarElement)

interface ActiveListElementProps {
  pollID: PollId,
  pollElement: PollElement;
}


export default function ActiveListElement({pollID, pollElement}: ActiveListElementProps) {
  const navigate = useNavigate();
  
  function pollElementClicked(pollId: Number) {
    navigate(`/details/${pollID}`);
  }

  const pollData = pollElement.options.map((option: Option, index: number) => ({
    id: index,
    optionName: option.optionName,
    voteCount: option.voteCount
  }));

  const preparedData = {
    labels: pollData.map((datapoint) => datapoint.optionName),
    datasets: [
        {
          label: 'Popularity of colours',
          data: pollData.map((datapoint) => datapoint.voteCount),
          borderWidth: 1,
          backgroundColor: pollData.map(() => {
            const color = generateRandomColor();
            return color;
          }),
        }
    ]
  }
function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  let luminance = 0;

  do {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    // Calculate luminance of the color
    const rgb = parseInt(color.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    luminance = (r * 299 + g * 587 + b * 114) / 1000;
  } while (luminance < 128); // Adjust this threshold as needed

  return color;
}



  const chartOptions: ChartOptions = {
    indexAxis: 'y', 
    maintainAspectRatio: false, 
    responsive: true,
    plugins: {
      legend: {
        display: false,
        
      },
      tooltip: {
        enabled: true,
      },
      
    },
    
  }

  return (
    <li 
      key={pollID} 
      onClick={() => pollElementClicked(Number(pollID))}
      className="activeListElement"
    >
      <div className="activeListElLeftSide">
        <p className="activeListTitle">{pollElement.name}</p>
        <p className="activeListDesc">{pollElement.description}</p>
      </div>
      <div className="activeListElRightSide">
        <Bar data={preparedData} options={chartOptions} className="theChart"/>
      </div>
    </li>
  )
}
