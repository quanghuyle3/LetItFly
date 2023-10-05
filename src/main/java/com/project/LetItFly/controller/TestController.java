package com.project.LetItFly.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.UserRequest;
import com.project.LetItFly.service.RoleService;
import com.project.LetItFly.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class TestController {

    private UserService userService;
    private RoleService roleService;
    // private Principal principal;

    @Autowired
    public TestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
        // this.principal = principal;
    }

    // 4 methods for User work
    @GetMapping("/retrieveAllUser")
    public List<User> retrieveAllUser() {
        return userService.findAllUsers();
    }

    @GetMapping("/findUser")
    public User findUser(@RequestParam("id") int id) {
        return userService.findUserById(id);
    }

    @PostMapping("/saveUser")
    public String saveUser(@RequestBody UserRequest userRequest) {
        return userService.saveUser(userRequest);
    }

    @PostMapping("/updateUser")
    public String updateUser(@RequestBody UserRequest userRequest) {
        return userService.updateUser(userRequest);
    }

    // Methods for role work

    @GetMapping("/role")
    public List<Role> retrieveAllRoles() {
        return roleService.findAllRoles();
    }

    @GetMapping("/sessionUser")
    public Principal getPrincipal(Principal principal) {
        return principal;
    }

    @PostMapping("/api")
    public String testPost(@RequestBody User user) {
        return "String";
    }

}
