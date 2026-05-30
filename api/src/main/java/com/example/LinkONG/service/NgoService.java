package com.example.LinkONG.service;

import com.example.LinkONG.model.Ngo;
import com.example.LinkONG.repository.NgoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NgoService {

    private final NgoRepository ngoRepository;

    @Autowired
    public NgoService(NgoRepository ngoRepository) {
        this.ngoRepository = ngoRepository;
    }

    public List<Ngo> getAllNgos() {
        return ngoRepository.findAll();
    }

    public Optional<Ngo> getNgoById(Long id) {
        return ngoRepository.findById(id);
    }

    public List<Ngo> searchNgos(String name, String category, String location) {
        if (name != null && !name.trim().isEmpty()) {
            return ngoRepository.findByNameContainingIgnoreCase(name);
        } else if (category != null && !category.trim().isEmpty()) {
            return ngoRepository.findByCategoryContainingIgnoreCase(category);
        } else if (location != null && !location.trim().isEmpty()) {
            return ngoRepository.findByLocationContainingIgnoreCase(location);
        }
        return ngoRepository.findAll();
    }

    public Ngo createNgo(Ngo ngo) {
        // Regla de Negocio: Validar que no se usen correos temporales
        if (ngo.getContactEmail().toLowerCase().endsWith("@mailinator.com") ||
            ngo.getContactEmail().toLowerCase().endsWith("@yopmail.com")) {
            throw new IllegalArgumentException("No se permiten correos de dominios temporales");
        }

        // Regla de Negocio: Máximo 500 voluntarios por solicitud individual
        if (ngo.getVolunteersNeeded() > 500) {
            throw new IllegalArgumentException("La cantidad de voluntarios necesarios no puede exceder de 500 por solicitud");
        }

        return ngoRepository.save(ngo);
    }

    public Ngo updateNgo(Long id, Ngo ngoDetails) {
        Ngo ngo = ngoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ONG no encontrada con ID: " + id));

        // Reglas de negocio en actualizaciones
        if (ngoDetails.getContactEmail().toLowerCase().endsWith("@mailinator.com") ||
            ngoDetails.getContactEmail().toLowerCase().endsWith("@yopmail.com")) {
            throw new IllegalArgumentException("No se permiten correos de dominios temporales");
        }

        if (ngoDetails.getVolunteersNeeded() > 500) {
            throw new IllegalArgumentException("La cantidad de voluntarios necesarios no puede exceder de 500 por solicitud");
        }

        ngo.setName(ngoDetails.getName());
        ngo.setCategory(ngoDetails.getCategory());
        ngo.setDescription(ngoDetails.getDescription());
        ngo.setVolunteersNeeded(ngoDetails.getVolunteersNeeded());
        ngo.setLocation(ngoDetails.getLocation());
        ngo.setContactEmail(ngoDetails.getContactEmail());

        return ngoRepository.save(ngo);
    }

    public void deleteNgo(Long id) {
        if (!ngoRepository.existsById(id)) {
            throw new IllegalArgumentException("No se puede eliminar: ONG no encontrada con ID: " + id);
        }
        ngoRepository.deleteById(id);
    }
}
