import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  internalCount: number;
  externalCount: number;
}

const LinkBreakdownChart: React.FC<Props> = ({ internalCount, externalCount }) => {
  const data = {
    labels: ['Internal Links', 'External Links'],
    datasets: [
      {
        data: [internalCount, externalCount],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '300px', height: '300px' }}>
      <Pie data={data} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default LinkBreakdownChart;
