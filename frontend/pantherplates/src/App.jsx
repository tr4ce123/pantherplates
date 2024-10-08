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
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName}/>} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserName={setUserName}/>} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard setIsLoggedIn={setIsLoggedIn} userName={userName}/> : <Navigate to="/" />} />      
        <Route path='/dashboard/create' element={<CreateMeal userName={userName}/>}/>
        <Route path='dashboard/meals' element={isLoggedIn ? <SavedMeals userName={userName}/> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
