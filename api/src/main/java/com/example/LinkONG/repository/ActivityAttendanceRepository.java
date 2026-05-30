package com.example.LinkONG.repository;

import com.example.LinkONG.model.ActivityAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActivityAttendanceRepository extends JpaRepository<ActivityAttendance, UUID> {
    
    // Obtener todas las postulaciones o asistencias por actividad
    List<ActivityAttendance> findByIdActividad(UUID idActividad);

    // Obtener el registro de asistencia específico de un voluntario en una actividad
    Optional<ActivityAttendance> findByIdVoluntarioAndIdActividad(UUID idVoluntario, UUID idActividad);

    // Obtener todo el historial de asistencias de un voluntario
    List<ActivityAttendance> findByIdVoluntario(UUID idVoluntario);
}
