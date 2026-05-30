package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "coordinadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coordinator {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_coordinador", updatable = false, nullable = false)
    private UUID idCoordinador;

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 150)
    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @NotBlank(message = "El correo electrónico es requerido")
    @Email
    @Size(max = 100)
    @Column(name = "correo", unique = true, nullable = false, length = 100)
    private String correo;
}
