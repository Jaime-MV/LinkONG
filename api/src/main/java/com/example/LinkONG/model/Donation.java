package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_donacion", updatable = false, nullable = false)
    private UUID idDonacion;

    @Size(max = 150)
    @Column(name = "nombre_donante", length = 150)
    private String nombreDonante;

    @NotBlank(message = "El correo del donante es requerido")
    @Email
    @Size(max = 100)
    @Column(name = "correo_donante", nullable = false, length = 100)
    private String correoDonante;

    @NotBlank(message = "El tipo de aporte es requerido")
    @Column(name = "tipo_aporte", nullable = false)
    private String tipoAporte; // ENUM: MONETARIO, ESPECIE

    @NotNull(message = "El monto de dinero es requerido")
    @DecimalMin(value = "0.00", message = "El monto de dinero no puede ser negativo")
    @Column(name = "monto_dinero", precision = 10, scale = 2)
    private BigDecimal montoDinero;

    @Column(name = "descripcion_especie", columnDefinition = "TEXT")
    private String descripcionEspecie;

    @Column(name = "fecha_ingreso", insertable = false, updatable = false)
    private LocalDateTime fechaIngreso;

    @NotNull(message = "El ID del proyecto de destino es requerido")
    @Column(name = "id_proyecto_destino", nullable = false)
    private UUID idProyectoDestino;
}
