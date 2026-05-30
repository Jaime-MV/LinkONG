package com.example.LinkONG.controller;

import com.example.LinkONG.model.Coordinator;
import com.example.LinkONG.model.Volunteer;
import com.example.LinkONG.repository.CoordinatorRepository;
import com.example.LinkONG.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final CoordinatorRepository coordinatorRepository;
    private final VolunteerRepository volunteerRepository;

    @Autowired
    public AuthController(CoordinatorRepository coordinatorRepository,
                          VolunteerRepository volunteerRepository) {
        this.coordinatorRepository = coordinatorRepository;
        this.volunteerRepository = volunteerRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String correo = body.get("correo");
        String contrasena = body.get("contrasena");

        if (correo == null || contrasena == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Correo y contraseña son requeridos"));
        }

        // 1. Buscar en tabla coordinadores (Admin o Coordinador)
        Optional<Coordinator> coordOpt = coordinatorRepository.findByCorreo(correo);
        if (coordOpt.isPresent()) {
            Coordinator coord = coordOpt.get();
            if (contrasena.equals(coord.getContrasena())) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", coord.getIdCoordinador().toString());
                response.put("nombre", coord.getNombre());
                response.put("correo", coord.getCorreo());
                response.put("rol", coord.getRol()); // "Admin" o "Coordinador"
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
        }

        // 2. Buscar en tabla voluntarios
        Optional<Volunteer> volOpt = volunteerRepository.findByCorreoElectronico(correo);
        if (volOpt.isPresent()) {
            Volunteer vol = volOpt.get();
            if (contrasena.equals(vol.getContrasena())) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", vol.getIdVoluntario().toString());
                response.put("nombre", vol.getNombreCompleto());
                response.put("correo", vol.getCorreoElectronico());
                response.put("rol", "Voluntario");
                response.put("estado", vol.getEstadoVoluntario());
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Usuario no encontrado"));
    }
}
