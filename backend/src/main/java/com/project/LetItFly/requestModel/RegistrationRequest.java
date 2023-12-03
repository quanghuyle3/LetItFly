package com.project.LetItFly.requestModel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationRequest {

    // User basic
    private int id;

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private String birthdate;

    private String gender;

    private String address;

    private String phone;

    private String dateJoin;

    private String driverLicense;

    private boolean active = false;

    private boolean verified;

    private String roleName;

    // Payment basic
    private String cardNumber;

    private String expiration;

    private int cvv;

    private String paymentType;

    // private int userId;

    private String name;

    private String billingAddress;

    private boolean paymentInUse = true;

    private double balance;

    // Vehicle basic

    private String licensePlate;

    private String make;

    private String model;

    private int year;

    private String vehicleType;

    private boolean vehicleInUse = true;

}
