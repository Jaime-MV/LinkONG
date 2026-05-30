package com.example.LinkONG.repository;

import com.example.LinkONG.model.SocialProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SocialProjectRepository extends JpaRepository<SocialProject, UUID> {
    
    // Buscar proyectos por localidad
    List<SocialProject> findByLocalidadBeneficiadaContainingIgnoreCase(String localidad);

    // Buscar proyectos asignados a un coordinador
    List<SocialProject> findByIdCoordinadorResponsable(UUID idCoordinador);

    // Buscar proyectos disponibles para voluntarios (e.g. estado 'En Ejecución' o 'En Recaudación')
    @Query("SELECT p FROM SocialProject p WHERE " +
            "p.estadoProyecto IN ('En Ejecución', 'En Recaudación') AND " +
            "(:localidad IS NULL OR LOWER(p.localidadBeneficiada) LIKE LOWER(CONCAT('%', :localidad, '%')))")
    List<SocialProject> findProyectosDisponibles(@Param("localidad") String localidad);
}
