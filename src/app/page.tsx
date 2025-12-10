// src/app/page.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginScreen from '@/app/login/page';
import StudentRoomsList from './components/student/RoomsList';
import StudentRoomDetails from './components/student/RoomDetails';
import AdminDashboard from './components/admin/AdminDashboard';
import ModuleManagement from './components/admin/ModuleManagement';
import AddModule from './components/admin/AddModule';
import ModuleConfig from './components/admin/ModuleConfig';
import RoomRedirect from './components/RoomRedirect';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const handleLogin = (username: string, password: string) => {
    // Mock authentication
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setUserRole('admin');
    }
  };

  const handleStudentAccess = () => {
    setIsAuthenticated(true);
    setUserRole('student');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setRedirectPath(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <LoginScreen 
                onLogin={handleLogin} 
                onStudentAccess={handleStudentAccess}
              />
            ) : (
              <Navigate to={userRole === 'admin' ? '/admin' : '/student'} />
            )
          } 
        />
        
        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            isAuthenticated && userRole === 'student' ? (
              <StudentRoomsList onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/student/room/:roomId" 
          element={
            isAuthenticated && userRole === 'student' ? (
              <StudentRoomDetails onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        {/* Room NFC Redirect */}
        <Route 
          path="/room/:roomId" 
          element={
            <RoomRedirect 
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              onSetRedirect={setRedirectPath}
            />
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated && userRole === 'admin' ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/admin/modules" 
          element={
            isAuthenticated && userRole === 'admin' ? (
              <ModuleManagement onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/admin/modules/add" 
          element={
            isAuthenticated && userRole === 'admin' ? (
              <AddModule onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/admin/modules/:moduleId" 
          element={
            isAuthenticated && userRole === 'admin' ? (
              <ModuleConfig onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;