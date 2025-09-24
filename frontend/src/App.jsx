import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AppShellLayout from './components/AppShellLayout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Or a spinner
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'Admin') return <Navigate to="/dashboard" />;
    return children;
};

function App() {
  const { user } = useAuth();

  return (
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
              path="/admin/*" 
              element={
                  <ProtectedRoute adminOnly={true}>
                      <AppShellLayout>
                         <AdminDashboard />
                      </AppShellLayout>
                  </ProtectedRoute>
              } 
          />
          <Route 
              path="/dashboard" 
              element={
                  <ProtectedRoute>
                      <AppShellLayout>
                          <UserDashboard />
                      </AppShellLayout>
                  </ProtectedRoute>
              } 
          />
          <Route path="*" element={<Navigate to={user ? (user.role === 'Admin' ? '/admin' : '/dashboard') : '/login'} />} />
      </Routes>
  );
}

export default App;