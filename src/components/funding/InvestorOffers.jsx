import { useState } from 'react';
import '../../styles/main.css';

export default function InvestorOffers({ offers, startupData }) {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleAccept = (offerId) => {
   
    console.log("Offer accepted:", offerId);
  };

  const handleReject = (offerId) => {
   
    console.log("Offer rejected:", offerId);
  };

  return (
    <div className="investor-offers">
      <h2>Investor Offers</h2>
      
      {offers.length === 0 ? (
        <p>No offers yet. Share your funding round with investors!</p>
      ) : (
        <div className="offers-list">
          {offers.map(offer => (
            <div 
              key={offer.id} 
              className={`offer-card ${selectedOffer === offer.id ? 'selected' : ''}`}
              onClick={() => setSelectedOffer(offer.id)}
            >
              <div className="offer-header">
                <h3>{offer.investorName}</h3>
                <span className="offer-amount">${offer.amount.toLocaleString()}</span>
              </div>
              
              <div className="offer-details">
                <p>For {offer.equity}% equity</p>
                <p>Valuation: ${offer.valuation.toLocaleString()}</p>
                <p>Terms: {offer.terms}</p>
              </div>
              
              {selectedOffer === offer.id && (
                <div className="offer-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(offer.id);
                    }}
                    className="btn btn-primary"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(offer.id);
                    }}
                    className="btn btn-outline"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}