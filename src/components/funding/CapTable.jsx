import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../../styles/main.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CapTable({ startupData, offers }) {
  // Calculate cap table distribution
  const calculateCapTable = () => {
    const founderEquity = 100 - offers.reduce((total, offer) => total + offer.equity, 0);
    
    return {
      labels: ['Founder', ...offers.map(offer => offer.investorName)],
      datasets: [{
        data: [founderEquity, ...offers.map(offer => offer.equity)],
        backgroundColor: [
          '#6c63ff',
          '#4d44db',
          '#ff6584',
          '#28a745',
          '#ffc107',
          '#17a2b8'
        ],
        borderWidth: 1
      }]
    };
  };

  return (
    <div className="cap-table">
      <h2>Cap Table</h2>
      
      <div className="cap-table-content">
        <div className="chart-container">
          <Pie data={calculateCapTable()} />
        </div>
        
        <div className="equity-list">
          <h3>Equity Distribution</h3>
          <ul>
            <li>
              <span className="equity-color founder"></span>
              <span>Founder: {100 - offers.reduce((total, offer) => total + offer.equity, 0)}%</span>
            </li>
            {offers.map((offer, index) => (
              <li key={offer.id}>
                <span className="equity-color" style={{
                  backgroundColor: calculateCapTable().datasets[0].backgroundColor[index + 1]
                }}></span>
                <span>{offer.investorName}: {offer.equity}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}