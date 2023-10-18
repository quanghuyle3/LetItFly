package com.project.LetItFly.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/check")
public class CheckController {

    private final UserService userService;

    @GetMapping("/email")
    public String checkEmailExist(@RequestParam("email") String email) {
        return userService.findUserByEmail(email) != null ? "EXIST" : "NOT EXIST";
    }

    @GetMapping("/driverLicense")
    public String checkDriverLicenseExist(@RequestParam("driverLicense") String driverLicense) {
        return userService.findUserByDriverLicense(driverLicense) != null ? "EXIST" : "NOT EXIST";
    }

}
