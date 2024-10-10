import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Box } from '@mui/material';

function HostEvent() {
  const [description, setDescription] = useState(''); // Description state
  const [images, setImages] = useState([]); // State to hold multiple images
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [totalFunds, setTotalFunds] = useState(0); // Total funds to raise
  const [endDate, setEndDate] = useState(''); // Event end date

  // Handlers
  const handleCompanyChange = (e) => setCompany(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value); // Added description handler
  const handleVideoChange = (e) => setVideo(e.target.files[0]);
  const handleThumbnailUpload = (e) => setThumbnail(e.target.files[0]);

  // Updated to handle multiple files
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Get the selected files
    setImages((prevImages) => prevImages.concat(files)); // Combine with existing images
  };

  const handleTotalFundsChange = (e) => setTotalFunds(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', video);
    formData.append('thumbnail', thumbnail);
    formData.append('description', description); // Include description in formData
    formData.append('company', company);
    formData.append('category', category);
    formData.append('totalFunds', totalFunds);
    formData.append('endDate', endDate);

    // Append each image in the images array to the form data
    images.forEach((image) => formData.append('images', image));

    try {
      const response = await fetch('http://localhost:4000/events', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert('Event successfully created!');
      } else {
        alert('Error creating event');
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('An error occurred while submitting the event.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Host an Event
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              variant="outlined"
              value={company}
              onChange={handleCompanyChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={category}
              onChange={handleCategoryChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Total Funds to Raise"
              type="number"
              variant="outlined"
              value={totalFunds}
              onChange={handleTotalFundsChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Event End Date"
              type="date"
              variant="outlined"
              value={endDate}
              onChange={handleEndDateChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="About Product" // Description field
              multiline
              rows={4}
              variant="outlined"
              value={description}
              onChange={handleDescriptionChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Upload Video</Typography>
            <Button variant="contained" component="label">
              Upload Video
              <input type="file" hidden accept="video/*" onChange={handleVideoChange} />
            </Button>
            {video && <Typography variant="body2">Selected video: {video.name}</Typography>}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Upload Thumbnail</Typography>
            <Button variant="contained" component="label">
              Upload Thumbnail
              <input type="file" hidden accept="image/*" onChange={handleThumbnailUpload} />
            </Button>
            {thumbnail && <Typography variant="body2">Selected thumbnail: {thumbnail.name}</Typography>}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Upload Images</Typography>
            <Button variant="contained" component="label">
              Upload Images
              <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
            </Button>
            <Box mt={2}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt="Uploaded"
                  width="100px"
                  height="100px"
                  style={{ margin: '10px' }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit Event
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HostEvent;
