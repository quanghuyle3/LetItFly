package com.project.LetItFly.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.UserRequest;
import com.project.LetItFly.service.RoleService;
import com.project.LetItFly.service.UserService;

@RestController
@CrossOrigin
public class RegistrationController {

    public UserService userService;
    public RoleService roleService;

    @Autowired
    public RegistrationController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostMapping("/registration")
    public String registration(@RequestBody UserRequest userRequest) {
        return userService.saveUser(userRequest);
    }
}
