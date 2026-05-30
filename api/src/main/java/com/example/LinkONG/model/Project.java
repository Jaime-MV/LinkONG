package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título del proyecto es requerido")
    @Size(max = 150, message = "El título no puede exceder los 150 caracteres")
    private String title;

    @NotBlank(message = "La descripción del proyecto es requerida")
    @Size(max = 1000, message = "La descripción no puede exceder los 1000 caracteres")
    @Column(length = 1000)
    private String description;

    @NotBlank(message = "El estado del proyecto es requerido")
    private String status; // e.g., "Planificado", "En Progreso", "Completado"

    @NotNull(message = "El presupuesto es requerido")
    @Min(value = 0, message = "El presupuesto no puede ser negativo")
    private Double budget;

    @NotNull(message = "El ID de la ONG asociada es requerido")
    private Long ngoId;
}
