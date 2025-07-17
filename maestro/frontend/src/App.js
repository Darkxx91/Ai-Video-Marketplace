import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Character } from './Character';
import TemplateLibrary from './TemplateLibrary';
import VideoFeed from './VideoFeed';
import './App.css';

function App() {
  const [characterPosition, setCharacterPosition] = useState([0, 0, 0]);
  const [animationPrompt, setAnimationPrompt] = useState('');
  const characterRef = useRef();
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  const handleAnimationSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/generate-animation/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: animationPrompt }),
    });
    const data = await response.json();
    // This is where you would apply the animation to the character.
    // The exact implementation will depend on the format of the animation data.
    console.log(data.animation);
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    // This is a placeholder for the user ID.
    // You will need to implement user authentication to get the actual user ID.
    const userId = 1;
    const response = await fetch(`/users/${userId}/videos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: videoTitle, description: videoDescription }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="container">
      <h1>Maestro</h1>
      <div className="grid-container">
        <div className="grid-item">
          <TemplateLibrary />
        </div>
        <div className="grid-item">
          <VideoFeed />
        </div>
        <div className="grid-item">
          <h2>Create a new video</h2>
          <form onSubmit={handleVideoSubmit}>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Video title"
            />
            <textarea
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="Video description"
            />
            <button type="submit">Create Video</button>
          </form>
        </div>
        <div className="grid-item">
          <div style={{ height: '400px' }}>
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <Character position={characterPosition} ref={characterRef} />
              </Suspense>
              <OrbitControls />
            </Canvas>
          </div>
          <div>
            <h2>Controls</h2>
            <button onClick={() => setCharacterPosition([characterPosition[0] + 1, characterPosition[1], characterPosition[2]])}>Move X+</button>
            <button onClick={() => setCharacterPosition([characterPosition[0] - 1, characterPosition[1], characterPosition[2]])}>Move X-</button>
            <button onClick={() => setCharacterPosition([characterPosition[0], characterPosition[1], characterPosition[2] + 1])}>Move Z+</button>
            <button onClick={() => setCharacterPosition([characterPosition[0], characterPosition[1], characterPosition[2] - 1])}>Move Z-</button>
          </div>
          <div>
            <h2>Animations</h2>
            <form onSubmit={handleAnimationSubmit}>
              <input
                type="text"
                value={animationPrompt}
                onChange={(e) => setAnimationPrompt(e.target.value)}
                placeholder="Enter a prompt to generate an animation"
              />
              <button type="submit">Generate Animation</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
