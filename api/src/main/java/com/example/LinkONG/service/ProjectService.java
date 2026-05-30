package com.example.LinkONG.service;

import com.example.LinkONG.model.SocialProject;
import com.example.LinkONG.repository.CoordinatorRepository;
import com.example.LinkONG.repository.DonationRepository;
import com.example.LinkONG.repository.ProjectExpenseRepository;
import com.example.LinkONG.repository.SocialProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class ProjectService {

    private final SocialProjectRepository socialProjectRepository;
    private final CoordinatorRepository coordinatorRepository;
    private final DonationRepository donationRepository;
    private final ProjectExpenseRepository projectExpenseRepository;

    @Autowired
    public ProjectService(SocialProjectRepository socialProjectRepository,
                          CoordinatorRepository coordinatorRepository,
                          DonationRepository donationRepository,
                          ProjectExpenseRepository projectExpenseRepository) {
        this.socialProjectRepository = socialProjectRepository;
        this.coordinatorRepository = coordinatorRepository;
        this.donationRepository = donationRepository;
        this.projectExpenseRepository = projectExpenseRepository;
    }

    public List<SocialProject> getAllProjects() {
        return socialProjectRepository.findAll();
    }

    public Optional<SocialProject> getProjectById(UUID id) {
        return socialProjectRepository.findById(id);
    }

    public List<SocialProject> getMisProyectos(UUID idCoordinador) {
        return socialProjectRepository.findByIdCoordinadorResponsable(idCoordinador);
    }

    public Map<String, Object> getBalanceLocal(UUID idProyecto) {
        SocialProject project = socialProjectRepository.findById(idProyecto)
                .orElseThrow(() -> new IllegalArgumentException("Proyecto no encontrado con ID: " + idProyecto));

        BigDecimal donaciones = donationRepository.sumDonacionesByProyecto(idProyecto);
        BigDecimal gastos = projectExpenseRepository.sumGastosByProyecto(idProyecto);
        BigDecimal balance = donaciones.subtract(gastos);

        Map<String, Object> response = new HashMap<>();
        response.put("proyecto_id", idProyecto);
        response.put("nombre_proyecto", project.getNombreCampana());
        response.put("donaciones_totales", donaciones);
        response.put("gastos_totales", gastos);
        response.put("balance_local", balance);
        return response;
    }

    @Transactional
    public SocialProject createProject(SocialProject project) {
        if (!coordinatorRepository.existsById(project.getIdCoordinadorResponsable())) {
            throw new IllegalArgumentException("El Coordinador Responsable asignado con ID " + project.getIdCoordinadorResponsable() + " no existe");
        }

        if (project.getFechaFinEstimada().isBefore(project.getFechaInicio())) {
            throw new IllegalArgumentException("La fecha de fin estimada no puede ser anterior a la fecha de inicio");
        }

        if (project.getEstadoProyecto() == null || project.getEstadoProyecto().trim().isEmpty()) {
            project.setEstadoProyecto("En Diagnóstico");
        }

        List<String> estadosValidos = Arrays.asList("En Diagnóstico", "En Recaudación", "En Ejecución", "Finalizado");
        if (!estadosValidos.contains(project.getEstadoProyecto())) {
            throw new IllegalArgumentException("Estado de proyecto no válido. Estados válidos: " + estadosValidos);
        }

        return socialProjectRepository.save(project);
    }

    @Transactional
    public SocialProject updateProject(UUID id, SocialProject details) {
        SocialProject project = socialProjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Proyecto no encontrado con ID: " + id));

        if (!coordinatorRepository.existsById(details.getIdCoordinadorResponsable())) {
            throw new IllegalArgumentException("El Coordinador Responsable asignado con ID " + details.getIdCoordinadorResponsable() + " no existe");
        }

        if (details.getFechaFinEstimada().isBefore(details.getFechaInicio())) {
            throw new IllegalArgumentException("La fecha de fin estimada no puede ser anterior a la fecha de inicio");
        }

        List<String> estadosValidos = Arrays.asList("En Diagnóstico", "En Recaudación", "En Ejecución", "Finalizado");
        if (!estadosValidos.contains(details.getEstadoProyecto())) {
            throw new IllegalArgumentException("Estado de proyecto no válido. Estados válidos: " + estadosValidos);
        }

        project.setNombreCampana(details.getNombreCampana());
        project.setDescripcionObjetivo(details.getDescripcionObjetivo());
        project.setLocalidadBeneficiada(details.getLocalidadBeneficiada());
        project.setFechaInicio(details.getFechaInicio());
        project.setFechaFinEstimada(details.getFechaFinEstimada());
        project.setIdCoordinadorResponsable(details.getIdCoordinadorResponsable());
        project.setEstadoProyecto(details.getEstadoProyecto());

        return socialProjectRepository.save(project);
    }

    @Transactional
    public void deleteProject(UUID id) {
        if (!socialProjectRepository.existsById(id)) {
            throw new IllegalArgumentException("Proyecto no encontrado con ID: " + id);
        }

        // Regla de Negocio: Validar que el proyecto no tenga transacciones financieras previas
        BigDecimal donaciones = donationRepository.sumDonacionesByProyecto(id);
        BigDecimal gastos = projectExpenseRepository.sumGastosByProyecto(id);

        if (donaciones.compareTo(BigDecimal.ZERO) > 0 || gastos.compareTo(BigDecimal.ZERO) > 0) {
            throw new IllegalStateException("No se puede eliminar el proyecto porque contiene registros contables activos (Donaciones o Gastos asociados)");
        }

        socialProjectRepository.deleteById(id);
    }

    public List<SocialProject> getProyectosDisponibles(String localidad) {
        return socialProjectRepository.findProyectosDisponibles(localidad);
    }
}
