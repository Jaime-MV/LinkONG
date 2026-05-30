package com.example.LinkONG.controller;

import com.example.LinkONG.model.Activity;
import com.example.LinkONG.model.SocialProject;
import com.example.LinkONG.service.ActivityService;
import com.example.LinkONG.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/coordinador")
public class CoordinatorDashboardController {

    private final ProjectService projectService;
    private final ActivityService activityService;

    @Autowired
    public CoordinatorDashboardController(ProjectService projectService, ActivityService activityService) {
        this.projectService = projectService;
        this.activityService = activityService;
    }

    @GetMapping("/mis-proyectos")
    public ResponseEntity<List<SocialProject>> getMisProyectos(
            @RequestHeader(name = "X-Coordinator-Id", required = true) UUID idCoordinador) {
        
        List<SocialProject> projects = projectService.getMisProyectos(idCoordinador);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/proyectos/{idProyecto}/balance-local")
    public ResponseEntity<Map<String, Object>> getBalanceLocal(@PathVariable UUID idProyecto) {
        return ResponseEntity.ok(projectService.getBalanceLocal(idProyecto));
    }

    @PostMapping("/proyectos/{idProyecto}/actividades")
    public ResponseEntity<Activity> createActivity(
            @PathVariable UUID idProyecto,
            @Valid @RequestBody Activity activity) {
        
        Activity created = activityService.createActivity(idProyecto, activity);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/actividades/{id}")
    public ResponseEntity<Activity> updateActivity(
            @PathVariable UUID id,
            @Valid @RequestBody Activity details) {
        
        try {
            Activity updated = activityService.updateActivity(id, details);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/actividades/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable UUID id) {
        try {
            activityService.deleteActivity(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/actividades/proximas/alertas")
    public ResponseEntity<List<Activity>> getMisAlertas(
            @RequestHeader(name = "X-Coordinator-Id", required = true) UUID idCoordinador) {
        
        List<Activity> alerts = activityService.getAlertasOperativas(idCoordinador);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/actividades/{idActividad}/postulados")
    public ResponseEntity<Map<String, Object>> getPostulados(@PathVariable UUID idActividad) {
        return ResponseEntity.ok(activityService.getPostulados(idActividad));
    }

    @PostMapping("/actividades/{idActividad}/asistencia")
    public ResponseEntity<Void> closingDay(
            @PathVariable UUID idActividad,
            @RequestBody List<Map<String, Object>> asistenciaList) {
        
        activityService.confirmAsistencia(idActividad, asistenciaList);
        return ResponseEntity.ok().build();
    }
}
