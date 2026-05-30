package com.example.LinkONG.repository;

import com.example.LinkONG.model.Ngo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NgoRepository extends JpaRepository<Ngo, Long> {
    List<Ngo> findByNameContainingIgnoreCase(String name);
    List<Ngo> findByCategoryContainingIgnoreCase(String category);
    List<Ngo> findByLocationContainingIgnoreCase(String location);
}
