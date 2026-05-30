package com.example.LinkONG.controller;

import com.example.LinkONG.model.Ngo;
import com.example.LinkONG.service.NgoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ngos")
public class NgoController {

    private final NgoService ngoService;

    @Autowired
    public NgoController(NgoService ngoService) {
        this.ngoService = ngoService;
    }

    @GetMapping
    public ResponseEntity<List<Ngo>> getAllNgos(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        
        List<Ngo> ngos = ngoService.searchNgos(name, category, location);
        return ResponseEntity.ok(ngos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ngo> getNgoById(@PathVariable Long id) {
        return ngoService.getNgoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ngo> createNgo(@Valid @RequestBody Ngo ngo) {
        Ngo createdNgo = ngoService.createNgo(ngo);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNgo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ngo> updateNgo(@PathVariable Long id, @Valid @RequestBody Ngo ngoDetails) {
        try {
            Ngo updatedNgo = ngoService.updateNgo(id, ngoDetails);
            return ResponseEntity.ok(updatedNgo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNgo(@PathVariable Long id) {
        try {
            ngoService.deleteNgo(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
