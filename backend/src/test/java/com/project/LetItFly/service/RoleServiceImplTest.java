package com.project.LetItFly.service;

import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.LetItFly.repository.RoleRepository;

@ExtendWith(MockitoExtension.class)
public class RoleServiceImplTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleServiceImpl roleService;

    @Test
    void testFindAllRoles() {
        // when
        roleService.findAllRoles();
        // then
        verify(roleRepository).findAll();
    }

    @Test
    void testFindByName() {
        // when
        roleService.findByName(Mockito.anyString());
        // then
        verify(roleRepository).findRoleByName(Mockito.anyString());

    }
}
