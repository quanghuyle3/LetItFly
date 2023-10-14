package com.project.LetItFly.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.User;
import com.project.LetItFly.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin
public class LoginController {

    @Autowired
    public DaoAuthenticationProvider daoAuthenticationProvider;

    @Autowired
    public UserService userService;

    // @Autowired
    // public SecurityContextHolderStrategy securityContextHolderStrategy;

    @Autowired
    public LoginController() {
        // this.securityContextRepository = securityContextRepository;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(daoAuthenticationProvider);
    }

    @PostMapping("/login")
    public Object login(@RequestBody User user, HttpServletRequest request,
            HttpServletResponse response, Principal principal) {
        // Create an authentication token with the provided username and password
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                user.getEmail(), user.getPassword());

        Authentication authentication;
        try {
            authentication = authenticationManager().authenticate(token);
        } catch (BadCredentialsException m) {
            return "BAD CREDENTIALS EXCEPTION";
        } catch (DisabledException m) {
            return "DISACBLE EXCEPTION";
        } catch (LockedException m) {
            return "LOCKED EXCEPTION";
        }

        // Set the authenticated authentication object in the SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        // // Save the SecurityContext to the SecurityContextRepository
        // securityContextRepository.saveContext(context, request, response);

        // this.securityContextHolderStrategy.setContext(context);

        // // Set the authentication result to the SecurityContext
        // SecurityContextHolder.getContext().setAuthentication(authentication);
        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                context);
        return authentication.getPrincipal();
    }
}
