package com.example.LinkONG.service;

import com.example.LinkONG.model.Project;
import com.example.LinkONG.repository.NgoRepository;
import com.example.LinkONG.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final NgoRepository ngoRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, NgoRepository ngoRepository) {
        this.projectRepository = projectRepository;
        this.ngoRepository = ngoRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public List<Project> getProjectsByNgo(Long ngoId) {
        return projectRepository.findByNgoId(ngoId);
    }

    public Project createProject(Project project) {
        // Regla de Negocio: Validar que la ONG asociada realmente exista en la base de datos
        if (!ngoRepository.existsById(project.getNgoId())) {
            throw new IllegalArgumentException("La ONG asociada con ID " + project.getNgoId() + " no existe en la base de datos");
        }

        // Regla de Negocio: Presupuesto mínimo de un proyecto es 0 (no negativo)
        if (project.getBudget() < 0) {
            throw new IllegalArgumentException("El presupuesto del proyecto no puede ser negativo");
        }

        // Regla de Negocio: Estado inicial por defecto
        if (project.getStatus() == null || project.getStatus().trim().isEmpty()) {
            project.setStatus("Planificado");
        }

        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Proyecto no encontrado con ID: " + id));

        // Reglas de negocio en actualización
        if (!ngoRepository.existsById(projectDetails.getNgoId())) {
            throw new IllegalArgumentException("La ONG asociada con ID " + projectDetails.getNgoId() + " no existe en la base de datos");
        }

        if (projectDetails.getBudget() < 0) {
            throw new IllegalArgumentException("El presupuesto del proyecto no puede ser negativo");
        }

        project.setTitle(projectDetails.getTitle());
        project.setDescription(projectDetails.getDescription());
        project.setStatus(projectDetails.getStatus());
        project.setBudget(projectDetails.getBudget());
        project.setNgoId(projectDetails.getNgoId());

        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new IllegalArgumentException("No se puede eliminar: Proyecto no encontrado con ID: " + id);
        }
        projectRepository.deleteById(id);
    }
}
