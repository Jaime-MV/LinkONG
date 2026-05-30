package com.example.LinkONG.controller;

import com.example.LinkONG.model.Volunteer;
import com.example.LinkONG.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/voluntarios")
public class AdminVolunteerController {

    private final VolunteerService volunteerService;

    @Autowired
    public AdminVolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    @GetMapping("/busqueda")
    public ResponseEntity<List<Volunteer>> searchVolunteers(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String habilidad) {
        
        List<Volunteer> volunteers = volunteerService.searchVolunteers(estado, habilidad);
        return ResponseEntity.ok(volunteers);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Volunteer> updateEstadoVoluntario(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        
        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'estado' es requerido en el cuerpo de la petición");
        }

        Volunteer updated = volunteerService.updateEstadoVoluntario(id, nuevoEstado);
        return ResponseEntity.ok(updated);
    }
}
