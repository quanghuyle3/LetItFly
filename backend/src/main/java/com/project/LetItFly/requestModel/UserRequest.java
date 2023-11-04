package com.project.LetItFly.requestModel;

import java.util.Collection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

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

    private boolean active = true;

    private boolean verified;

    private String roleName;

}
