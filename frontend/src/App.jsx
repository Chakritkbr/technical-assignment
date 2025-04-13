import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/UserContext';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import Loading from './components/Loading';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route
        path='/auth'
        element={user ? <Navigate to='/chat' /> : <AuthPage />}
      />
      <Route
        path='/chat'
        element={user ? <ChatPage /> : <Navigate to='/auth' />}
      />
      <Route path='/' element={<Navigate to='/auth' />} />
    </Routes>
  );
}

export default App;
