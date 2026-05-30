package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "volunteers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre completo es requerido")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String fullName;

    @NotBlank(message = "El correo electrónico es requerido")
    @Email(message = "Debe proporcionar una dirección de correo válida")
    private String email;

    @NotBlank(message = "El teléfono es requerido")
    @Pattern(regexp = "^\\+?[0-9\\s\\-\\(]{7,20}$", message = "El número de teléfono no es válido")
    private String phone;

    @NotBlank(message = "Debe especificar al menos una habilidad")
    private String skills;

    @NotBlank(message = "El estado del voluntario es requerido")
    private String status; // e.g., "Activo", "Pendiente", "Inactivo"
}
