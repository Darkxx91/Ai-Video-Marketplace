import React, { useState, useEffect } from 'react';

function VideoFeed({ videos }) {
  const handleLike = async (videoId) => {
    // This is a placeholder for the user ID.
    // You will need to implement user authentication to get the actual user ID.
    const userId = 1;
    await fetch(`/videos/${videoId}/like/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
  };

  const handleComment = async (videoId, text) => {
    // This is a placeholder for the user ID.
    // You will need to implement user authentication to get the actual user ID.
    const userId = 1;
    await fetch(`/videos/${videoId}/comments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, text }),
    });
  };

  return (
    <div>
      <h2>Video Feed</h2>
      {videos.map((video) => (
        <div key={video.id}>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
          <button onClick={() => handleLike(video.id)}>Like</button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleComment(video.id, e.target.elements.comment.value);
              e.target.elements.comment.value = '';
            }}
          >
            <input type="text" name="comment" placeholder="Add a comment" />
            <button type="submit">Comment</button>
          </form>
          <ul>
            {video.comments.map((comment) => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default VideoFeed;
