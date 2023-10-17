package com.project.LetItFly.controller;

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

            String jwt = jwtService.generateToken(user);
            return ResponseEntity.ok(new AuthenticationResponse().builder().token(jwt).build());

        } catch (BadCredentialsException m) {
            return ResponseEntity.status(HttpStatusCode.valueOf(401))
                    .body(new AuthenticationResponse("Invalid username or password"));
        } catch (DisabledException m) {
            return ResponseEntity.status(HttpStatusCode.valueOf(403))
                    .body(new AuthenticationResponse("Account is disabled."));
        } catch (LockedException m) {
            return ResponseEntity.status(HttpStatusCode.valueOf(423))
                    .body(new AuthenticationResponse("Account is locked."));
        }
    }
}
