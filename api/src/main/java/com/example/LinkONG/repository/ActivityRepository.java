package com.example.LinkONG.repository;

import com.example.LinkONG.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    
    // Obtener actividades por proyecto
    List<Activity> findByIdProyecto(UUID idProyecto);

    // Obtener actividades con cupos disponibles para un proyecto
    // Compara los cupos requeridos contra el conteo de asistencias registradas
    @Query("SELECT a FROM Activity a WHERE a.idProyecto = :idProyecto AND " +
            "a.cuposVoluntariosRequeridos > (SELECT COUNT(aa) FROM ActivityAttendance aa WHERE aa.idActividad = a.idActividad)")
    List<Activity> findActividadesAbiertasPorProyecto(@Param("idProyecto") UUID idProyecto);

    // Buscar actividades del coordinador responsable con alertas operativas (cupos llenos < 50% de lo requerido)
    // O actividades que son en los próximos 3 días y les faltan voluntarios
    @Query(value = "SELECT a.* FROM actividades a " +
            "JOIN proyectos_sociales p ON a.id_proyecto = p.id_proyecto " +
            "WHERE p.id_coordinador_responsable = :idCoordinador AND " +
            "a.cupos_voluntarios_requeridos > (SELECT COUNT(*) FROM asistencia_actividades aa WHERE aa.id_actividad = a.id_actividad)", 
            nativeQuery = true)
    List<Activity> findAlertasOperativasByCoordinador(@Param("idCoordinador") UUID idCoordinador);
}
