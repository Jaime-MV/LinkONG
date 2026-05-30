package com.example.LinkONG.repository;

import com.example.LinkONG.model.ProjectExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectExpenseRepository extends JpaRepository<ProjectExpense, UUID> {
    
    // Obtener la suma total de gastos de un proyecto
    @Query("SELECT COALESCE(SUM(g.montoGastado), 0) FROM ProjectExpense g WHERE g.idProyecto = :idProyecto")
    BigDecimal sumGastosByProyecto(@Param("idProyecto") UUID idProyecto);

    // Obtener sumatoria total de gastos del mes actual
    @Query(value = "SELECT COALESCE(SUM(monto_gastado), 0) FROM gastos_proyectos WHERE " +
            "fecha_gasto >= DATE_TRUNC('month', CURRENT_DATE) AND " +
            "fecha_gasto < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'", 
            nativeQuery = true)
    BigDecimal sumGastosMesActual();

    // Obtener sumatoria total de gastos histórica agrupada por proyecto para gráficos
    @Query("SELECT g.idProyecto, SUM(g.montoGastado) FROM ProjectExpense g GROUP BY g.idProyecto")
    List<Object[]> sumGastosAgrupadoPorProyecto();
}
