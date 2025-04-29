import { useState } from 'react';
import '../../styles/main.css';

export default function FundingRoundForm({ startupData, onSubmit }) {
  const [roundData, setRoundData] = useState({
    amount: '',
    equity: '',
    valuation: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoundData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate valuation if amount and equity are provided
    if (name === 'amount' || name === 'equity') {
      if (roundData.amount && roundData.equity) {
        const amount = name === 'amount' ? value : roundData.amount;
        const equity = name === 'equity' ? value : roundData.equity;
        if (!isNaN(amount) && !isNaN(equity) && equity > 0) {
          setRoundData(prev => ({
            ...prev,
            valuation: Math.round((amount / (equity / 100))).toLocaleString()
          }));
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...roundData,
      valuation: roundData.valuation.replace(/,/g, '')
    });
  };

  return (
    <form onSubmit={handleSubmit} className="funding-round-form">
      <div className="form-group">
        <label>Funding Amount ($)</label>
        <input
          type="number"
          name="amount"
          value={roundData.amount}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Equity Offered (%)</label>
        <input
          type="number"
          name="equity"
          min="1"
          max="100"
          value={roundData.equity}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Implied Valuation ($)</label>
        <input
          type="text"
          name="valuation"
          value={roundData.valuation ? `$${roundData.valuation}` : ''}
          readOnly
        />
      </div>
      
      <div className="form-group">
        <label>Round Description</label>
        <textarea
          name="description"
          value={roundData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        Create Funding Round
      </button>
    </form>
  );
}