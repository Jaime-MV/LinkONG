package com.example.LinkONG.repository;

import com.example.LinkONG.model.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    List<Volunteer> findByFullNameContainingIgnoreCase(String fullName);
    List<Volunteer> findByStatus(String status);
}
