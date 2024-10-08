import React, { useState } from 'react';
import EventDetails from './EventDetails';
import QASession from './QASession';
import '../src/Event.css'
function Event() {
  const [activeTab, setActiveTab] = useState('details');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Navbar to switch between Details and Q&A */}
      <div className="event-navbar">
        <button 
          className={activeTab === 'details' ? 'active' : ''} 
          onClick={() => handleTabClick('details')}
        >
          Details
        </button>
        <button 
          className={activeTab === 'QA' ? 'active' : ''} 
          onClick={() => handleTabClick('QA')}
        >
          Q&A
        </button>
      </div>

      {/* Content switching based on active tab */}
      {activeTab === 'details' && <EventDetails />}
      {activeTab === 'QA' && <QASession />}
    </div>
  );
}

export default Event;
