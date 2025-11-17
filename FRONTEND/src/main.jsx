import React from 'react';
import ReactDOM from 'react-dom/client'; // Assuming you're also using ReactDOM
import App from './App'; // Assuming you have an App component
import './index.css'; // Import your global styles, including Tailwind CSS
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
