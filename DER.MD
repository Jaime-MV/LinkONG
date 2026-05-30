-- Habilitar la extensión para generar UUID automáticamente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 0. CREACIÓN DE TIPOS ENUM (CATÁLOGOS)
-- ==========================================

CREATE TYPE estado_voluntario AS ENUM ('Activo', 'Inactivo', 'En Inducción');
CREATE TYPE talla_prenda AS ENUM ('S', 'M', 'L', 'XL');
CREATE TYPE estado_proyecto AS ENUM ('En Diagnóstico', 'En Recaudación', 'En Ejecución', 'Finalizado');
CREATE TYPE tipo_donacion AS ENUM ('MONETARIO', 'ESPECIE');
CREATE TYPE categoria_gasto AS ENUM ('Materiales de Construcción', 'Transporte de Voluntarios', 'Alimentación/Hidratación', 'Herramientas');

-- ==========================================
-- 1. MÓDULO DE GESTIÓN HUMANA
-- ==========================================

CREATE TABLE voluntarios (
    id_voluntario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_completo VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    habilidades_tecnicas TEXT[] NOT NULL, -- Uso de Array de PostgreSQL
    talla_camiseta talla_prenda NOT NULL,
    estado_voluntario estado_voluntario DEFAULT 'En Inducción',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. MÓDULO DE OPERACIÓN SOCIAL (PROYECTOS)
-- ==========================================

-- Tabla auxiliar simulada para el Staff/Coordinadores de la ONG
CREATE TABLE coordinadores (
    id_coordinador UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE proyectos_sociales (
    id_proyecto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_campana VARCHAR(200) NOT NULL,
    descripcion_objetivo TEXT NOT NULL,
    localidad_beneficiada VARCHAR(150) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin_estimada DATE NOT NULL,
    id_coordinador_responsable UUID NOT NULL,
    estado_proyecto estado_proyecto DEFAULT 'En Diagnóstico',
    CONSTRAINT fk_proyecto_coordinador FOREIGN KEY (id_coordinador_responsable) 
        REFERENCES coordinadores(id_coordinador) ON DELETE RESTRICT,
    CONSTRAINT chk_fechas CHECK (fecha_fin_estimada >= fecha_inicio)
);

CREATE TABLE actividades (
    id_actividad UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_proyecto UUID NOT NULL,
    titulo_actividad VARCHAR(150) NOT NULL,
    descripcion_detalle TEXT,
    fecha_ejecucion TIMESTAMP NOT NULL,
    cupos_voluntarios_requeridos INT NOT NULL CHECK (cupos_voluntarios_requeridos > 0),
    CONSTRAINT fk_actividad_proyecto FOREIGN KEY (id_proyecto) 
        REFERENCES proyectos_sociales(id_proyecto) ON DELETE CASCADE
);

-- TABLA PUENTE: Trazabilidad de asistencia y horas
CREATE TABLE asistencia_actividades (
    id_asistencia UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_voluntario UUID NOT NULL,
    id_actividad UUID NOT NULL,
    horas_trabajadas NUMERIC(4,2) DEFAULT 0.00 CHECK (horas_trabajadas >= 0),
    rol_en_actividad VARCHAR(100) NOT NULL,
    asistio BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_asistencia_voluntario FOREIGN KEY (id_voluntario) 
        REFERENCES voluntarios(id_voluntario) ON DELETE CASCADE,
    CONSTRAINT fk_asistencia_actividad FOREIGN KEY (id_actividad) 
        REFERENCES actividades(id_actividad) ON DELETE CASCADE,
    CONSTRAINT uq_voluntario_actividad UNIQUE (id_voluntario, id_actividad) -- Evita duplicar al mismo voluntario en la misma actividad
);

-- ==========================================
-- 3. MÓDULO DE FINANZAS Y TRANSPARENCIA
-- ==========================================

CREATE TABLE donaciones (
    id_donacion UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_donante VARCHAR(150) DEFAULT 'Anónimo',
    correo_donante VARCHAR(100) NOT NULL, -- Crucial para la API REST de consulta de impacto
    tipo_aporte tipo_donacion NOT NULL,
    monto_dinero NUMERIC(10,2) DEFAULT 0.00 CHECK (monto_dinero >= 0),
    descripcion_especie TEXT, -- Se llena si el tipo es ESPECIE
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_proyecto_destino UUID NOT NULL,
    CONSTRAINT fk_donacion_proyecto FOREIGN KEY (id_proyecto_destino) 
        REFERENCES proyectos_sociales(id_proyecto) ON DELETE RESTRICT
);

CREATE TABLE gastos_proyectos (
    id_gasto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_proyecto UUID NOT NULL,
    monto_gastado NUMERIC(10,2) NOT NULL CHECK (monto_gastado > 0),
    categoria_gasto categoria_gasto NOT NULL,
    descripcion_detalle VARCHAR(255) NOT NULL,
    fecha_gasto DATE DEFAULT CURRENT_DATE,
    numero_factura_comprobante VARCHAR(100) NOT NULL,
    CONSTRAINT fk_gasto_proyecto FOREIGN KEY (id_proyecto) 
        REFERENCES proyectos_sociales(id_proyecto) ON DELETE RESTRICT
);

-- ==========================================
-- BONUS: INDEXACIÓN PARA OPTIMIZAR LA API
-- ==========================================

-- Indice para acelerar la consulta de impacto de los donantes externos en la API REST
CREATE INDEX idx_donaciones_correo ON donaciones(correo_donante);

-- Indice para acelerar los reportes de horas por voluntario
CREATE INDEX idx_asistencia_voluntario ON asistencia_actividades(id_voluntario);

Credenciales Render Database:
Hostname: dpg-d8dgdc6rnols739b4tpg-a
Port: 5432
Database: linkong
Username: linkong_user
Password: PAwAAWQbSjaaOyV2Pbz07AfphJ03hfpW
Internal Url: postgresql://linkong_user:PAwAAWQbSjaaOyV2Pbz07AfphJ03hfpW@dpg-d8dgdc6rnols739b4tpg-a/linkong
External Url: postgresql://linkong_user:PAwAAWQbSjaaOyV2Pbz07AfphJ03hfpW@dpg-d8dgdc6rnols739b4tpg-a.ohio-postgres.render.com/linkong