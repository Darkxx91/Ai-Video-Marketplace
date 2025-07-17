import React, { useState, useEffect } from 'react';

function TemplateLibrary() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetch('/templates/')
      .then((response) => response.json())
      .then((data) => setTemplates(data));
  }, []);

  return (
    <div>
      <h2>Template Library</h2>
      <ul>
        {templates.map((template) => (
          <li key={template.name}>{template.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TemplateLibrary;
