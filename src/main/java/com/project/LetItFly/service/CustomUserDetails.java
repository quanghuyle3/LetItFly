package com.project.LetItFly.service;

import com.project.LetItFly.model.User;

public class CustomUserDetails extends org.springframework.security.core.userdetails.User {
    // public class CustomUserDetails {
    private final int id;
    private final String firstName;

    public CustomUserDetails(User user) {
        // super(user.getEmail(), user.getPassword(),
        // user.mapRolesToAuthorities(user.getRoles()));
        // super(user.getEmail(), user.getPassword(), true, false, false,
        // user.mapRolesToAuthorities(user.getRoles()));
        super(user.getEmail(), user.getPassword(), true, true, true, true,
                user.mapRolesToAuthorities(user.getRoles()));
        // super(user.getEmail(), user.getPassword(), null);
        this.id = user.getId();
        this.firstName = user.getFirstName();
    }

    public int getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

}
