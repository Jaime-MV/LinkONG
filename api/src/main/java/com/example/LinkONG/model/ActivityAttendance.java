package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "asistencia_actividades", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"id_voluntario", "id_actividad"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_asistencia", updatable = false, nullable = false)
    private UUID idAsistencia;

    @NotNull(message = "El ID del voluntario es requerido")
    @Column(name = "id_voluntario", nullable = false)
    private UUID idVoluntario;

    @NotNull(message = "El ID de la actividad es requerido")
    @Column(name = "id_actividad", nullable = false)
    private UUID idActividad;

    @NotNull(message = "Las horas trabajadas son requeridas")
    @DecimalMin(value = "0.00", message = "Las horas trabajadas no pueden ser negativas")
    @Column(name = "horas_trabajadas", precision = 4, scale = 2)
    private BigDecimal horasTrabajadas;

    @NotBlank(message = "El rol en la actividad es requerido")
    @Size(max = 100)
    @Column(name = "rol_en_actividad", nullable = false, length = 100)
    private String rolEnActividad;

    @Column(name = "asistio")
    private Boolean asistio;
}
