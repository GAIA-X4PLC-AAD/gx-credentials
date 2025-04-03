import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router';

import History from './pages/History';

import Login from '@/pages/Login/Login';
import Profile from '@/pages/Profile/Profile';
import { Toaster } from '@/components/ui/sonner';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/setting" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default AppRouter;
