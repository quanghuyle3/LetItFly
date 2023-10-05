package com.project.LetItFly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // works - Find a user that has this id
    public User findUserById(int id);

    // works - Find a user that has the matching email
    public User findUserByEmail(String email);

    // works - Find all users that hold a specific role object
    public List<User> findUsersByRoles(Role role);

    // works - Find all users that hold two role objects (ROLE_DRIVER,
    // ROLE_PASSENGER)
    @Query("SELECT u FROM User u WHERE :role1 MEMBER OF u.roles AND :role2 MEMBER OF u.roles")
    List<User> findUsersByTwoRoles(@Param("role1") Role role1, @Param("role2") Role role2);

    // not working
}
