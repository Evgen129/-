import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Defects } from './pages/Defects';
import { Cards } from './pages/Cards';
import { Logbook } from './pages/Logbook';
import { Fuel } from './pages/Fuel';
import { Solutions } from './pages/Solutions';
import { Docs } from './pages/Docs';
import { Reports } from './pages/Reports';
import { Users } from './pages/Users';
import { InstallPWA } from './components/InstallPWA';

function ProtectedRoute({ children, reqAdmin = false }: { children: React.ReactNode, reqAdmin?: boolean }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (reqAdmin && user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/defects" replace />} />
          <Route path="/defects" element={<ProtectedRoute><Defects /></ProtectedRoute>} />
          <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
          <Route path="/logbook" element={<ProtectedRoute><Logbook /></ProtectedRoute>} />
          <Route path="/fuel" element={<ProtectedRoute><Fuel /></ProtectedRoute>} />
          <Route path="/solutions" element={<ProtectedRoute><Solutions /></ProtectedRoute>} />
          <Route path="/docs" element={<ProtectedRoute reqAdmin={true}><Docs /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute reqAdmin={true}><Reports /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute reqAdmin={true}><Users /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <InstallPWA />
    </AuthProvider>
  );
}
