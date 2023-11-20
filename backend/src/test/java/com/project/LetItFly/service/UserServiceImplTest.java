package com.project.LetItFly.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

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

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void testFindAllUsers() {
        // when
        userService.findAllUsers();
        // then
        verify(userRepository).findAll();
    }

    @Test
    void testFindUserByDriverLicense() {
        // when
        userService.findUserByDriverLicense(Mockito.anyString());
        // then
        verify(userRepository).findUserByDriverLicense(Mockito.anyString());

    }

    @Test
    void testFindUserByEmail() {
        // when
        userService.findUserByEmail(Mockito.anyString());
        // then
        verify(userRepository).findUserByEmail(Mockito.anyString());
    }

    @Test
    void testFindUserById() {
        // when
        userService.findUserById(Mockito.anyInt());
        // then
        verify(userRepository).findUserById(Mockito.anyInt());
    }

    @Test
    void testFindUsersHold2Roles() {
        // given
        Role role1 = new Role();
        Role role2 = new Role();
        // when
        when(roleRepository.findAll()).thenReturn(Arrays.asList(role1, role2));
        userService.findUsersHold2Roles();
        // then
        verify(userRepository).findUsersByTwoRoles(role1, role2);

    }

    @Test
    void testPasswordEncoder() {
        PasswordEncoder p = userService.passwordEncoder();
        assertThat(p).isNotNull();
    }

    // @Test
    // void testRegistration() {
    //     // given
    //     RegistrationRequest registrationRequest = RegistrationRequest.builder().email("sample@gmail.com")
    //             .password("Test123456")
    //             .roleName("ROLE_DRIVER")
    //             .cardNumber("1237896257").expiration("12/2025").cvv(123)
    //             .licensePlate("8JHY682").make("honda").model("accord").year(2023)
    //             .build();

    //     // when
    //     userService.registration(registrationRequest);

    //     // then
    //     ArgumentCaptor<User> userArgCaptor = ArgumentCaptor.forClass(User.class);
    //     ArgumentCaptor<Payment> paymentArgCaptor = ArgumentCaptor.forClass(Payment.class);
    //     ArgumentCaptor<Vehicle> vehicleArgCaptor = ArgumentCaptor.forClass(Vehicle.class);

    //     verify(userRepository).save(userArgCaptor.capture());
    //     verify(paymentRepository).save(paymentArgCaptor.capture());
    //     verify(vehicleRepository).save(vehicleArgCaptor.capture());

    //     assertThat(userArgCaptor.getValue().getEmail()).isEqualTo("sample@gmail.com");
    //     assertThat(paymentArgCaptor.getValue().getCardNumber()).isEqualTo("1237896257");
    //     assertThat(vehicleArgCaptor.getValue().getLicensePlate()).isEqualTo("8JHY682");

    // }

    @Test
    void testSaveUser() {
        // given
        UserRequest userRequest = UserRequest.builder().email("sample@gmail.com").password("Test123456")
                .roleName("Sample Role").build();

        // when
        userService.saveUser(userRequest);

        // then
        verify(userRepository).save(Mockito.any(User.class));
    }

    @Test
    void testUpdateUser_UPDATED() {
        // given
        UserRequest userRequest = UserRequest.builder().email("sample@gmail.com").password("Test123456")
                .roleName("Sample Role").build();
        User user = User.builder().email("sample@gmail.com").password("Test123456")
                .build();

        // when
        when(userRepository.findUserByEmail(userRequest.getEmail())).thenReturn(user);
        String result = userService.updateUser(userRequest);

        // then
        verify(userRepository).save(Mockito.any(User.class));
        assertThat(result).isEqualTo("UPDATED");

    }

    @Test
    void testUpdateUser_NOTEXIST() {
        // given
        UserRequest userRequest = UserRequest.builder().email("sample@gmail.com").password("Test123456")
                .roleName("Sample Role").build();

        // when
        when(userRepository.findUserByEmail(userRequest.getEmail())).thenReturn(null);
        String result = userService.updateUser(userRequest);

        // then
        verify(userRepository, never()).save(Mockito.any(User.class));
        assertThat(result).isEqualTo("NOT EXIST");

    }
}
