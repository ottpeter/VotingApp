import React from 'react';
import { Option, PollElement, PollId } from '../types/commonTypes';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ChartOptions } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { generateRandomColor } from '../utils/randomColor';
Chart.register(CategoryScale);
Chart.register(LinearScale)
Chart.register(BarElement)

interface ActiveListElementProps {
  pollElement: PollElement;
}


export default function ActiveListElement({pollElement}: ActiveListElementProps) {
  const navigate = useNavigate();
  
  function pollElementClicked(pollId: Number) {
    navigate(`/details/${pollElement.id}`);
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
      key={pollElement.id} 
      onClick={() => pollElementClicked(Number(pollElement.id))}
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
