package com.project.LetItFly.service;

import java.util.List;

import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.RegistrationRequest;
import com.project.LetItFly.requestModel.UserRequest;

// public interface UserService extends UserDetailsService {
public interface UserService {

    public List<User> findAllUsers();

    public User findUserById(int id);

    public User findUserByEmail(String email);

    public List<User> findUsersHold2Roles();

    // public String saveUser(User user);

    public User saveUser(UserRequest userRequest);

    public String updateUser(UserRequest userRequest);

    public User findUserByDriverLicense(String driverLicense);

    public User registration(RegistrationRequest registrationRequest);
}
