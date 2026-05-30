package com.example.LinkONG.repository;

import com.example.LinkONG.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface DonationRepository extends JpaRepository<Donation, UUID> {
    
    // Obtener la suma total de donaciones de un proyecto
    @Query("SELECT COALESCE(SUM(d.montoDinero), 0) FROM Donation d WHERE d.idProyectoDestino = :idProyecto")
    BigDecimal sumDonacionesByProyecto(@Param("idProyecto") UUID idProyecto);

    // Obtener sumatoria total de ingresos financieros del mes actual
    @Query(value = "SELECT COALESCE(SUM(monto_dinero), 0) FROM donaciones WHERE " +
            "fecha_ingreso >= DATE_TRUNC('month', CURRENT_DATE) AND " +
            "fecha_ingreso < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'", 
            nativeQuery = true)
    BigDecimal sumDonacionesMesActual();

    // Obtener sumatoria total histórica por proyecto para gráficos
    @Query("SELECT d.idProyectoDestino, SUM(d.montoDinero) FROM Donation d GROUP BY d.idProyectoDestino")
    List<Object[]> sumDonacionesAgrupadoPorProyecto();
}
