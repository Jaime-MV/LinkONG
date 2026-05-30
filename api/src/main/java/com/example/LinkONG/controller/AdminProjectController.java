package com.example.LinkONG.controller;

import com.example.LinkONG.model.SocialProject;
import com.example.LinkONG.model.Coordinator;
import com.example.LinkONG.service.ProjectService;
import com.example.LinkONG.repository.CoordinatorRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/proyectos")
@CrossOrigin(origins = "*")
public class AdminProjectController {

    private final ProjectService projectService;
    private final CoordinatorRepository coordinatorRepository;

    @Autowired
    public AdminProjectController(ProjectService projectService, CoordinatorRepository coordinatorRepository) {
        this.projectService = projectService;
        this.coordinatorRepository = coordinatorRepository;
    }

    @GetMapping
    public ResponseEntity<List<SocialProject>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/coordinadores")
    public ResponseEntity<List<Coordinator>> getAllCoordinadores() {
        return ResponseEntity.ok(coordinatorRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<SocialProject> createProject(@Valid @RequestBody SocialProject project) {
        SocialProject created = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SocialProject> updateProject(@PathVariable UUID id, @Valid @RequestBody SocialProject projectDetails) {
        try {
            SocialProject updated = projectService.updateProject(id, projectDetails);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
