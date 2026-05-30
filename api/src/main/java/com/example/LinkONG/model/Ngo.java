package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "ngos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ngo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la ONG no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String name;

    @NotBlank(message = "La categoría no puede estar vacía")
    @Size(max = 50, message = "La categoría no puede exceder los 50 caracteres")
    private String category;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(max = 1000, message = "La descripción no puede exceder los 1000 caracteres")
    @Column(length = 1000)
    private String description;

    @NotNull(message = "La cantidad de voluntarios necesarios es requerida")
    @Min(value = 0, message = "La cantidad de voluntarios necesarios no puede ser negativa")
    private Integer volunteersNeeded;

    @NotBlank(message = "La ubicación no puede estar vacía")
    @Size(max = 100, message = "La ubicación no puede exceder los 100 caracteres")
    private String location;

    @NotBlank(message = "El correo de contacto no puede estar vacío")
    @Email(message = "Debe proporcionar una dirección de correo válida")
    private String contactEmail;
}
