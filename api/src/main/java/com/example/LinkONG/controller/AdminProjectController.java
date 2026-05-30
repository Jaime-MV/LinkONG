package com.example.LinkONG.controller;

import com.example.LinkONG.model.SocialProject;
import com.example.LinkONG.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/proyectos")
public class AdminProjectController {

    private final ProjectService projectService;

    @Autowired
    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
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
