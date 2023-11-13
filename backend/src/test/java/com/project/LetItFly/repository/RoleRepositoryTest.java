package com.project.LetItFly.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.project.LetItFly.model.Role;

@DataJpaTest
public class RoleRepositoryTest {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void testFindRoleByName() {
        // given
        Role role = Role.builder().name("Sample Role").build();
        role = roleRepository.save(role);

        // when
        Role retrievedRole = roleRepository.findRoleByName("Sample Role");

        // then
        assertThat(retrievedRole).isEqualTo(role);
    }
}
