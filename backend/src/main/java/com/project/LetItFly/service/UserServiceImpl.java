package com.project.LetItFly.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;
import com.project.LetItFly.model.Vehicle;
import com.project.LetItFly.repository.PaymentRepository;
import com.project.LetItFly.repository.RoleRepository;
import com.project.LetItFly.repository.UserRepository;
import com.project.LetItFly.repository.VehicleRepository;
import com.project.LetItFly.requestModel.RegistrationRequest;
import com.project.LetItFly.requestModel.UserRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PaymentRepository paymentRepository;
    private final VehicleRepository vehicleRepository;

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // ASSUME THAT USERNAME HAS ALREADY BEEN CHECKED THAT IS NOT EXISTED YET
    @Override
    public User saveUser(UserRequest userRequest) {

        // convert to user
        User user = new User(userRequest);

        // encrypt password and save it
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        if (userRequest.getRoleName() != null) {
            Role role = roleRepository.findRoleByName(userRequest.getRoleName());
            user.addRole(role);
        }

        // save to db
        return userRepository.save(user);
    }

    @Override
    public User findUserById(int id) {
        return userRepository.findUserById(id);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public String updateUser(UserRequest userRequest) {

        User exist = userRepository.findUserByEmail(userRequest.getEmail());
        if (exist == null) {
            return "NOT EXIST";
        }

        // update new infor (address and phone only) (added new role if needed)
        // exist.setFirstName(userRequest.getFirstName());
        // exist.setLastName(userRequest.getLastName());
        // exist.setBirthdate(userRequest.getBirthdate());
        // exist.setGender(userRequest.getGender());
        exist.setAddress(userRequest.getAddress());
        exist.setPhone(userRequest.getPhone());
        // exist.setDateJoin(userRequest.getDateJoin());
        // exist.setActive(userRequest.isActive());
        // exist.setVerified(userRequest.isVerified());

        // add new role to this current user if not have yet
        if (userRequest.getRoleName() != null) {
            Role role = roleRepository.findRoleByName(userRequest.getRoleName());
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

    @Override
    public List<User> findUsersHold2Roles() {
        List<Role> roles = roleRepository.findAll();
        return userRepository.findUsersByTwoRoles(roles.get(0), roles.get(1));
    }

    @Override
    public User findUserByDriverLicense(String driverLicense) {
        return userRepository.findUserByDriverLicense(driverLicense);
    }

    @Override
    public User registration(RegistrationRequest registrationRequest) {
        // convert registrationRequest to user
        User user = new User(registrationRequest);

        // encrypt password and save it
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

        String roleRequest = registrationRequest.getRoleName();

        if (roleRequest != null) {
            Role role = roleRepository.findRoleByName(roleRequest);
            user.addRole(role);
        }

        // SAVE USER to db, afterthat user returned will have the id in database
        user = userRepository.save(user);

        // convert registrationRequest to payment
        Payment payment = new Payment(registrationRequest);

        // link payment to user
        payment.setUserId(user);

        // SAVE PAYMENT to database
        payment = paymentRepository.save(payment);

        // SAVE VEHICLE to database (if needed)
        if (roleRequest.equals("ROLE_DRIVER")) {
            // convert registrationRequest to vehicle
            Vehicle vehicle = new Vehicle(registrationRequest);

            // link vehicle to user
            vehicle.setUserId(user);

            // save vehicle to database
            vehicle = vehicleRepository.save(vehicle);
        }

        return user;

    }
}
