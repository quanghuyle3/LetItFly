package com.project.LetItFly.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    private int id;
    private String email;
    private String roleName;
    private String token;
    private String firstName;
    private String lastName;
}
