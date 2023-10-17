package com.project.LetItFly.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.configuration.JwtService;
import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.UserRequest;
import com.project.LetItFly.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class RegistrationController {

    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/registration")
    public ResponseEntity<String> registration(@RequestBody UserRequest userRequest) {
        User user = userService.saveUser(userRequest);
        String jwt = jwtService.generateToken(user);
        return ResponseEntity.ok("CREATED");
        // return new ResponseEntity(HttpStatusCode.valueOf(200));
    }
}
