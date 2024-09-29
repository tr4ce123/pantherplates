import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import SavedMeals from './components/SavedMeals';
import CreateMeal from './components/CreateMeal';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define all your routes here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='/dashboard/meals' element={<SavedMeals/>} />
        <Route path='/dashboard/create' element={<CreateMeal/>} />
      </Routes>
    </Router>
  );
}

export default App;
