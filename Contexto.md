1. Dashboard del Administrador (Staff / Finanzas)
Enfoque: Control macro de la fundación, salud financiera, aprobación de proyectos y rendición de cuentas.

Módulos Visibles en este Dashboard:
Módulo de Control Financiero: Formularios para registrar ingresos (Donaciones monetarias/especie) y egresos (Gastos de proyectos con número de factura).

Módulo de Gestión de Proyectos: Creación y edición de campañas habitacionales (Asignación de presupuestos, localidades y designación del Coordinador responsable).

Módulo de Gestión de Voluntarios: Buscador avanzado de voluntarios para cambiar sus estados (ej. pasar de "En Inducción" a "Activo") o dar de baja lógica.

🧩 Web Parts Reutilizables incluidos (Requisito 3.3):
Web Part: Panel de Estadísticas Financieras (KPIs): Tarjetas con el total recaudado en el mes, total ejecutado en gastos y balance global de la fundación.

Web Part: Gráfico de Distribución de Recursos: Un gráfico (barra o pastel) que muestra visualmente cuánto dinero se ha destinado a cada proyecto activo.

👷‍♂️ 2. Dashboard del Coordinador (Líder de Campo)
Enfoque: Gestión operativa, control de las jornadas de construcción del fin de semana y asignación de tareas.

Módulos Visibles en este Dashboard:
Módulo de Mis Proyectos Asignados: Vista detallada únicamente de las campañas que este coordinador tiene a cargo.

Módulo de Planificación de Actividades: Crear, editar o cancelar jornadas específicas (ej: "Jornada de Techado", "Descarga de Cemento").

Módulo de Control de Asistencia (Trazabilidad): Pantalla interactiva que aparece al finalizar una actividad para marcar true/false en asistencia y cargar las horas_trabajadas a cada voluntario postulado.

🧩 Web Parts Reutilizables incluidos:
Web Part: Estado de Convocatoria (Cupos): Barra de progreso que muestra cuántos voluntarios se han postulado frente a los cupos requeridos para la próxima actividad (ej: 18 de 30 voluntarios anotados).

Web Part: Panel de Alertas Operativas: Lista de notificaciones urgentes (ej: "Actividad de mañana no cuenta con encargado de Primeros Auxilios").

🙋‍♂️ 3. Dashboard del Voluntario (Portal del Usuario Final)
Enfoque: Autogestión, postulación simple a actividades y reconocimiento de su impacto.

Módulos Visibles en este Dashboard:
Módulo de Cartelera Social: Vista de todos los proyectos activos en la ONG con opción de buscar por localidad (ej: filtrar proyectos en "Santa Ana Centro").

Módulo de Inscripción a Jornadas: Calendario interactivo con las actividades del mes donde el voluntario puede hacer clic en "Postularse" si cumple con la disponibilidad.

Módulo de Historial de Servicio: Espacio personal donde ve en qué actividades participó en el pasado, qué roles desempeñó y el desglose de su apoyo.

🧩 Web Parts Reutilizables incluidos:
Web Part: Contador de Horas Logradas: Un widget circular dinámico que muestra al voluntario cuántas horas acumuladas lleva en el año (incentiva la participación).

Web Part: Actividad Reciente del Perfil: Línea de tiempo que muestra sus próximos eventos confirmados y las últimas asistencias validadas por los coordinadores.

💡 Resumen de Arquitectura en la Presentación (ASP.NET Web Forms)
Para llevar esto al código de forma limpia, puedes estructurarlo mediante carpetas en tu proyecto de Presentación:

/Account/Login.aspx (Pantalla de inicio de sesión común).

/Admin/Dashboard.aspx (Usa la Admin.Master y carga los Web Parts financieros).

/Coordinador/Dashboard.aspx (Usa la Admin.Master y carga los Web Parts de control de campo).

/Voluntario/Dashboard.aspx (Usa la Site.Master principal y carga los Web Parts de horas y postulaciones).

Cuando el usuario inicia sesión, tu código en el Backend (C#) lee el rol que viene en el JSON de la Web API y hace un Response.Redirect() a la carpeta que le corresponde. De esta manera, garantizas que nadie entre a un dashboard que no le pertenece.


1. Endpoints para el Dashboard del AdministradorEste conjunto de endpoints permite al administrador gestionar las finanzas globales, aprobar la creación de proyectos a nivel institucional y auditar las cuentas de la ONG.💰 Módulo de Control FinancieroGET /api/v1/admin/finanzas/resumenPropósito: Alimenta el Web Part de Estadísticas Financieras (KPIs) con los totales de ingresos, egresos y balance del mes actual.GET /api/v1/admin/finanzas/grafico-distribucionPropósito: Retorna los datos estructurados para el Web Part del Gráfico de Distribución de Recursos (monto invertido por proyecto).POST /api/v1/admin/donacionesPropósito: Envía el formulario de registro de una nueva donación (monetaria o en especie) asignada a un proyecto.POST /api/v1/admin/gastosPropósito: Envía el formulario de registro de un egreso (compra de materiales, herramientas, etc.) adjuntando el número de factura.🏠 Módulo de Gestión de Proyectos (CRUD Institucional)POST /api/v1/admin/proyectosPropósito: Crea oficialmente una nueva campaña habitacional en el sistema (Ej: "Comunidad El Espino").PUT /api/v1/admin/proyectos/:idPropósito: Permite al administrador editar el presupuesto asignado, cambiar las fechas límite o cambiar al Coordinador responsable del proyecto.DELETE /api/v1/admin/proyectos/:idPropósito: Eliminación del proyecto (la base de datos validará que no tenga transacciones previas para no romper la contabilidad).👥 Módulo de Gestión de VoluntariosGET /api/v1/admin/voluntarios/busqueda?estado=&habilidad=Propósito: Alimenta la tabla de búsqueda dinámica del administrador para filtrar voluntarios globales.PATCH /api/v1/admin/voluntarios/:id/estadoPropósito: Cambia rápidamente el estado de un voluntario (ej. aprobarlo de "En Inducción" a "Activo" tras recibir la capacitación de seguridad).👷‍♂️ 2. Endpoints para el Dashboard del CoordinadorEstas rutas están optimizadas para el líder de campo. Solo retornan información de las campañas bajo su estricta responsabilidad y se enfocan en la logística de las jornadas.📋 Módulo de Mis Proyectos AsignadosGET /api/v1/coordinador/mis-proyectosPropósito: Retorna la lista de proyectos asignados al ID del coordinador autenticado para llenar su pantalla de inicio.GET /api/v1/coordinador/proyectos/:idProyecto/balance-localPropósito: Permite al coordinador ver la relación de $\text{Donaciones} - \text{Gastos}$ únicamente de su frente de trabajo para saber si le queda presupuesto para comprar insumos.🔨 Módulo de Planificación de Actividades (CRUD Operativo)POST /api/v1/coordinador/proyectos/:idProyecto/actividadesPropósito: Registra una nueva jornada de campo en el calendario (Ej: "Jornada de Techado").PUT /api/v1/coordinador/actividades/:idPropósito: Modifica los detalles de una actividad o cambia los cupos de voluntarios requeridos.DELETE /api/v1/coordinador/actividades/:idPropósito: Cancela una actividad si las condiciones del clima o la logística de materiales fallan.📝 Módulo de Control de Asistencia y Alertas (Trazabilidad)GET /api/v1/coordinador/actividades/proximas/alertasPropósito: Alimenta el Web Part de Alertas Operativas (alertas de falta de cupos o perfiles clave).GET /api/v1/coordinador/actividades/:idActividad/postuladosPropósito: Alimenta el Web Part de Estado de Convocatoria mostrando la lista y barra de progreso de los voluntarios anotados (18 de 30).POST /api/v1/coordinador/actividades/:idActividad/asistenciaPropósito: Cierre de Jornada: Envía el arreglo de datos JSON con las asistencias confirmadas (true/false) y las horas acreditadas a cada participante.🙋‍♂️ 3. Endpoints para el Dashboard del VoluntarioRutas de lectura y autogestión diseñadas para el usuario final. Cuentan con seguridad perimetral para asegurar que un voluntario no pueda consultar ni modificar los datos de otro.🗺️ Módulo de Cartelera Social y BúsquedaGET /api/v1/voluntario/proyectos/disponibles?localidad=Propósito: Alimenta la vista principal del voluntario con las campañas de la fundación, permitiéndole filtrar de forma dinámica por cercanía geográfica.📅 Módulo de Inscripción a Jornadas (Postulaciones)GET /api/v1/voluntario/proyectos/:idProyecto/actividades-abiertasPropósito: Despliega en el calendario del voluntario las sub-actividades de un proyecto que aún tienen cupos disponibles.POST /api/v1/voluntario/actividades/:idActividad/postularPropósito: El botón del portal que vincula al voluntario con la actividad (id_voluntario extraído de su token de sesión).🎖️ Módulo de Historial de Servicio e ImpactoGET /api/v1/voluntario/perfil/resumen-horasPropósito: Alimenta el Web Part del Contador de Horas Logradas (calcula la sumatoria de horas validadas en sus asistencias).GET /api/v1/voluntario/perfil/actividad-recientePropósito: Alimenta el Web Part de Actividad Reciente del perfil (línea de tiempo con sus próximas construcciones confirmadas e historial pasado).PUT /api/v1/voluntario/perfilPropósito: Permite al voluntario actualizar directamente sus datos personales (cambio de teléfono, nuevas habilidades constructivas, o modificación de su talla de camiseta).