import React, { useState, useEffect } from 'react';

function VideoFeed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch('/videos/')
      .then((response) => response.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <div>
      <h2>Video Feed</h2>
      {videos.map((video) => (
        <div key={video.id}>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
        </div>
      ))}
    </div>
  );
}

export default VideoFeed;
