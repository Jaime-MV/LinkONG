import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CoordinatorDashboard } from './pages/CoordinatorDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';

function App() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user.role === 'coordinador') {
    return <CoordinatorDashboard />;
  }

  if (user.role === 'voluntario') {
    return <VolunteerDashboard />;
  }

  return <div>Rol no reconocido.</div>;
}

export default App;
