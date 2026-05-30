import { useState, useEffect } from 'react';
import { MainLayout } from './components/layouts/MainLayout';
import { AdminLayout } from './components/layouts/AdminLayout';
import { StatsWebPart } from './components/webparts/StatsWebPart';
import { ActivityWebPart } from './components/webparts/ActivityWebPart';
import type { ActivityItem } from './components/webparts/ActivityWebPart';
import { NgoExplorerView } from './views/NgoExplorerView';
import { AdminManagementView } from './views/AdminManagementView';

interface Ngo {
  id: number;
  name: string;
  category: string;
  description: string;
  volunteersNeeded: number;
  location: string;
  contactEmail: string;
}

interface Volunteer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  status: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  budget: number;
  ngoId: number;
}

function App() {
  const [activeView, setActiveView] = useState<string>('explorer'); // 'explorer' or 'admin'
  const [activeTab, setActiveTab] = useState<string>('ngos'); // 'ngos', 'volunteers', 'projects'
  
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const addActivity = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const newItem: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setActivities(prev => [newItem, ...prev]);
  };

  // Centralized Data Fetchers
  const fetchAllData = async () => {
    addActivity('Cargando datos desde la API Spring Boot (PostgreSQL)...', 'info');
    
    // 1. Fetch NGOs
    try {
      const res = await fetch('/api/ngos');
      if (res.ok) {
        const data = await res.json();
        setNgos(data);
        addActivity(`Se cargaron ${data.length} ONGs desde PostgreSQL.`, 'success');
      } else {
        throw new Error('API NGO Error');
      }
    } catch {
      addActivity('Fallo al conectar con /api/ngos. Inicializando datos mock de ONGs.', 'info');
      seedMockNgos();
    }

    // 2. Fetch Volunteers
    try {
      const res = await fetch('/api/volunteers');
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data);
        addActivity(`Se cargaron ${data.length} Voluntarios desde PostgreSQL.`, 'success');
      } else {
        throw new Error('API Volunteer Error');
      }
    } catch {
      addActivity('Fallo al conectar con /api/volunteers. Inicializando datos mock de Voluntarios.', 'info');
      seedMockVolunteers();
    }

    // 3. Fetch Projects
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        addActivity(`Se cargaron ${data.length} Proyectos desde PostgreSQL.`, 'success');
      } else {
        throw new Error('API Project Error');
      }
    } catch {
      addActivity('Fallo al conectar con /api/projects. Inicializando datos mock de Proyectos.', 'info');
      seedMockProjects();
    }
  };

  const seedMockNgos = () => {
    const mock: Ngo[] = [
      { id: 1, name: 'EcoVida Verde', category: 'Medio Ambiente', description: 'Reforestación de bosques urbanos y preservación de áreas verdes.', volunteersNeeded: 12, location: 'Monterrey', contactEmail: 'contacto@ecovida.org' },
      { id: 2, name: 'Mentes Brillantes', category: 'Educación', description: 'Clases de informática y apoyo escolar a niños vulnerables.', volunteersNeeded: 8, location: 'Guadalajara', contactEmail: 'info@mentes.org' },
      { id: 3, name: 'Patitas al Rescate', category: 'Protección Animal', description: 'Albergue y adopción responsable para animales callejeros.', volunteersNeeded: 15, location: 'Ciudad de México', contactEmail: 'adopta@patitas.org' }
    ];
    setNgos(mock);
  };

  const seedMockVolunteers = () => {
    const mock: Volunteer[] = [
      { id: 1, fullName: 'Alejandro Gómez', email: 'alejandro@gmail.com', phone: '8112345678', skills: 'Educación, Computación', status: 'Activo' },
      { id: 2, fullName: 'Sofía Martínez', email: 'sofia@outlook.com', phone: '5512345678', skills: 'Diseño Gráfico, Redes', status: 'Pendiente' }
    ];
    setVolunteers(mock);
  };

  const seedMockProjects = () => {
    const mock: Project[] = [
      { id: 1, title: 'Reforestación Primavera 2026', description: 'Sembrado de 500 árboles nativos en la Huasteca.', status: 'En Progreso', budget: 1500, ngoId: 1 },
      { id: 2, title: 'Alfabetización Digital Infantil', description: 'Taller de programación básica Scratch.', status: 'Planificado', budget: 800, ngoId: 2 }
    ];
    setProjects(mock);
  };

  useEffect(() => {
    addActivity('Consola LinkONG inicializada.', 'info');
    fetchAllData();
  }, []);

  // --- CRUD API handlers ---

  // NGOs
  const handleAddNgo = async (ngo: Omit<Ngo, 'id'>) => {
    try {
      const res = await fetch('/api/ngos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ngo)
      });
      if (res.ok) {
        addActivity(`ONG '${ngo.name}' guardada correctamente en PostgreSQL.`, 'success');
        fetchAllData();
        return true;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error en validación');
      }
    } catch (e: any) {
      addActivity(`Fallo al agregar ONG: ${e.message}`, 'error');
      alert(`[Capa de Negocio API Error] ${e.message}`);
      return false;
    }
  };

  const handleEditNgo = async (id: number, ngo: Ngo) => {
    try {
      const res = await fetch(`/api/ngos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ngo)
      });
      if (res.ok) {
        addActivity(`ONG '${ngo.name}' modificada correctamente.`, 'success');
        fetchAllData();
        return true;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error en validación');
      }
    } catch (e: any) {
      addActivity(`Fallo al modificar ONG: ${e.message}`, 'error');
      alert(`[Capa de Negocio API Error] ${e.message}`);
      return false;
    }
  };

  const handleDeleteNgo = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta ONG?')) return false;
    try {
      const res = await fetch(`/api/ngos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addActivity('ONG eliminada exitosamente de PostgreSQL.', 'success');
        fetchAllData();
        return true;
      } else {
        throw new Error('Fallo del servidor');
      }
    } catch (e: any) {
      addActivity(`Fallo al eliminar ONG: ${e.message}`, 'error');
      return false;
    }
  };

  // Volunteers
  const handleAddVolunteer = async (v: Omit<Volunteer, 'id'>) => {
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v)
      });
      if (res.ok) {
        addActivity(`Voluntario '${v.fullName}' registrado exitosamente en PostgreSQL.`, 'success');
        fetchAllData();
        return true;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'El teléfono debe tener al menos 7 dígitos');
      }
    } catch (e: any) {
      addActivity(`Fallo al registrar voluntario: ${e.message}`, 'error');
      alert(`[Capa de Negocio API Error] ${e.message}`);
      return false;
    }
  };

  const handleEditVolunteer = async (id: number, v: Volunteer) => {
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v)
      });
      if (res.ok) {
        addActivity(`Voluntario '${v.fullName}' modificado exitosamente.`, 'success');
        fetchAllData();
        return true;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error en validación');
      }
    } catch (e: any) {
      addActivity(`Fallo al modificar voluntario: ${e.message}`, 'error');
      alert(`[Capa de Negocio API Error] ${e.message}`);
      return false;
    }
  };

  const handleDeleteVolunteer = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este voluntario?')) return false;
    try {
      const res = await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addActivity('Voluntario eliminado de PostgreSQL.', 'success');
        fetchAllData();
        return true;
      } else {
        throw new Error('Fallo en API');
      }
    } catch (e: any) {
      addActivity(`Fallo al eliminar voluntario: ${e.message}`, 'error');
      return false;
    }
  };

  // Projects
  const handleAddProject = async (p: Omit<Project, 'id'>) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        addActivity(`Proyecto '${p.title}' guardado correctamente.`, 'success');
        fetchAllData();
        return true;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Fallo de negocio en validación');
      }
    } catch (e: any) {
      addActivity(`Fallo al crear proyecto: ${e.message}`, 'error');
      alert(`[Capa de Negocio API Error] ${e.message}`);
      return false;
    }
  };

  const handleEditProject = async (id: number, p: Project) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        addActivity(`Proyecto '${p.title}' modificado correctamente.`, 'success');
        fetchAllData();
        return true;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error en validación');
      }
    } catch (e: any) {
      addActivity(`Fallo al modificar proyecto: ${e.message}`, 'error');
      alert(`[Capa de Negocio API Error] ${e.message}`);
      return false;
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return false;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addActivity('Proyecto eliminado de PostgreSQL.', 'success');
        fetchAllData();
        return true;
      } else {
        throw new Error('Fallo en API');
      }
    } catch (e: any) {
      addActivity(`Fallo al eliminar proyecto: ${e.message}`, 'error');
      return false;
    }
  };

  // Public candidate registration trigger
  const handleRegisterVolunteerFromExplorer = (_ngoId: number, ngoName: string) => {
    const fullName = prompt('Ingresa tu Nombre Completo para postularte:');
    if (!fullName) return;
    const email = prompt('Ingresa tu Correo Electrónico:');
    if (!email) return;
    const phone = prompt('Ingresa tu Teléfono (mínimo 7 números):');
    if (!phone) return;

    handleAddVolunteer({
      fullName,
      email,
      phone,
      skills: `Postulación ONG: ${ngoName}`,
      status: 'Pendiente'
    });
  };

  return (
    <MainLayout activeView={activeView} setActiveView={setActiveView}>
      <main className="main-content">
        
        {/* Main Stats Reusable Web Part */}
        <StatsWebPart 
          ngoCount={ngos.length} 
          volunteerCount={volunteers.length} 
          projectCount={projects.length} 
        />

        {/* View Router (User vs Admin) */}
        {activeView === 'explorer' ? (
          <NgoExplorerView 
            ngos={ngos}

            onRegisterVolunteer={handleRegisterVolunteerFromExplorer}
          />
        ) : (
          <AdminLayout 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            onBackToExplorer={() => setActiveView('explorer')}
          >
            <AdminManagementView 
              ngos={ngos}
              volunteers={volunteers}
              projects={projects}
              activeTab={activeTab}
              onAddNgo={handleAddNgo}
              onEditNgo={handleEditNgo}
              onDeleteNgo={handleDeleteNgo}
              onAddVolunteer={handleAddVolunteer}
              onEditVolunteer={handleEditVolunteer}
              onDeleteVolunteer={handleDeleteVolunteer}
              onAddProject={handleAddProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}

            />
          </AdminLayout>
        )}

        {/* Console & Notifications Web Part */}
        <ActivityWebPart activities={activities} />
      </main>
    </MainLayout>
  );
}

export default App;
