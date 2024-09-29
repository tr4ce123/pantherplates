import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import SavedMeals from './components/SavedMeals';
import CreateMeal from './components/CreateMeal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState('');

  return (
    <Router>
      <Routes>
        {/* Define all your routes here */}
        <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='/dashboard/meals' element={<SavedMeals/>} />
        <Route path='/dashboard/create' element={<CreateMeal/>} />
=======
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName}/>} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserName={setUserName}/>} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard setIsLoggedIn={setIsLoggedIn} userName={userName}/> : <Navigate to="/" />} />      
>>>>>>> 1564faf6c95bec3806e9b252d8fe55477b1ad8a0
      </Routes>
    </Router>
  );
}

export default App;
