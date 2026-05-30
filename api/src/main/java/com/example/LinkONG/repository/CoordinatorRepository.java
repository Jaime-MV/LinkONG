package com.example.LinkONG.repository;

import com.example.LinkONG.model.Coordinator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CoordinatorRepository extends JpaRepository<Coordinator, UUID> {
    Optional<Coordinator> findByCorreo(String correo);
}
