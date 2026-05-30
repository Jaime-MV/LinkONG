package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "actividades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_actividad", updatable = false, nullable = false)
    private UUID idActividad;

    @NotNull(message = "El ID del proyecto asociado es requerido")
    @Column(name = "id_proyecto", nullable = false)
    private UUID idProyecto;

    @NotBlank(message = "El título de la actividad es requerido")
    @Size(max = 150)
    @Column(name = "titulo_actividad", nullable = false, length = 150)
    private String tituloActividad;

    @Column(name = "descripcion_detalle", columnDefinition = "TEXT")
    private String descripcionDetalle;

    @NotNull(message = "La fecha y hora de ejecución es requerida")
    @Column(name = "fecha_ejecucion", nullable = false)
    private LocalDateTime fechaEjecucion;

    @NotNull(message = "Los cupos de voluntarios requeridos son requeridos")
    @Min(value = 1, message = "Los cupos requeridos deben ser mayores a 0")
    @Column(name = "cupos_voluntarios_requeridos", nullable = false)
    private Integer cuposVoluntariosRequeridos;

    @Size(max = 50)
    @Column(name = "estado")
    private String estado; // ENUM: 'Programada', 'Confirmada', 'Ejecutada', 'Cancelada'
}
