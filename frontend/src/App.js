import React, { useContext } from 'react';
import ChatPage from './pages/ChatPage';
import { SocketProvider } from './context/SocketContext';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { RoomSelectorPage } from './pages/RoomSelectorPage';
import NotificationProvider from './context/NotificationContext';
import Layout from './pages/Layout';
import { ThemeContextProvider } from './context/ThemeContext';

function App() {

  const PrivateRoute = () => {
    const { user } = useContext(AuthContext);
    return user ? <Outlet /> : <Navigate to="/login" />;
  };

  // WelcomeMessage.jsx
  const WelcomeMessage = () => (
    <div style={{ textAlign: "center", marginTop: "20vh", color: "#888", fontSize: "1.2rem" }}>
      👉 Select a room from the left to open the chat.
    </div>
  );


  return (
    <ThemeContextProvider>
      <NotificationProvider>
        <AuthProvider>
          <SocketProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/*" element={<Navigate to="/login" />} />
                <Route path="/login" element={<AuthPage />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Layout />}>
                    <Route index element={<WelcomeMessage />} />
                    <Route path="chat/:roomId" element={<ChatPage />} />
                  </Route>
                </Route>
              </Routes>

            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeContextProvider>
  );
}

export default App;