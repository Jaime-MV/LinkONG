/* LinkONG Volunteer Dashboard Services */
import { request, getMockTable, saveMockTable, generateUUID } from './api';
import type { SocialProject, Volunteer } from './adminService';
import type { Activity } from './coordinatorService';

export interface VolunteerProfileUpdate {
  nombreCompleto: string;
  telefono: string;
  habilidadesTecnicas: string[];
  tallaCamiseta: 'S' | 'M' | 'L' | 'XL';
}

export interface ActivityRecentItem {
  idActividad: string;
  tituloActividad: string;
  nombreCampana: string;
  fecha: string;
  horasTrabajadas?: number;
  rol?: string;
  asistio: boolean;
  estado: 'Pendiente' | 'Asistido' | 'No Asistió';
}

export const volunteerService = {
  getAvailableProjects: async (localidad?: string): Promise<SocialProject[]> => {
    return request('GET', `/voluntario/proyectos/disponibles?localidad=${localidad || ''}`, undefined, () => {
      const projects = getMockTable('proyectos');
      if (localidad) {
        return projects.filter((p) => p.localidadBeneficiada.toLowerCase().includes(localidad.toLowerCase()));
      }
      return projects;
    });
  },

  getOpenActivitiesByProject: async (projectId: string): Promise<Activity[]> => {
    return request('GET', `/voluntario/proyectos/${projectId}/actividades-abiertas`, undefined, () => {
      const activities = getMockTable('actividades').filter((a) => a.idProyecto === projectId);
      // Filter out canceled or already completed (Ejecutada) activities
      return activities.filter((a) => a.estado !== 'Cancelada' && a.estado !== 'Ejecutada');
    });
  },

  applyToActivity: async (activityId: string, volunteerId: string, rol: string): Promise<void> => {
    return request('POST', `/voluntario/actividades/${activityId}/postular`, { volunteerId, rol }, () => {
      const assistances = getMockTable('asistencias');
      
      // Check if already signed up to prevent duplicates (matches unique constraint in DER.MD)
      const exists = assistances.some(
        (a) => a.idActividad === activityId && a.idVoluntario === volunteerId
      );
      if (exists) throw new Error('Ya estás postulado a esta actividad.');

      assistances.push({
        id: generateUUID(),
        idVoluntario: volunteerId,
        idActividad: activityId,
        horasTrabajadas: 0.0,
        rolEnActividad: rol || 'Voluntario General',
        asistio: false
      });
      saveMockTable('asistencias', assistances);
    });
  },

  getHoursSummary: async (volunteerId: string): Promise<{ totalHoras: number; actividadesParticipadas: number }> => {
    return request('GET', `/voluntario/perfil/resumen-horas`, undefined, () => {
      const assistances = getMockTable('asistencias').filter(
        (a) => a.idVoluntario === volunteerId && a.asistio === true
      );

      const totalHoras = assistances.reduce((sum, a) => sum + Number(a.horasTrabajadas || 0), 0);
      return {
        totalHoras,
        actividadesParticipadas: assistances.length
      };
    });
  },

  getRecentActivity: async (volunteerId: string): Promise<ActivityRecentItem[]> => {
    return request('GET', `/voluntario/perfil/actividad-reciente`, undefined, () => {
      const assistances = getMockTable('asistencias').filter((a) => a.idVoluntario === volunteerId);
      const activities = getMockTable('actividades');
      const projects = getMockTable('proyectos');

      return assistances.map((asist) => {
        const act = activities.find((a) => a.id === asist.idActividad);
        const proj = act ? projects.find((p) => p.id === act.idProyecto) : null;
        
        let estado: 'Pendiente' | 'Asistido' | 'No Asistió' = 'Pendiente';
        if (act?.estado === 'Ejecutada') {
          estado = asist.asistio ? 'Asistido' : 'No Asistió';
        }

        return {
          idActividad: asist.idActividad,
          tituloActividad: act ? act.tituloActividad : 'Actividad Especial',
          nombreCampana: proj ? proj.nombreCampana : 'LinkONG General',
          fecha: act ? act.fechaEjecucion : new Date().toISOString(),
          horasTrabajadas: asist.horasTrabajadas,
          rol: asist.rolEnActividad,
          asistio: asist.asistio,
          estado
        };
      }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    });
  },

  getProfile: async (volunteerId: string): Promise<Volunteer> => {
    return request('GET', `/voluntario/perfil`, undefined, () => {
      const volunteers = getMockTable('voluntarios');
      const vol = volunteers.find((v) => v.id === volunteerId);
      if (!vol) throw new Error('Voluntario no encontrado');
      return vol;
    });
  },

  updateProfile: async (volunteerId: string, update: VolunteerProfileUpdate): Promise<Volunteer> => {
    return request('PUT', `/voluntario/perfil`, update, () => {
      const volunteers = getMockTable('voluntarios');
      const index = volunteers.findIndex((v) => v.id === volunteerId);
      if (index === -1) throw new Error('Voluntario no encontrado');
      
      volunteers[index] = {
        ...volunteers[index],
        nombreCompleto: update.nombreCompleto,
        telefono: update.telefono,
        habilidadesTecnicas: update.habilidadesTecnicas,
        tallaCamiseta: update.tallaCamiseta
      };
      
      saveMockTable('voluntarios', volunteers);
      return volunteers[index];
    });
  }
};
