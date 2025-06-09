import React, { useContext } from 'react';
import ChatPage from './pages/ChatPage';
import { SocketProvider } from './context/SocketContext';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { RoomSelectorPage } from './pages/RoomSelectorPage';
import NotificationProvider from './context/NotificationContext';
import Layout from './pages/Layout';

function App() {

  const PrivateRoute = () => {
    const { user } = useContext(AuthContext);
    return user ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <NotificationProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<Navigate to="/login" />} />
              <Route path="/login" element={<AuthPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Layout />}>
                  <Route path="chat/:roomId" element={<ChatPage />} />
                </Route>
              </Route>
            </Routes>

          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;