package com.project.LetItFly.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;
import com.project.LetItFly.repository.RoleRepository;
import com.project.LetItFly.repository.UserRepository;
import com.project.LetItFly.requestModel.UserRequest;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // This method is used by Spring Security (Authentication provider)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByEmail(username);

        if (user == null) {
            throw new UsernameNotFoundException("Couldn't find user with email: " +
                    username);
        }

        // Create a UserDetails object with custome properties
        CustomUserDetails userDetails = new CustomUserDetails(user);
        return userDetails;

        // return new
        // org.springframework.security.core.userdetails.User(user.getEmail(),
        // user.getPassword(),
        // new ArrayList<SimpleGrantedAuthority>());
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // @Override
    // public String saveUser(User user) {

    // // User exist = userRepository.findByEmail(user.getEmail());
    // // if (exist != null) {

    // // // get role name request and set Role to it
    // // // String roleName = user.getRoles();

    // return userRepository.save(user);
    // // return "success";
    // // }

    // // else {
    // // return "existed";
    // // }
    // }

    @Override
    public String saveUser(UserRequest userRequest) {
        User exist = userRepository.findUserByEmail(userRequest.getEmail());
        if (exist != null) {
            // return roleService.findByName("ROLE_DRIVER");
            return "EXIST";
            // return exist;
        }

        // convert to user
        User user = new User(userRequest);

        // encrypt password and save it
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        if (userRequest.getRoleName() != null) {
            List<Role> roles = roleRepository.findByName(userRequest.getRoleName());
            user.addRole(roles.get(0));
        }

        // save to db
        userRepository.save(user);

        // return roleService.findByName(user.getRoleName());
        // return "OUTSIDE";
        return "SUCCESS";
    }

    @Override
    public User findUserById(int id) {
        return userRepository.findById(id);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public String updateUser(UserRequest userRequest) {
        User exist = userRepository.findUserByEmail(userRequest.getEmail());
        if (exist == null) {
            // return roleService.findByName("ROLE_DRIVER");
            return "NOT EXIST";
            // return exist;
        }

        // update to new infor
        exist.setFirstName(userRequest.getFirstName());
        exist.setLastName(userRequest.getLastName());
        exist.setBirthdate(userRequest.getBirthdate());
        exist.setGender(userRequest.getGender());
        exist.setAddress(userRequest.getAddress());
        exist.setPhone(userRequest.getPhone());
        exist.setDateJoin(userRequest.getDateJoin());
        exist.setActive(userRequest.isActive());
        exist.setVerified(userRequest.isVerified());

        // add new role to this current user if not have yet
        if (userRequest.getRoleName() != null) {
            Role role = roleRepository.findByName(userRequest.getRoleName()).get(0);
            boolean notAdded = true;
            for (Role existingRole : exist.getRoles()) {
                if (existingRole.getName().equals(role.getName())) {
                    notAdded = false;
                    break;
                }
            }
            if (notAdded) {
                exist.addRole(role);
            }
        }
        userRepository.save(exist);
        return "UPDATED";
    }

}
