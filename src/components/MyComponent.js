// src/components/MyComponent.js
import React from 'react';

function MyComponent() {
  return <div>
    <h1>My Component</h1>
    <button onClick={alert(1)} >Click me</button>
    <input placeholder="Enter text" />
  </div>
};

export default MyComponent;
