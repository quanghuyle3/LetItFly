package com.project.LetItFly.controller;

import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.configuration.JwtService;
import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.AuthenticationRequest;
import com.project.LetItFly.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class LoginController {

    public final UserService userService;
    public final JwtService jwtService;
    public final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest authRequest) {

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                authRequest.getEmail(), authRequest.getPassword());
        try {
            Authentication authentication = authenticationManager.authenticate(token);

            User user = userService.findUserByEmail(authRequest.getEmail());

            List<Role> roles = user.getRoles();

            String jwt = jwtService.generateToken(user);
            return ResponseEntity.ok(
                    new AuthenticationResponse().builder().id(user.getId()).email(user.getEmail())
                            .roleName(roles.get(0).getName()).token(jwt).build());

        } catch (BadCredentialsException m) {
            return ResponseEntity.status(HttpStatusCode.valueOf(401)) // unauthorized
                    .body(new AuthenticationResponse());
        } catch (DisabledException m) {
            return ResponseEntity.status(HttpStatusCode.valueOf(403)) // forbidden
                    .body(new AuthenticationResponse());
        } catch (LockedException m) {
            return ResponseEntity.status(HttpStatusCode.valueOf(423)) // locked
                    .body(new AuthenticationResponse());
        }
    }
}
