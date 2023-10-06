package com.project.LetItFly.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.HistoryLog;
import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.UserRequest;
import com.project.LetItFly.service.HistoryLogService;
import com.project.LetItFly.service.RoleService;
import com.project.LetItFly.service.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class TestController {

    private UserService userService;
    private RoleService roleService;
    private HistoryLogService historyLogService;
    // private Principal principal;

    @Autowired
    public TestController(UserService userService, RoleService roleService, HistoryLogService historyLogService) {
        this.userService = userService;
        this.roleService = roleService;
        this.historyLogService = historyLogService;
        // this.principal = principal;
    }

    // USER
    @GetMapping("/retrieveAllUsers")
    public List<User> retrieveAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/findUser")
    public User findUser(@RequestParam("id") int id) {
        return userService.findUserById(id);
    }

    @GetMapping("findUserByEmail")
    public User findUserByEmail(@RequestParam("email") String email) {
        return userService.findUserByEmail(email);
    }

    @GetMapping("/findUsersHold2Roles")
    public List<User> retrieveAllUsersHold2Roles() {
        return userService.findUsersHold2Roles();
    }

    @PostMapping("/saveUser")
    public String saveUser(@RequestBody UserRequest userRequest) {
        return userService.saveUser(userRequest);
    }

    @PostMapping("/updateUser")
    public String updateUser(@RequestBody UserRequest userRequest) {
        return userService.updateUser(userRequest);
    }

    @GetMapping("/sessionUser")
    public Principal getPrincipal(Principal principal) {
        return principal;
    }

    // ROLE

    @GetMapping("/retrieveAllRoles")
    public List<Role> retrieveAllRoles() {
        return roleService.findAllRoles();
    }

    @GetMapping("/findRole")
    public Role findRole(@RequestParam("roleName") String roleName) {
        return roleService.findByName(roleName);
    }

    // HISTORY LOG

    @GetMapping("/retrieveAllHistoryLog")
    public List<HistoryLog> retriveAllHistoryLogs() {
        return historyLogService.findAllHistoryLog();
    }

    @GetMapping("/findHistoryLog")
    public HistoryLog findHistoryLog(@RequestParam("id") int id) {
        return historyLogService.findHistoryLogById(id);
    }

    @GetMapping("/findHistoryLogsByDriverId")
    public List<HistoryLog> findHistoryLogsByDriverId(@RequestParam("id") int id) {
        return historyLogService.findHistoryLogsByDriverId(id);
    }

    @GetMapping("/findHistoryLogsByPassengerId")
    public List<HistoryLog> findHistoryLogsByPassengerId(@RequestParam("id") int id) {
        return historyLogService.findHistoryLogsByPassengerId(id);
    }

}
