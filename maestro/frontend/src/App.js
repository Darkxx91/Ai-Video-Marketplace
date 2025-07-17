import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bokeh } from '@react-three/postprocessing';
import { Character } from './Character';
import TemplateLibrary from './TemplateLibrary';
import VideoFeed from './VideoFeed';
import { lenses } from './lenses';
import './App.css';

function App() {
  const [characterPosition, setCharacterPosition] = useState([0, 0, 0]);
  const [animation, setAnimation] = useState('idle');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const characterRef = useRef();
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videos, setVideos] = useState([]);
  const [contentVideoId, setContentVideoId] = useState('');
  const [styleVideoId, setStyleVideoId] = useState('');
  const [selectedLens, setSelectedLens] = useState(lenses[0]);

  useEffect(() => {
    fetch('/videos/')
      .then((response) => response.json())
      .then((data) => setVideos(data));
  }, []);

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

  const handleStyleTransferSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/style-transfer/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content_video_id: contentVideoId, style_video_id: styleVideoId }),
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
          <VideoFeed videos={videos} />
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
          <h2>Style Transfer</h2>
          <form onSubmit={handleStyleTransferSubmit}>
            <select value={contentVideoId} onChange={(e) => setContentVideoId(e.target.value)}>
              <option value="">Select Content Video</option>
              {videos.map((video) => (
                <option key={video.id} value={video.id}>
                  {video.title}
                </option>
              ))}
            </select>
            <select value={styleVideoId} onChange={(e) => setStyleVideoId(e.target.value)}>
              <option value="">Select Style Video</option>
              {videos.map((video) => (
                <option key={video.id} value={video.id}>
                  {video.title}
                </option>
              ))}
            </select>
            <button type="submit">Transfer Style</button>
          </form>
        </div>
        <div className="grid-item">
          <div style={{ height: '400px' }}>
            <Canvas camera={{ fov: selectedLens.props.fov }}>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <Character position={characterPosition} ref={characterRef} animation={animation} animationSpeed={animationSpeed} />
              </Suspense>
              <OrbitControls />
              <EffectComposer>
                <Bokeh {...selectedLens.props} />
              </EffectComposer>
            </Canvas>
          </div>
          <div>
            <h2>Lenses</h2>
            <select onChange={(e) => setSelectedLens(lenses[e.target.value])}>
              {lenses.map((lens, index) => (
                <option key={lens.name} value={index}>
                  {lens.name}
                </option>
              ))}
            </select>
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
            <button onClick={() => setAnimation('idle')}>Idle</button>
            <button onClick={() => setAnimation('run')}>Run</button>
            <button onClick={() => setAnimation('jump')}>Jump</button>
            <div>
              <label>Animation Speed</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
