import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from "./pages/LoginPage";
import {Chapters} from "./pages/Chapters";
import {AddChapter} from "./pages/AddChapter";

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/add-chapter" element={<AddChapter />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
