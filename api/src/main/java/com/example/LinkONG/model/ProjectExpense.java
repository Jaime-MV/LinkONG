package com.example.LinkONG.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "gastos_proyectos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_gasto", updatable = false, nullable = false)
    private UUID idGasto;

    @NotNull(message = "El ID del proyecto es requerido")
    @Column(name = "id_proyecto", nullable = false)
    private UUID idProyecto;

    @NotNull(message = "El monto gastado es requerido")
    @DecimalMin(value = "0.01", message = "El monto gastado debe ser mayor a 0")
    @Column(name = "monto_gastado", precision = 10, scale = 2, nullable = false)
    private BigDecimal montoGastado;

    @NotBlank(message = "La categoría de gasto es requerida")
    @Column(name = "categoria_gasto", nullable = false)
    private String categoriaGasto; // ENUM: Materiales de Construcción, Transporte de Voluntarios, Alimentación/Hidratación, Herramientas

    @NotBlank(message = "La descripción de detalle es requerida")
    @Size(max = 255)
    @Column(name = "descripcion_detalle", nullable = false, length = 255)
    private String descripcionDetalle;

    @Column(name = "fecha_gasto")
    private LocalDate fechaGasto;

    @NotBlank(message = "El número de factura o comprobante es requerido")
    @Size(max = 100)
    @Column(name = "numero_factura_comprobante", nullable = false, length = 100)
    private String numeroFacturaComprobante;
}
