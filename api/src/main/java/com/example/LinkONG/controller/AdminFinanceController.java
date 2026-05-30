package com.example.LinkONG.controller;

import com.example.LinkONG.model.Donation;
import com.example.LinkONG.model.ProjectExpense;
import com.example.LinkONG.service.FinanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminFinanceController {

    private final FinanceService financeService;

    @Autowired
    public AdminFinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/finanzas/resumen")
    public ResponseEntity<Map<String, Object>> getResumen() {
        return ResponseEntity.ok(financeService.getFinanzasResumen());
    }

    @GetMapping("/finanzas/grafico-distribucion")
    public ResponseEntity<List<Map<String, Object>>> getGraficoDistribucion() {
        return ResponseEntity.ok(financeService.getGraficoDistribucion());
    }

    @PostMapping("/donaciones")
    public ResponseEntity<Donation> createDonation(@Valid @RequestBody Donation donation) {
        Donation created = financeService.createDonation(donation);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/gastos")
    public ResponseEntity<ProjectExpense> createExpense(@Valid @RequestBody ProjectExpense expense) {
        ProjectExpense created = financeService.createExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
