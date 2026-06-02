/* LinkONG Unified API Client and Persistence Engine */

const API_BASE = '/api/v1';

// Seed UUID Helper (standard RFC4122 v4)
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ----------------------------------------------------
// LOCALSTORAGE PERSISTENT DATABASE ENGINE (MOCK FALLBACK)
// ----------------------------------------------------

const SEED_COORDINADORS = [
  { id: 'c1111111-1111-1111-1111-111111111111', nombre: 'Jaime MV (Administrador)', correo: 'admin@linkong.org', rol: 'Admin' },
  { id: 'c2222222-2222-2222-2222-222222222222', nombre: 'Andrea Líder (Coordinadora Campo)', correo: 'coord@linkong.org', rol: 'Coordinador' }
];

const SEED_VOLUNTEERS = [
  {
    id: 'v1111111-1111-1111-1111-111111111111',
    nombreCompleto: 'Juan Pérez',
    correoElectronico: 'juan@gmail.com',
    telefono: '+503 7123-4567',
    fechaNacimiento: '1998-05-15',
    habilidadesTecnicas: ['Pintura', 'Carpintería Básica'],
    tallaCamiseta: 'M',
    estadoVoluntario: 'Activo',
    fechaRegistro: '2026-01-10T10:00:00Z'
  },
  {
    id: 'v2222222-2222-2222-2222-222222222222',
    nombreCompleto: 'María Gómez',
    correoElectronico: 'maria@gmail.com',
    telefono: '+503 6111-2222',
    fechaNacimiento: '2001-08-22',
    habilidadesTecnicas: ['Primeros Auxilios', 'Trabajo en Altura'],
    tallaCamiseta: 'S',
    estadoVoluntario: 'En Inducción',
    fechaRegistro: '2026-05-20T14:30:00Z'
  },
  {
    id: 'v3333333-3333-3333-3333-333333333333',
    nombreCompleto: 'Carlos Mendoza',
    correoElectronico: 'carlos@gmail.com',
    telefono: '+503 7555-9999',
    fechaNacimiento: '1995-12-02',
    habilidadesTecnicas: ['Electricidad', 'Albañilería'],
    tallaCamiseta: 'L',
    estadoVoluntario: 'Activo',
    fechaRegistro: '2026-03-05T09:15:00Z'
  }
];

const SEED_PROJECTS = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    nombreCampana: 'Campaña Habitacional Comunidad El Espino',
    descripcionObjetivo: 'Construcción de 12 viviendas de emergencia para familias en riesgo social de la localidad de El Espino.',
    localidadBeneficiada: 'Comunidad El Espino, San Salvador',
    fechaInicio: '2026-02-01',
    fechaFinEstimada: '2026-08-30',
    idCoordinadorResponsable: 'c2222222-2222-2222-2222-222222222222',
    estadoProyecto: 'En Ejecución'
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    nombreCampana: 'Proyecto Habitacional Santa Ana Centro',
    descripcionObjetivo: 'Reforzamiento estructural y reconstrucción de viviendas dañadas por temporales en el centro histórico de Santa Ana.',
    localidadBeneficiada: 'Santa Ana Centro',
    fechaInicio: '2026-04-15',
    fechaFinEstimada: '2026-11-15',
    idCoordinadorResponsable: 'c2222222-2222-2222-2222-222222222222',
    estadoProyecto: 'En Recaudación'
  }
];

const SEED_ACTIVITIES = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    idProyecto: 'p1111111-1111-1111-1111-111111111111',
    tituloActividad: 'Descarga y Acarreo de Madera',
    descripcionDetalle: 'Recepción del camión de materiales constructivos, conteo e inventario y traslado manual al predio de construcción.',
    fechaEjecucion: '2026-06-06T08:00:00Z',
    cuposVoluntariosRequeridos: 10,
    estado: 'Programada'
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    idProyecto: 'p1111111-1111-1111-1111-111111111111',
    tituloActividad: 'Armado de Estructura de Paneles',
    descripcionDetalle: 'Clavado de bastidores de madera y pre-ensamblado de paneles habitacionales en taller provisional.',
    fechaEjecucion: '2026-06-13T07:30:00Z',
    cuposVoluntariosRequeridos: 15,
    estado: 'Programada'
  }
];

const SEED_ASSISTANCES = [
  {
    id: 'as111111-1111-1111-1111-111111111111',
    idVoluntario: 'v1111111-1111-1111-1111-111111111111',
    idActividad: 'a1111111-1111-1111-1111-111111111111',
    horasTrabajadas: 8.0,
    rolEnActividad: 'Acarreador de Materiales',
    asistio: true
  },
  {
    id: 'as222222-2222-2222-2222-222222222222',
    idVoluntario: 'v3333333-3333-3333-3333-333333333333',
    idActividad: 'a1111111-1111-1111-1111-111111111111',
    horasTrabajadas: 6.5,
    rolEnActividad: 'Carpintero Auxiliar',
    asistio: true
  }
];

const SEED_DONATIONS = [
  { id: 'd1111111-1111-1111-1111-111111111111', nombreDonante: 'Banco Cuscatlán', correoDonante: 'contacto@cuscatlan.com', tipoAporte: 'MONETARIO', montoDinero: 12000.0, descripcionEspecie: '', fechaIngreso: '2026-02-10T11:00:00Z', idProyectoDestino: 'p1111111-1111-1111-1111-111111111111' },
  { id: 'd2222222-2222-2222-2222-222222222222', nombreDonante: 'Ferretería El Sol', correoDonante: 'contacto@elsol.com', tipoAporte: 'ESPECIE', montoDinero: 4500.0, descripcionEspecie: '100 sacos de cemento Portland gris', fechaIngreso: '2026-03-05T09:30:00Z', idProyectoDestino: 'p1111111-1111-1111-1111-111111111111' },
  { id: 'd3333333-3333-3333-3333-333333333333', nombreDonante: 'Fundación Sagrera', correoDonante: 'sagrera@fundacion.org', tipoAporte: 'MONETARIO', montoDinero: 8000.0, descripcionEspecie: '', fechaIngreso: '2026-04-20T16:00:00Z', idProyectoDestino: 'p2222222-2222-2222-2222-222222222222' }
];

const SEED_EXPENSES = [
  { id: 'e1111111-1111-1111-1111-111111111111', idProyecto: 'p1111111-1111-1111-1111-111111111111', montoGastado: 3500.0, categoriaGasto: 'Materiales de Construcción', descripcionDetalle: 'Compra de vigas, pilotes de madera y clavos galvanizados', fechaGasto: '2026-02-18', numeroFacturaComprobante: 'FAC-2026-0091' },
  { id: 'e2222222-2222-2222-2222-222222222222', idProyecto: 'p1111111-1111-1111-1111-111111111111', montoGastado: 450.0, categoriaGasto: 'Transporte de Voluntarios', descripcionDetalle: 'Alquiler de microbuses para traslado fin de semana', fechaGasto: '2026-03-01', numeroFacturaComprobante: 'FAC-2026-0105' },
  { id: 'e3333333-3333-3333-3333-333333333333', idProyecto: 'p1111111-1111-1111-1111-111111111111', montoGastado: 320.0, categoriaGasto: 'Alimentación/Hidratación', descripcionDetalle: 'Agua embotellada y refrigerios para 25 voluntarios', fechaGasto: '2026-03-02', numeroFacturaComprobante: 'FAC-2026-0112' }
];

// Initialize Storage if empty
const initializeMockDB = () => {
  if (!localStorage.getItem('lk_coordinadores')) {
    localStorage.setItem('lk_coordinadores', JSON.stringify(SEED_COORDINADORS));
    localStorage.setItem('lk_voluntarios', JSON.stringify(SEED_VOLUNTEERS));
    localStorage.setItem('lk_proyectos', JSON.stringify(SEED_PROJECTS));
    localStorage.setItem('lk_actividades', JSON.stringify(SEED_ACTIVITIES));
    localStorage.setItem('lk_asistencias', JSON.stringify(SEED_ASSISTANCES));
    localStorage.setItem('lk_donaciones', JSON.stringify(SEED_DONATIONS));
    localStorage.setItem('lk_gastos', JSON.stringify(SEED_EXPENSES));
  }
};
initializeMockDB();

// Mock DB getter/setters
export const getMockTable = (table: string): any[] => {
  return JSON.parse(localStorage.getItem(`lk_${table}`) || '[]');
};

export const saveMockTable = (table: string, data: any[]) => {
  localStorage.setItem(`lk_${table}`, JSON.stringify(data));
};

// ----------------------------------------------------
// DUAL MODE REQUEST DISPATCHER
// ----------------------------------------------------

export async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  body?: any,
  mockHandler?: () => T
): Promise<T> {
  // If backend is running, try connecting. If it fails, fall back to mock handler!
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('lk_token') || ''}`
      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${url}`, options);
    
    // Check if ok, else throw to fall back
    if (response.ok) {
      const text = await response.text();
      return text ? (JSON.parse(text) as T) : ({} as T);
    }
    
    throw new Error(`API returned status ${response.status}`);
  } catch (error) {
    console.warn(`[LinkONG API Engine] Real API failed or unavailable (${url}). Falling back to local storage engine.`, error);
    if (mockHandler) {
      // Simulate network delay for a real web application look-and-feel
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockHandler();
    }
    throw error;
  }
}
