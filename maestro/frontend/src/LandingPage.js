import React from 'react';

function LandingPage({ onLogin }) {
  return (
    <div>
      <h1>Welcome to Maestro</h1>
      <p>The AI-powered virtual production studio for everyone.</p>
      <button onClick={onLogin}>Login</button>
    </div>
  );
}

export default LandingPage;
