/* LinkONG Main App & Routing Core */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Homepage } from './components/Homepage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Layout } from './components/Layout';

// Admin Components
import { AdminFinancial } from './components/AdminFinancial';
import { AdminProjects } from './components/AdminProjects';
import { AdminVolunteers } from './components/AdminVolunteers';

// Coordinator Components
import { CoordinatorProjects } from './components/CoordinatorProjects';
import { CoordinatorActivities } from './components/CoordinatorActivities';
import { CoordinatorAttendance } from './components/CoordinatorAttendance';

// Volunteer Components
import { VolunteerBillboard } from './components/VolunteerBillboard';
import { VolunteerInscribe } from './components/VolunteerInscribe';
import { VolunteerHistory } from './components/VolunteerHistory';

// 🔒 Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando sesión de seguridad LinkONG...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // If not allowed, redirect to their corresponding default role page
    if (user.rol === 'Admin') return <Navigate to="/admin" replace />;
    if (user.rol === 'Coordinador') return <Navigate to="/coordinador" replace />;
    return <Navigate to="/voluntario" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🌐 Public Core Landing Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Group Protected Dashboard Routes under Layout wrapper */}
          <Route element={<Layout />}>
            
            {/* Admin Routes */}
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminFinancial />
              </ProtectedRoute>
            } />
            <Route path="admin/proyectos" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminProjects />
              </ProtectedRoute>
            } />
            <Route path="admin/voluntarios" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminVolunteers />
              </ProtectedRoute>
            } />

            {/* Coordinator Routes */}
            <Route path="coordinador" element={
              <ProtectedRoute allowedRoles={['Coordinador']}>
                <CoordinatorProjects />
              </ProtectedRoute>
            } />
            <Route path="coordinador/actividades" element={
              <ProtectedRoute allowedRoles={['Coordinador']}>
                <CoordinatorActivities />
              </ProtectedRoute>
            } />
            <Route path="coordinador/asistencia" element={
              <ProtectedRoute allowedRoles={['Coordinador']}>
                <CoordinatorAttendance />
              </ProtectedRoute>
            } />

            {/* Volunteer Routes */}
            <Route path="voluntario" element={
              <ProtectedRoute allowedRoles={['Voluntario']}>
                <VolunteerBillboard />
              </ProtectedRoute>
            } />
            <Route path="voluntario/inscripcion" element={
              <ProtectedRoute allowedRoles={['Voluntario']}>
                <VolunteerInscribe />
              </ProtectedRoute>
            } />
            <Route path="voluntario/historial" element={
              <ProtectedRoute allowedRoles={['Voluntario']}>
                <VolunteerHistory />
              </ProtectedRoute>
            } />
          </Route>

          {/* Fallback Catch-All Redirect to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
