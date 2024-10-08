import React, { useState } from 'react';

function HostEvent() {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  // Handle Video Upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  // Handle Description Input
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to send files and description
    const formData = new FormData();
    formData.append('video', video);
    images.forEach((image, index) => formData.append('images', image));
    formData.append('description', description);

    // Send the form data to the backend
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
    <div className="host-event">
      <h1>Host an Event</h1>

      {/* Section 1: Video Upload */}
      <section className="video-upload">
        <h2>Upload Video</h2>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        {video && <p>Selected video: {video.name}</p>}
      </section>

      {/* Section 2: About Product */}
      <section className="about-product">
        <h2>About Product</h2>
        <textarea
          placeholder="Write your product description..."
          value={description}
          onChange={handleDescriptionChange}
        />
        <h3>Upload Images</h3>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        <div className="image-preview">
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
        </div>
      </section>
      <button type="submit" onClick={handleSubmit}>
        Submit Event
      </button>

    </div>
  );
}

export default HostEvent;