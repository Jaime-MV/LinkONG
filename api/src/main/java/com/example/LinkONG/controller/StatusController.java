package com.example.LinkONG.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    private final DataSource dataSource;

    @Autowired
    public StatusController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "online");
        
        try (Connection connection = dataSource.getConnection()) {
            status.put("database", "connected");
        } catch (Exception e) {
            status.put("database", "disconnected");
            status.put("database_error", e.getMessage());
        }
        
        return ResponseEntity.ok(status);
    }
}
