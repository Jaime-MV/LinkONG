package com.example.LinkONG.repository;

import com.example.LinkONG.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByTitleContainingIgnoreCase(String title);
    List<Project> findByNgoId(Long ngoId);
    List<Project> findByStatus(String status);
}
