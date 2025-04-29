import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Dashboard from './Components/Dashboard';
import Login from './Components/Login'
import HomePage from './Components/HomePage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
