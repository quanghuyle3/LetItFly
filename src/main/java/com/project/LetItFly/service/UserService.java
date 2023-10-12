package com.project.LetItFly.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.UserRequest;

public interface UserService extends UserDetailsService {

    public List<User> findAllUsers();

    public User findUserById(int id);

    public User findUserByEmail(String email);

    public List<User> findUsersHold2Roles();

    // public String saveUser(User user);

    public User saveUser(UserRequest userRequest);

    public String updateUser(UserRequest userRequest);
}
