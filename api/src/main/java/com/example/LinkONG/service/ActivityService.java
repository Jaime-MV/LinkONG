package com.example.LinkONG.service;

import com.example.LinkONG.model.Activity;
import com.example.LinkONG.model.ActivityAttendance;
import com.example.LinkONG.model.Volunteer;
import com.example.LinkONG.repository.ActivityAttendanceRepository;
import com.example.LinkONG.repository.ActivityRepository;
import com.example.LinkONG.repository.SocialProjectRepository;
import com.example.LinkONG.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final SocialProjectRepository socialProjectRepository;
    private final ActivityAttendanceRepository activityAttendanceRepository;
    private final VolunteerRepository volunteerRepository;

    @Autowired
    public ActivityService(ActivityRepository activityRepository,
                           SocialProjectRepository socialProjectRepository,
                           ActivityAttendanceRepository activityAttendanceRepository,
                           VolunteerRepository volunteerRepository) {
        this.activityRepository = activityRepository;
        this.socialProjectRepository = socialProjectRepository;
        this.activityAttendanceRepository = activityAttendanceRepository;
        this.volunteerRepository = volunteerRepository;
    }

    public List<Activity> getActividadesByProyecto(UUID idProyecto) {
        return activityRepository.findByIdProyecto(idProyecto);
    }

    @Transactional
    public Activity createActivity(UUID idProyecto, Activity activity) {
        if (!socialProjectRepository.existsById(idProyecto)) {
            throw new IllegalArgumentException("El proyecto asociado no existe");
        }
        activity.setIdProyecto(idProyecto);
        if (activity.getCuposVoluntariosRequeridos() == null || activity.getCuposVoluntariosRequeridos() <= 0) {
            throw new IllegalArgumentException("Los cupos de voluntarios deben ser mayores a cero");
        }
        if (activity.getFechaEjecucion() == null) {
            activity.setFechaEjecucion(LocalDateTime.now().plusDays(2));
        }
        if (activity.getEstado() == null) {
            activity.setEstado("Programada");
        } else {
            List<String> estadosValidos = Arrays.asList("Programada", "Confirmada", "Ejecutada", "Cancelada");
            if (!estadosValidos.contains(activity.getEstado())) {
                throw new IllegalArgumentException("Estado de actividad no válido. Estados válidos: " + estadosValidos);
            }
        }
        return activityRepository.save(activity);
    }

    @Transactional
    public Activity updateActivity(UUID id, Activity details) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Actividad no encontrada con ID: " + id));

        if (details.getCuposVoluntariosRequeridos() == null || details.getCuposVoluntariosRequeridos() <= 0) {
            throw new IllegalArgumentException("Los cupos de voluntarios deben ser mayores a cero");
        }

        if (details.getEstado() != null) {
            List<String> estadosValidos = Arrays.asList("Programada", "Confirmada", "Ejecutada", "Cancelada");
            if (!estadosValidos.contains(details.getEstado())) {
                throw new IllegalArgumentException("Estado de actividad no válido. Estados válidos: " + estadosValidos);
            }
            activity.setEstado(details.getEstado());
        }

        activity.setTituloActividad(details.getTituloActividad());
        activity.setDescripcionDetalle(details.getDescripcionDetalle());
        activity.setFechaEjecucion(details.getFechaEjecucion());
        activity.setCuposVoluntariosRequeridos(details.getCuposVoluntariosRequeridos());

        return activityRepository.save(activity);
    }

    @Transactional
    public void deleteActivity(UUID id) {
        if (!activityRepository.existsById(id)) {
            throw new IllegalArgumentException("Actividad no encontrada con ID: " + id);
        }
        activityRepository.deleteById(id);
    }

    public List<Activity> getAlertasOperativas(UUID idCoordinador) {
        return activityRepository.findAlertasOperativasByCoordinador(idCoordinador);
    }

    public Map<String, Object> getPostulados(UUID idActividad) {
        Activity activity = activityRepository.findById(idActividad)
                .orElseThrow(() -> new IllegalArgumentException("Actividad no encontrada"));

        List<ActivityAttendance> assistances = activityAttendanceRepository.findByIdActividad(idActividad);
        
        List<Map<String, Object>> postuladosList = new ArrayList<>();
        for (ActivityAttendance aa : assistances) {
            Map<String, Object> pMap = new HashMap<>();
            pMap.put("id_asistencia", aa.getIdAsistencia());
            pMap.put("id_voluntario", aa.getIdVoluntario());
            pMap.put("rol", aa.getRolEnActividad());
            pMap.put("asistio", aa.getAsistio());
            pMap.put("horas_acreditadas", aa.getHorasTrabajadas());

            volunteerRepository.findById(aa.getIdVoluntario()).ifPresent(v -> {
                pMap.put("nombre_voluntario", v.getNombreCompleto());
                pMap.put("correo_voluntario", v.getCorreoElectronico());
            });
            postuladosList.add(pMap);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("actividad_id", idActividad);
        response.put("titulo_actividad", activity.getTituloActividad());
        response.put("cupos_totales", activity.getCuposVoluntariosRequeridos());
        response.put("anotados_count", assistances.size());
        response.put("postulados", postuladosList);
        return response;
    }

    @Transactional
    public void confirmAsistencia(UUID idActividad, List<Map<String, Object>> asistencias) {
        if (!activityRepository.existsById(idActividad)) {
            throw new IllegalArgumentException("Actividad no encontrada");
        }

        for (Map<String, Object> a : asistencias) {
            UUID idVoluntario = UUID.fromString((String) a.get("id_voluntario"));
            Boolean asistio = (Boolean) a.get("asistio");
            Number horas = (Number) a.get("horas_trabajadas");
            String rol = (String) a.get("rol_en_actividad");

            BigDecimal horasBD = BigDecimal.valueOf(horas.doubleValue());
            if (horasBD.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Las horas trabajadas no pueden ser negativas");
            }

            ActivityAttendance aa = activityAttendanceRepository.findByIdVoluntarioAndIdActividad(idVoluntario, idActividad)
                    .orElseGet(() -> ActivityAttendance.builder()
                            .idVoluntario(idVoluntario)
                            .idActividad(idActividad)
                            .build());
            
            aa.setAsistio(asistio);
            aa.setHorasTrabajadas(horasBD);
            aa.setRolEnActividad(rol != null ? rol : "Voluntario");
            
            activityAttendanceRepository.save(aa);
        }
    }

    public List<Activity> getActividadesAbiertas(UUID idProyecto) {
        return activityRepository.findActividadesAbiertasPorProyecto(idProyecto);
    }

    @Transactional
    public ActivityAttendance postularVoluntario(UUID idActividad, UUID idVoluntario) {
        Volunteer volunteer = volunteerRepository.findById(idVoluntario)
                .orElseThrow(() -> new IllegalArgumentException("Voluntario no encontrado"));

        // Regla de Negocio: Solo voluntarios aprobados con estado 'Activo' pueden postularse a frentes de obra
        if (!"Activo".equalsIgnoreCase(volunteer.getEstadoVoluntario())) {
            throw new IllegalStateException("Para postularse a frentes de campo, debe ser un voluntario 'Activo' (capacitación de seguridad confirmada)");
        }

        Activity activity = activityRepository.findById(idActividad)
                .orElseThrow(() -> new IllegalArgumentException("Actividad no encontrada"));

        List<ActivityAttendance> currentPostulados = activityAttendanceRepository.findByIdActividad(idActividad);
        if (currentPostulados.size() >= activity.getCuposVoluntariosRequeridos()) {
            throw new IllegalStateException("Lo sentimos, no hay cupos libres para esta actividad");
        }

        Optional<ActivityAttendance> existing = activityAttendanceRepository.findByIdVoluntarioAndIdActividad(idVoluntario, idActividad);
        if (existing.isPresent()) {
            throw new IllegalStateException("Ya se encuentra postulado a esta actividad");
        }

        ActivityAttendance aa = ActivityAttendance.builder()
                .idVoluntario(idVoluntario)
                .idActividad(idActividad)
                .asistio(false)
                .horasTrabajadas(BigDecimal.ZERO)
                .rolEnActividad("Voluntario General")
                .build();

        return activityAttendanceRepository.save(aa);
    }

    public Map<String, Object> getResumenHorasPerfil(UUID idVoluntario) {
        List<ActivityAttendance> history = activityAttendanceRepository.findByIdVoluntario(idVoluntario);
        
        BigDecimal totalHoras = BigDecimal.ZERO;
        int asistenciasConfirmadas = 0;

        for (ActivityAttendance aa : history) {
            if (Boolean.TRUE.equals(aa.getAsistio())) {
                totalHoras = totalHoras.add(aa.getHorasTrabajadas());
                asistenciasConfirmadas++;
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("id_voluntario", idVoluntario);
        summary.put("horas_totales_validadas", totalHoras);
        summary.put("jornadas_completadas", asistenciasConfirmadas);
        summary.put("jornadas_totales_inscritas", history.size());
        return summary;
    }

    public List<Map<String, Object>> getActividadRecientePerfil(UUID idVoluntario) {
        List<ActivityAttendance> history = activityAttendanceRepository.findByIdVoluntario(idVoluntario);
        
        List<Map<String, Object>> timeline = new ArrayList<>();
        for (ActivityAttendance aa : history) {
            Map<String, Object> item = new HashMap<>();
            item.put("asistencia_id", aa.getIdAsistencia());
            item.put("asistio", aa.getAsistio());
            item.put("horas", aa.getHorasTrabajadas());
            item.put("rol", aa.getRolEnActividad());

            activityRepository.findById(aa.getIdActividad()).ifPresent(act -> {
                item.put("nombre_actividad", act.getTituloActividad());
                item.put("fecha_ejecucion", act.getFechaEjecucion());
                socialProjectRepository.findById(act.getIdProyecto()).ifPresent(proj -> 
                    item.put("nombre_proyecto", proj.getNombreCampana())
                );
            });

            timeline.add(item);
        }

        return timeline;
    }
}
