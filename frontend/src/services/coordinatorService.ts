/* LinkONG Coordinator Dashboard Services */
import { request, getMockTable, saveMockTable, generateUUID } from './api';
import type { SocialProject } from './adminService';

export interface Activity {
  id?: string;
  idProyecto: string;
  tituloActividad: string;
  descripcionDetalle?: string;
  fechaEjecucion: string;
  cuposVoluntariosRequeridos: number;
  estado?: 'Programada' | 'Confirmada' | 'Ejecutada' | 'Cancelada';
}

export interface AttendanceRecord {
  idVoluntario: string;
  nombreVoluntario: string;
  asistio: boolean;
  horasTrabajadas: number;
  rolEnActividad: string;
}

export const coordinatorService = {
  getProjectsByCoordinator: async (coordinatorId: string): Promise<SocialProject[]> => {
    return request('GET', `/coordinador/mis-proyectos`, undefined, () => {
      const projects = getMockTable('proyectos');
      return projects.filter((p) => p.idCoordinadorResponsable === coordinatorId);
    });
  },

  getLocalBalance: async (projectId: string): Promise<{ donaciones: number; gastos: number; balance: number }> => {
    return request('GET', `/coordinador/proyectos/${projectId}/balance-local`, undefined, () => {
      const donations = getMockTable('donaciones').filter((d) => d.idProyectoDestino === projectId);
      const expenses = getMockTable('gastos').filter((e) => e.idProyecto === projectId);

      const totalDonations = donations.reduce((sum, d) => sum + Number(d.montoDinero || 0), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.montoGastado || 0), 0);

      return {
        donaciones: totalDonations,
        gastos: totalExpenses,
        balance: totalDonations - totalExpenses
      };
    });
  },

  createActivity: async (activity: Activity): Promise<Activity> => {
    return request('POST', `/coordinador/proyectos/${activity.idProyecto}/actividades`, activity, () => {
      const activities = getMockTable('actividades');
      const newActivity = {
        ...activity,
        id: generateUUID(),
        estado: 'Programada' as const
      };
      activities.push(newActivity);
      saveMockTable('actividades', activities);
      return newActivity;
    });
  },

  updateActivity: async (id: string, activity: Activity): Promise<Activity> => {
    return request('PUT', `/coordinador/actividades/${id}`, activity, () => {
      const activities = getMockTable('actividades');
      const index = activities.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Actividad no encontrada');
      activities[index] = { ...activities[index], ...activity };
      saveMockTable('actividades', activities);
      return activities[index];
    });
  },

  deleteActivity: async (id: string): Promise<void> => {
    return request('DELETE', `/coordinador/actividades/${id}`, undefined, () => {
      const activities = getMockTable('actividades');
      const filtered = activities.filter((a) => a.id !== id);
      saveMockTable('actividades', filtered);
    });
  },

  getAlerts: async (): Promise<string[]> => {
    return request('GET', `/coordinador/actividades/proximas/alertas`, undefined, () => {
      const activities = getMockTable('actividades');
      const assistances = getMockTable('asistencias');
      const alerts: string[] = [];

      activities.forEach((act) => {
        const signupsCount = assistances.filter((a) => a.idActividad === act.id).length;
        if (signupsCount < act.cuposVoluntariosRequeridos * 0.5) {
          alerts.push(`Alerta de Convocatoria: "${act.tituloActividad}" tiene baja inscripción (${signupsCount}/${act.cuposVoluntariosRequeridos} cupos).`);
        }
      });

      // General logistic warning
      alerts.push('Alerta de Logística: Actividad planeada para este sábado requiere revisión de stock de herramientas.');

      return alerts;
    });
  },

  getApplicants: async (activityId: string): Promise<AttendanceRecord[]> => {
    return request('GET', `/coordinador/actividades/${activityId}/postulados`, undefined, () => {
      const assistances = getMockTable('asistencias').filter((a) => a.idActividad === activityId);
      const volunteers = getMockTable('voluntarios');

      return assistances.map((asist) => {
        const vol = volunteers.find((v) => v.id === asist.idVoluntario);
        return {
          idVoluntario: asist.idVoluntario,
          nombreVoluntario: vol ? vol.nombreCompleto : 'Voluntario Desconocido',
          asistio: asist.asistio || false,
          horasTrabajadas: asist.horasTrabajadas || 0.0,
          rolEnActividad: asist.rolEnActividad || 'Ayudante General'
        };
      });
    });
  },

  saveAttendance: async (activityId: string, records: AttendanceRecord[]): Promise<void> => {
    return request('POST', `/coordinador/actividades/${activityId}/asistencia`, records, () => {
      // 1. Update the bridge table 'lk_asistencias'
      const assistances = getMockTable('asistencias');
      
      // 2. Loop through records
      records.forEach((record) => {
        const index = assistances.findIndex(
          (a) => a.idActividad === activityId && a.idVoluntario === record.idVoluntario
        );
        
        if (index !== -1) {
          assistances[index].asistio = record.asistio;
          assistances[index].horasTrabajadas = record.horasTrabajadas;
          assistances[index].rolEnActividad = record.rolEnActividad;
        } else {
          // If not found (e.g. dynamic insert), create it
          assistances.push({
            id: generateUUID(),
            idVoluntario: record.idVoluntario,
            idActividad: activityId,
            horasTrabajadas: record.horasTrabajadas,
            rolEnActividad: record.rolEnActividad,
            asistio: record.asistio
          });
        }
      });
      saveMockTable('asistencias', assistances);

      // 3. Mark the activity itself as 'Ejecutada' (completed) if any attendance is logged
      const activities = getMockTable('actividades');
      const actIndex = activities.findIndex((a) => a.id === activityId);
      if (actIndex !== -1) {
        activities[actIndex].estado = 'Ejecutada';
        saveMockTable('actividades', activities);
      }
    });
  }
};
