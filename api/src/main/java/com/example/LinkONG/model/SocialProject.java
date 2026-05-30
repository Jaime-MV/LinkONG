package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "proyectos_sociales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialProject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_proyecto", updatable = false, nullable = false)
    private UUID idProyecto;

    @NotBlank(message = "El nombre de la campaña es requerido")
    @Size(max = 200)
    @Column(name = "nombre_campana", nullable = false, length = 200)
    private String nombreCampana;

    @NotBlank(message = "La descripción de objetivos es requerida")
    @Column(name = "descripcion_objetivo", nullable = false, columnDefinition = "TEXT")
    private String descripcionObjetivo;

    @NotBlank(message = "La localidad beneficiada es requerida")
    @Size(max = 150)
    @Column(name = "localidad_beneficiada", nullable = false, length = 150)
    private String localidadBeneficiada;

    @NotNull(message = "La fecha de inicio es requerida")
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha de fin estimada es requerida")
    @Column(name = "fecha_fin_estimada", nullable = false)
    private LocalDate fechaFinEstimada;

    @NotNull(message = "El ID del coordinador responsable es requerido")
    @Column(name = "id_coordinador_responsable", nullable = false)
    private UUID idCoordinadorResponsable;

    @Column(name = "estado_proyecto")
    private String estadoProyecto; // ENUM: 'En Diagnóstico', 'En Recaudación', 'En Ejecución', 'Finalizado'
}
