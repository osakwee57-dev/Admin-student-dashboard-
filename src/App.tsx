import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AuthLayout from './components/AuthLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <AuthLayout>
            <Register />
            <Login />
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout>
            <Register />
            <Login />
          </AuthLayout>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

