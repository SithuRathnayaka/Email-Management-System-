import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedLayout from './components/ProtectedLayout';
import { useApp } from './context/AppContext';
import Login from './pages/Login';
import {
  Categories, Dashboard, EmailHistory, Recipients, Reports,
  RoleManagement, ScheduledEmails, Settings, Templates, UserManagement,
} from './pages/Pages';
import ComposeEmail from './pages/ComposeEmail';

function RequireAuth({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route element={<RequireAuth><ProtectedLayout /></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compose" element={<ComposeEmail />} />
        <Route path="/recipients" element={<Recipients />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/history" element={<EmailHistory />} />
        <Route path="/scheduled" element={<ScheduledEmails />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
