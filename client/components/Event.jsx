import React, { useState } from 'react';
import EventDetails from './EventDetails';
import QASession from './QASession';
import { Tabs, Tab, Box, Button } from '@mui/material';

function Event() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Tabs for switching between Details and Q&A */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="event navigation tabs"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
          <Tab label="Details" />
          <Tab label="Q&A" />
      </Tabs>

      {/* Content switching based on active tab */}
      <Box sx={{ padding: '20px 0' }}>
        {activeTab === 0 && <EventDetails />}
        {activeTab === 1 && <QASession />}
      </Box>
    </Box>
  );
}

export default Event;
