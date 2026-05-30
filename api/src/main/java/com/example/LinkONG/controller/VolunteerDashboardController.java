package com.example.LinkONG.controller;

import com.example.LinkONG.model.Activity;
import com.example.LinkONG.model.ActivityAttendance;
import com.example.LinkONG.model.SocialProject;
import com.example.LinkONG.model.Volunteer;
import com.example.LinkONG.service.ActivityService;
import com.example.LinkONG.service.ProjectService;
import com.example.LinkONG.service.VolunteerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/voluntario")
public class VolunteerDashboardController {

    private final ProjectService projectService;
    private final ActivityService activityService;
    private final VolunteerService volunteerService;

    @Autowired
    public VolunteerDashboardController(ProjectService projectService,
                                        ActivityService activityService,
                                        VolunteerService volunteerService) {
        this.projectService = projectService;
        this.activityService = activityService;
        this.volunteerService = volunteerService;
    }

    @GetMapping("/proyectos/disponibles")
    public ResponseEntity<List<SocialProject>> getProyectosDisponibles(
            @RequestParam(required = false) String localidad) {
        
        List<SocialProject> projects = projectService.getProyectosDisponibles(localidad);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/proyectos/{idProyecto}/actividades-abiertas")
    public ResponseEntity<List<Activity>> getActividadesAbiertas(@PathVariable UUID idProyecto) {
        List<Activity> activities = activityService.getActividadesAbiertas(idProyecto);
        return ResponseEntity.ok(activities);
    }

    @PostMapping("/actividades/{idActividad}/postular")
    public ResponseEntity<ActivityAttendance> postularActividad(
            @PathVariable UUID idActividad,
            @RequestHeader(name = "X-Volunteer-Id", required = true) UUID idVoluntario) {
        
        ActivityAttendance attendance = activityService.postularVoluntario(idActividad, idVoluntario);
        return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
    }

    @GetMapping("/perfil/resumen-horas")
    public ResponseEntity<Map<String, Object>> getResumenHoras(
            @RequestHeader(name = "X-Volunteer-Id", required = true) UUID idVoluntario) {
        
        return ResponseEntity.ok(activityService.getResumenHorasPerfil(idVoluntario));
    }

    @GetMapping("/perfil/actividad-reciente")
    public ResponseEntity<List<Map<String, Object>>> getActividadReciente(
            @RequestHeader(name = "X-Volunteer-Id", required = true) UUID idVoluntario) {
        
        return ResponseEntity.ok(activityService.getActividadRecientePerfil(idVoluntario));
    }

    @PutMapping("/perfil")
    public ResponseEntity<Volunteer> updatePerfil(
            @RequestHeader(name = "X-Volunteer-Id", required = true) UUID idVoluntario,
            @Valid @RequestBody Volunteer profileDetails) {
        
        Volunteer updated = volunteerService.updateVolunteerProfile(idVoluntario, profileDetails);
        return ResponseEntity.ok(updated);
    }
}
