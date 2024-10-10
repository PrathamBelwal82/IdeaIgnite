import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Box } from '@mui/material';

function HostEvent() {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');

  // Handlers
  const handleCompanyChange = (e) => setCompany(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);
  const handleThumbnailUpload = (e) => setThumbnail(e.target.files[0]);
  const handleImageUpload = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', video);
    formData.append('thumbnail', thumbnail);
    formData.append('description', description);
    formData.append('company', company);
    formData.append('category', category);
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
            <TextField
              fullWidth
              label="About Product"
              multiline
              rows={4}
              variant="outlined"
              value={description}
              onChange={handleDescriptionChange}
              required
            />
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
