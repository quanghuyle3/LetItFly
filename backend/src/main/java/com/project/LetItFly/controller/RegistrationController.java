package com.project.LetItFly.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.configuration.JwtService;
import com.project.LetItFly.model.User;
import com.project.LetItFly.model.Vehicle;
import com.project.LetItFly.requestModel.PaymentRequest;
import com.project.LetItFly.requestModel.RegistrationRequest;
import com.project.LetItFly.requestModel.UserRequest;
import com.project.LetItFly.requestModel.VehicleRequest;
import com.project.LetItFly.service.PaymentService;
import com.project.LetItFly.service.UserService;

import lombok.RequiredArgsConstructor;
import com.project.LetItFly.service.VehicleService;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/registration")
public class RegistrationController {

    private final UserService userService;

    @PostMapping("/user")
    public ResponseEntity<String> registration(@RequestBody RegistrationRequest registrationRequest) {
        // check email and driver license
        if (userService.findUserByEmail(registrationRequest.getEmail()) != null) {
            return new ResponseEntity<String>("EXISTED EMAIL", HttpStatusCode.valueOf(302)); // STATUS: FOUND
        }

        if (registrationRequest.getRoleName().equals("ROLE_DRIVER")
                && userService.findUserByDriverLicense(registrationRequest.getDriverLicense()) != null) {
            return new ResponseEntity<String>("EXISTED DRIVER LICENSE", HttpStatusCode.valueOf(323)); // STATUS: FOUND
        }

        // save all objects to database
        userService.registration(registrationRequest);

        return new ResponseEntity<String>("SUCCESS", HttpStatusCode.valueOf(200));
    }
}
