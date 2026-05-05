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
import { Aircrafts } from './pages/Aircrafts';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Settings } from './pages/Settings';

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
          <Route path="/aircrafts" element={<ProtectedRoute><Aircrafts /></ProtectedRoute>} />
          <Route path="/knowledge/vk2500" element={<ProtectedRoute><KnowledgeBase sectionId="vk2500" /></ProtectedRoute>} />
          <Route path="/knowledge/tv3" element={<ProtectedRoute><KnowledgeBase sectionId="tv3" /></ProtectedRoute>} />
          <Route path="/knowledge/apu" element={<ProtectedRoute><KnowledgeBase sectionId="apu" /></ProtectedRoute>} />
          <Route path="/knowledge/generators" element={<ProtectedRoute><KnowledgeBase sectionId="generators" /></ProtectedRoute>} />
          <Route path="/knowledge/ac-power" element={<ProtectedRoute><KnowledgeBase sectionId="ac-power" /></ProtectedRoute>} />
          <Route path="/knowledge/dc-power" element={<ProtectedRoute><KnowledgeBase sectionId="dc-power" /></ProtectedRoute>} />
          <Route path="/knowledge/anti-ice" element={<ProtectedRoute><KnowledgeBase sectionId="anti-ice" /></ProtectedRoute>} />
          <Route path="/knowledge/fire" element={<ProtectedRoute><KnowledgeBase sectionId="fire" /></ProtectedRoute>} />
          <Route path="/knowledge/start" element={<ProtectedRoute><KnowledgeBase sectionId="start" /></ProtectedRoute>} />
          <Route path="/knowledge/lighting" element={<ProtectedRoute><KnowledgeBase sectionId="lighting" /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
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
