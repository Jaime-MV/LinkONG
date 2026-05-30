package com.example.LinkONG.service;

import com.example.LinkONG.model.Donation;
import com.example.LinkONG.model.ProjectExpense;
import com.example.LinkONG.repository.DonationRepository;
import com.example.LinkONG.repository.ProjectExpenseRepository;
import com.example.LinkONG.repository.SocialProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class FinanceService {

    private final DonationRepository donationRepository;
    private final ProjectExpenseRepository projectExpenseRepository;
    private final SocialProjectRepository socialProjectRepository;

    @Autowired
    public FinanceService(DonationRepository donationRepository, 
                          ProjectExpenseRepository projectExpenseRepository, 
                          SocialProjectRepository socialProjectRepository) {
        this.donationRepository = donationRepository;
        this.projectExpenseRepository = projectExpenseRepository;
        this.socialProjectRepository = socialProjectRepository;
    }

    public Map<String, Object> getFinanzasResumen() {
        BigDecimal ingresos = donationRepository.sumDonacionesMesActual();
        BigDecimal egresos = projectExpenseRepository.sumGastosMesActual();
        BigDecimal balance = ingresos.subtract(egresos);

        Map<String, Object> resumen = new HashMap<>();
        resumen.put("ingresos_mes", ingresos);
        resumen.put("egresos_mes", egresos);
        resumen.put("balance_mes", balance);
        resumen.put("moneda", "USD");
        return resumen;
    }

    public List<Map<String, Object>> getGraficoDistribucion() {
        List<Object[]> donaciones = donationRepository.sumDonacionesAgrupadoPorProyecto();
        List<Object[]> gastos = projectExpenseRepository.sumGastosAgrupadoPorProyecto();

        Map<UUID, Map<String, Object>> proyectoMapa = new HashMap<>();

        // Procesar donaciones
        for (Object[] d : donaciones) {
            UUID projectId = (UUID) d[0];
            BigDecimal sumD = (BigDecimal) d[1];

            Map<String, Object> item = new HashMap<>();
            item.put("proyecto_id", projectId);
            item.put("donado", sumD);
            item.put("gastado", BigDecimal.ZERO);
            
            socialProjectRepository.findById(projectId).ifPresent(p -> item.put("nombre_proyecto", p.getNombreCampana()));
            proyectoMapa.put(projectId, item);
        }

        // Procesar gastos
        for (Object[] g : gastos) {
            UUID projectId = (UUID) g[0];
            BigDecimal sumG = (BigDecimal) g[1];

            Map<String, Object> item = proyectoMapa.computeIfAbsent(projectId, k -> {
                Map<String, Object> newItem = new HashMap<>();
                newItem.put("proyecto_id", projectId);
                newItem.put("donado", BigDecimal.ZERO);
                socialProjectRepository.findById(projectId).ifPresent(p -> newItem.put("nombre_proyecto", p.getNombreCampana()));
                return newItem;
            });
            item.put("gastado", sumG);
        }

        return new ArrayList<>(proyectoMapa.values());
    }

    @Transactional
    public Donation createDonation(Donation donation) {
        if (!socialProjectRepository.existsById(donation.getIdProyectoDestino())) {
            throw new IllegalArgumentException("El proyecto de destino especificado no existe en la base de datos");
        }

        if ("MONETARIO".equalsIgnoreCase(donation.getTipoAporte())) {
            if (donation.getMontoDinero() == null || donation.getMontoDinero().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Para aportes monetarios, el monto de dinero debe ser mayor a 0");
            }
            donation.setDescripcionEspecie(null);
        } else if ("ESPECIE".equalsIgnoreCase(donation.getTipoAporte())) {
            if (donation.getDescripcionEspecie() == null || donation.getDescripcionEspecie().trim().isEmpty()) {
                throw new IllegalArgumentException("Para aportes en especie, debe proporcionar una descripción de los bienes");
            }
            donation.setMontoDinero(BigDecimal.ZERO);
        } else {
            throw new IllegalArgumentException("Tipo de aporte no válido. Debe ser 'MONETARIO' o 'ESPECIE'");
        }

        return donationRepository.save(donation);
    }

    @Transactional
    public ProjectExpense createExpense(ProjectExpense expense) {
        if (!socialProjectRepository.existsById(expense.getIdProyecto())) {
            throw new IllegalArgumentException("El proyecto asociado al gasto no existe");
        }

        if (expense.getMontoGastado() == null || expense.getMontoGastado().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto del egreso debe ser mayor que 0");
        }

        List<String> categoriasValidas = Arrays.asList("Materiales de Construcción", "Transporte de Voluntarios", "Alimentación/Hidratación", "Herramientas");
        if (!categoriasValidas.contains(expense.getCategoriaGasto())) {
            throw new IllegalArgumentException("Categoría de gasto no válida. Categorías aceptadas: " + categoriasValidas);
        }

        if (expense.getFechaGasto() == null) {
            expense.setFechaGasto(LocalDate.now());
        }

        return projectExpenseRepository.save(expense);
    }
}
