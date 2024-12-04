import React, { useState } from 'react';
import axios from 'axios';

function DonateButton() {
  const [donationAmount, setDonationAmount] = useState(0);

  const handleDonation = async () => {
    if (donationAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    try {
      const donationData = {
        amount: donationAmount,
        donor: 'John Doe', // Replace with actual donor info
        event: 'Sample Event', // Replace with actual event info
      };

      // Send donation data to the backend
      const response = await axios.post('http://localhost:4000/donate', donationData);

      if (response.status === 200) {
        alert('Donation request received, processing...');
      }
    } catch (err) {
      console.error('Donation error:', err);
      alert('Something went wrong, please try again.');
    }
  };

  return (
    <div>
      <input
        type="number"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        placeholder="Enter donation amount"
      />
      <button onClick={handleDonation}>Donate ${donationAmount}</button>
    </div>
  );
}

export default DonateButton;
