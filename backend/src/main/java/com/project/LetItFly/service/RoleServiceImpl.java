package com.project.LetItFly.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.LetItFly.model.Role;
import com.project.LetItFly.repository.RoleRepository;

@Service
public class RoleServiceImpl implements RoleService {

    private RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> findAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role findByName(String name) {
        Role role = roleRepository.findRoleByName(name);
        return role != null ? role : null;
    }

}
