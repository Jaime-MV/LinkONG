package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "voluntarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_voluntario", updatable = false, nullable = false)
    private UUID idVoluntario;

    @NotBlank(message = "El nombre completo es requerido")
    @Size(max = 150)
    @Column(name = "nombre_completo", nullable = false, length = 150)
    private String nombreCompleto;

    @NotBlank(message = "El correo electrónico es requerido")
    @Email
    @Size(max = 100)
    @Column(name = "correo_electronico", unique = true, nullable = false, length = 100)
    private String correoElectronico;

    @NotBlank(message = "El teléfono es requerido")
    @Size(max = 20)
    @Column(name = "telefono", nullable = false, length = 20)
    private String telefono;

    @NotNull(message = "La fecha de nacimiento es requerida")
    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @NotEmpty(message = "Debe especificar al menos una habilidad técnica")
    @Column(name = "habilidades_tecnicas", columnDefinition = "text[]", nullable = false)
    private String[] habilidadesTecnicas;

    @NotBlank(message = "La talla de camiseta es requerida")
    @Column(name = "talla_camiseta", nullable = false)
    private String tallaCamiseta; // ENUM: S, M, L, XL

    @Column(name = "estado_voluntario")
    private String estadoVoluntario; // ENUM: 'Activo', 'Inactivo', 'En Inducción'

    @Column(name = "fecha_registro", insertable = false, updatable = false)
    private LocalDateTime fechaRegistro;
}
