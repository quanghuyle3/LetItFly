package com.project.LetItFly.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.project.LetItFly.requestModel.RegistrationRequest;
import com.project.LetItFly.requestModel.UserRequest;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "`user`")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "birthdate")
    private String birthdate;

    @Column(name = "gender")
    private String gender;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "date_join")
    private String dateJoin;

    @Column(name = "driver_license")
    private String driverLicense;

    @Column(name = "active")
    private boolean active = true;

    @Column(name = "verified")
    private boolean verified;

    @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH })
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> roles;

    public User(String email, String password, String firstName, String lastName, String birthdate,
            String gender, String address, String phone, String dateJoin, String driverLicense, boolean active,
            boolean verified) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
        this.gender = gender;
        this.address = address;
        this.phone = phone;
        this.dateJoin = dateJoin;
        this.driverLicense = driverLicense;
        this.active = active;
        this.verified = verified;
    }

    public User(UserRequest user) {
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.birthdate = user.getBirthdate();
        this.gender = user.getGender();
        this.address = user.getAddress();
        this.phone = user.getPhone();
        this.dateJoin = user.getDateJoin();
        this.driverLicense = user.getDriverLicense();
        this.active = user.isActive();
        this.verified = user.isVerified();
    }

    public User(RegistrationRequest registrationRequest) {
        this.email = registrationRequest.getEmail();
        this.password = registrationRequest.getPassword();
        this.firstName = registrationRequest.getFirstName();
        this.lastName = registrationRequest.getLastName();
        this.birthdate = registrationRequest.getBirthdate();
        this.gender = registrationRequest.getGender();
        this.address = registrationRequest.getAddress();
        this.phone = registrationRequest.getPhone();
        this.dateJoin = registrationRequest.getDateJoin();
        this.driverLicense = registrationRequest.getDriverLicense();
        this.active = registrationRequest.isActive();
        this.verified = registrationRequest.isVerified();
    }

    public List<Role> getRoles() {
        if (roles == null) {
            roles = new ArrayList<>();
        }
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public void addRole(Role role) {
        getRoles().add(role);
    }

    // public Collection<SimpleGrantedAuthority> mapRolesToAuthorities(List<Role>
    // roles) {
    // Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();

    // for (Role role : roles) {
    // SimpleGrantedAuthority tempAuthority = new
    // SimpleGrantedAuthority(role.getName());
    // authorities.add(tempAuthority);
    // }

    // return authorities;
    // }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();

        for (Role role : roles) {
            SimpleGrantedAuthority tempAuthority = new SimpleGrantedAuthority(role.getName());
            authorities.add(tempAuthority);
        }

        return authorities;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
