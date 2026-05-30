package com.example.LinkONG.service;

import com.example.LinkONG.model.Volunteer;
import com.example.LinkONG.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    @Autowired
    public VolunteerService(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    public List<Volunteer> searchVolunteers(String estado, String habilidad) {
        // Limpiar parámetros vacíos
        String searchEstado = (estado == null || estado.trim().isEmpty()) ? null : estado.trim();
        String searchHabilidad = (habilidad == null || habilidad.trim().isEmpty()) ? null : habilidad.trim();
        return volunteerRepository.findByEstadoAndHabilidad(searchEstado, searchHabilidad);
    }

    public Optional<Volunteer> getVolunteerById(UUID id) {
        return volunteerRepository.findById(id);
    }

    @Transactional
    public Volunteer updateEstadoVoluntario(UUID id, String nuevoEstado) {
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voluntario no encontrado con ID: " + id));

        List<String> estadosValidos = Arrays.asList("Activo", "Inactivo", "En Inducción");
        if (!estadosValidos.contains(nuevoEstado)) {
            throw new IllegalArgumentException("Estado de voluntario no válido. Estados aceptados: " + estadosValidos);
        }

        volunteer.setEstadoVoluntario(nuevoEstado);
        return volunteerRepository.save(volunteer);
    }

    @Transactional
    public Volunteer updateVolunteerProfile(UUID id, Volunteer profileDetails) {
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voluntario no encontrado"));

        if (profileDetails.getTelefono() == null || profileDetails.getTelefono().trim().length() < 7) {
            throw new IllegalArgumentException("El número de teléfono debe tener al menos 7 dígitos");
        }

        List<String> tallasValidas = Arrays.asList("S", "M", "L", "XL");
        if (profileDetails.getTallaCamiseta() != null && !tallasValidas.contains(profileDetails.getTallaCamiseta())) {
            throw new IllegalArgumentException("Talla de camiseta no válida. Tallas válidas: " + tallasValidas);
        }

        volunteer.setNombreCompleto(profileDetails.getNombreCompleto());
        volunteer.setTelefono(profileDetails.getTelefono());
        volunteer.setHabilidadesTecnicas(profileDetails.getHabilidadesTecnicas());
        
        if (profileDetails.getTallaCamiseta() != null) {
            volunteer.setTallaCamiseta(profileDetails.getTallaCamiseta());
        }

        return volunteerRepository.save(volunteer);
    }
}
