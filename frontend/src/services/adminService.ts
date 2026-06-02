/* LinkONG Admin Dashboard Services */
import { request, getMockTable, saveMockTable, generateUUID } from './api';

export interface Donation {
  id?: string;
  nombreDonante: string;
  correoDonante: string;
  tipoAporte: 'MONETARIO' | 'ESPECIE';
  montoDinero: number;
  descripcionEspecie?: string;
  fechaIngreso?: string;
  idProyectoDestino: string;
}

export interface Expense {
  id?: string;
  idProyecto: string;
  montoGastado: number;
  categoriaGasto: 'Materiales de Construcción' | 'Transporte de Voluntarios' | 'Alimentación/Hidratación' | 'Herramientas';
  descripcionDetalle: string;
  fechaGasto?: string;
  numeroFacturaComprobante: string;
}

export interface SocialProject {
  id?: string;
  nombreCampana: string;
  descripcionObjetivo: string;
  localidadBeneficiada: string;
  fechaInicio: string;
  fechaFinEstimada: string;
  idCoordinadorResponsable: string;
  estadoProyecto: 'En Diagnóstico' | 'En Recaudación' | 'En Ejecución' | 'Finalizado';
}

export interface Volunteer {
  id: string;
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  fechaNacimiento: string;
  habilidadesTecnicas: string[];
  tallaCamiseta: 'S' | 'M' | 'L' | 'XL';
  estadoVoluntario: 'Activo' | 'Inactivo' | 'En Inducción';
  fechaRegistro: string;
}

export const adminService = {
  // --- FINANCES ---
  getFinanceResumen: async (): Promise<{ totalIngresos: number; totalEgresos: number; balance: number }> => {
    return request('GET', '/admin/finanzas/resumen', undefined, () => {
      const donations = getMockTable('donaciones');
      const expenses = getMockTable('gastos');
      
      const totalIngresos = donations.reduce((sum, d) => sum + Number(d.montoDinero || 0), 0);
      const totalEgresos = expenses.reduce((sum, e) => sum + Number(e.montoGastado || 0), 0);
      
      return {
        totalIngresos,
        totalEgresos,
        balance: totalIngresos - totalEgresos
      };
    });
  },

  getDistributionChart: async (): Promise<Array<{ projectName: string; amount: number }>> => {
    return request('GET', '/admin/finanzas/grafico-distribucion', undefined, () => {
      const projects = getMockTable('proyectos');
      const expenses = getMockTable('gastos');

      return projects.map((p) => {
        const projectExpenses = expenses.filter((e) => e.idProyecto === p.id);
        const totalSpent = projectExpenses.reduce((sum, e) => sum + Number(e.montoGastado || 0), 0);
        return {
          projectName: p.nombreCampana.length > 20 ? p.nombreCampana.substring(0, 18) + '...' : p.nombreCampana,
          amount: totalSpent
        };
      });
    });
  },

  recordDonation: async (donation: Donation): Promise<Donation> => {
    return request('POST', '/admin/donaciones', donation, () => {
      const donations = getMockTable('donaciones');
      const newDonation = {
        ...donation,
        id: generateUUID(),
        fechaIngreso: new Date().toISOString()
      };
      donations.push(newDonation);
      saveMockTable('donaciones', donations);
      return newDonation;
    });
  },

  recordExpense: async (expense: Expense): Promise<Expense> => {
    return request('POST', '/admin/gastos', expense, () => {
      const expenses = getMockTable('gastos');
      const newExpense = {
        ...expense,
        id: generateUUID(),
        fechaGasto: new Date().toISOString().split('T')[0]
      };
      expenses.push(newExpense);
      saveMockTable('gastos', expenses);
      return newExpense;
    });
  },

  // --- PROJECTS ---
  getProjects: async (): Promise<SocialProject[]> => {
    return request('GET', '/admin/proyectos', undefined, () => {
      return getMockTable('proyectos');
    });
  },

  createProject: async (project: SocialProject): Promise<SocialProject> => {
    return request('POST', '/admin/proyectos', project, () => {
      const projects = getMockTable('proyectos');
      const newProject = {
        ...project,
        id: generateUUID()
      };
      projects.push(newProject);
      saveMockTable('proyectos', projects);
      return newProject;
    });
  },

  updateProject: async (id: string, project: SocialProject): Promise<SocialProject> => {
    return request('PUT', `/admin/proyectos/${id}`, project, () => {
      const projects = getMockTable('proyectos');
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Proyecto no encontrado');
      projects[index] = { ...projects[index], ...project };
      saveMockTable('proyectos', projects);
      return projects[index];
    });
  },

  deleteProject: async (id: string): Promise<void> => {
    return request('DELETE', `/admin/proyectos/${id}`, undefined, () => {
      const projects = getMockTable('proyectos');
      const filtered = projects.filter((p) => p.id !== id);
      saveMockTable('proyectos', filtered);
    });
  },

  // --- VOLUNTEERS ---
  searchVolunteers: async (estado?: string, habilidad?: string): Promise<Volunteer[]> => {
    return request('GET', `/admin/voluntarios/busqueda?estado=${estado || ''}&habilidad=${habilidad || ''}`, undefined, () => {
      let volunteers = getMockTable('voluntarios');
      if (estado) {
        volunteers = volunteers.filter((v) => v.estadoVoluntario === estado);
      }
      if (habilidad) {
        volunteers = volunteers.filter((v) => 
          v.habilidadesTecnicas.some((h: string) => h.toLowerCase().includes(habilidad.toLowerCase()))
        );
      }
      return volunteers;
    });
  },

  updateVolunteerStatus: async (id: string, estado: 'Activo' | 'Inactivo' | 'En Inducción'): Promise<Volunteer> => {
    return request('PATCH', `/admin/voluntarios/${id}/estado`, { estado }, () => {
      const volunteers = getMockTable('voluntarios');
      const index = volunteers.findIndex((v) => v.id === id);
      if (index === -1) throw new Error('Voluntario no encontrado');
      volunteers[index].estadoVoluntario = estado;
      saveMockTable('voluntarios', volunteers);
      return volunteers[index];
    });
  }
};
