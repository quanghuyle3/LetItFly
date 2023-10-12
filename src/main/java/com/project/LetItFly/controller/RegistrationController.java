package com.project.LetItFly.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;
import com.project.LetItFly.model.Vehicle;
import com.project.LetItFly.requestModel.PaymentRequest;
import com.project.LetItFly.requestModel.UserRequest;
import com.project.LetItFly.requestModel.VehicleRequest;
import com.project.LetItFly.service.PaymentService;
import com.project.LetItFly.service.RoleService;
import com.project.LetItFly.service.UserService;
import com.project.LetItFly.service.VehicleService;

@RestController
@CrossOrigin
@RequestMapping("/registration")
public class RegistrationController {

    private UserService userService;
    private RoleService roleService;
    private PaymentService paymentService;
    private VehicleService vehicleService;

    @Autowired
    public RegistrationController(UserService userService, RoleService roleService, PaymentService paymentService,
            VehicleService vehicleService) {
        this.userService = userService;
        this.roleService = roleService;
        this.paymentService = paymentService;
        this.vehicleService = vehicleService;
    }

    @PostMapping("/user")
    public User registerUser(@RequestBody UserRequest userRequest) {
        return userService.saveUser(userRequest);
    }

    @PostMapping("/payment")
    public Payment registerPayment(@RequestBody PaymentRequest paymentRequest) {
        return paymentService.savePayment(paymentRequest);

    }

    @PostMapping("/vehicle")
    public Vehicle registerVehicle(@RequestBody VehicleRequest vehicleRequest) {
        return vehicleService.saveVehicle(vehicleRequest);

    }
}
