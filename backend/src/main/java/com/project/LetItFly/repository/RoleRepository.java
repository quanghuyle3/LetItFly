package com.project.LetItFly.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    Role findRoleByName(String name);

}
