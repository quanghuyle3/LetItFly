package com.project.LetItFly.service;

import java.util.List;

import com.project.LetItFly.model.Role;

public interface RoleService {
    public List<Role> findAllRoles();

    public Role findByName(String name);

}
