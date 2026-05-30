package com.example.LinkONG.service;

import com.example.LinkONG.model.Volunteer;
import com.example.LinkONG.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    @Autowired
    public VolunteerService(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    public List<Volunteer> getAllVolunteers() {
        return volunteerRepository.findAll();
    }

    public Optional<Volunteer> getVolunteerById(Long id) {
        return volunteerRepository.findById(id);
    }

    public Volunteer createVolunteer(Volunteer volunteer) {
        // Regla de Negocio: Validar formato elemental de teléfono
        if (volunteer.getPhone() == null || volunteer.getPhone().trim().length() < 7) {
            throw new IllegalArgumentException("El número de teléfono debe tener al menos 7 dígitos");
        }

        // Regla de Negocio: Por defecto, el estado es 'Pendiente' si viene en blanco o no es válido
        if (volunteer.getStatus() == null || volunteer.getStatus().trim().isEmpty()) {
            volunteer.setStatus("Pendiente");
        }

        return volunteerRepository.save(volunteer);
    }

    public Volunteer updateVolunteer(Long id, Volunteer volunteerDetails) {
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voluntario no encontrado con ID: " + id));

        if (volunteerDetails.getPhone() == null || volunteerDetails.getPhone().trim().length() < 7) {
            throw new IllegalArgumentException("El número de teléfono debe tener al menos 7 dígitos");
        }

        volunteer.setFullName(volunteerDetails.getFullName());
        volunteer.setEmail(volunteerDetails.getEmail());
        volunteer.setPhone(volunteerDetails.getPhone());
        volunteer.setSkills(volunteerDetails.getSkills());
        
        if (volunteerDetails.getStatus() != null && !volunteerDetails.getStatus().trim().isEmpty()) {
            volunteer.setStatus(volunteerDetails.getStatus());
        }

        return volunteerRepository.save(volunteer);
    }

    public void deleteVolunteer(Long id) {
        if (!volunteerRepository.existsById(id)) {
            throw new IllegalArgumentException("No se puede eliminar: Voluntario no encontrado con ID: " + id);
        }
        volunteerRepository.deleteById(id);
    }
}
