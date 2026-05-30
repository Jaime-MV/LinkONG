package com.example.LinkONG.repository;

import com.example.LinkONG.model.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, UUID> {
    
    // Búsqueda dinámica por estado y habilidad técnica
    // Nota: 'habilidades_tecnicas' es un array text[]. En Postgres, podemos usar la función nativa 'any' o un casting.
    // Usamos una consulta nativa para soportar filtros de array de forma óptima
    @Query(value = "SELECT * FROM voluntarios v WHERE " +
            "(:estado IS NULL OR v.estado_voluntario = :estado) AND " +
            "(:habilidad IS NULL OR :habilidad = ANY(v.habilidades_tecnicas))", 
            nativeQuery = true)
    List<Volunteer> findByEstadoAndHabilidad(
            @Param("estado") String estado, 
            @Param("habilidad") String habilidad);
}
