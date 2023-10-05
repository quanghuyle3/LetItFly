package com.project.LetItFly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    List<Role> findByName(String name);

    @Query("SELECT r FROM Role r WHERE r.name = :customValue")
    List<Role> findByCustomCriteria(String customValue);

    // find and also fetch lazy attribute
    // @EntityGraph(attributePaths = "yourLazyAttribute")
    // List<Role> findByCustomCriteria(String customValue);

    // Add custom query methods here if needed

}
