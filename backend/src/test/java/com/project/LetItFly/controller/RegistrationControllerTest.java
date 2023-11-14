package com.project.LetItFly.controller;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.LetItFly.configuration.JwtAuthenticationFilter;
import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.RegistrationRequest;
import com.project.LetItFly.service.DriverStatusService;
import com.project.LetItFly.service.UserService;

@WebMvcTest(controllers = RegistrationController.class)
@AutoConfigureMockMvc(addFilters = false) // no more worry about token and security
@ExtendWith(MockitoExtension.class)
public class RegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // prevent error "Failed to inject JwtAuthenticationFilter"

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegistration_SUCCESS() throws Exception {
        // given
        RegistrationRequest registrationRequest = RegistrationRequest.builder().roleName("ROLE_PASSENGER")
                .email("sample@gmail.com")
                .password("Test123456")
                .cardNumber("1785637892").expiration("12/2025").cvv(123)
                .licensePlate("8YYY782").make("honda")
                .build();

        // when
        // when(userService.findUserByEmail(Mockito.anyString())).thenReturn(null);
        // when(registrationRequest.ge)
        ResultActions response = mockMvc.perform(post("/registration/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
        String responseBody = response.andReturn().getResponse().getContentAsString();
        assertThat(responseBody).isEqualTo("SUCCESS");

    }

    @Test
    void testRegistration_EXISTED_EMAIL() throws Exception {
        // given
        RegistrationRequest registrationRequest = RegistrationRequest.builder().roleName("ROLE_PASSENGER")
                .email("sample@gmail.com")
                .password("Test123456")
                .cardNumber("1785637892").expiration("12/2025").cvv(123)
                .licensePlate("8YYY782").make("honda")
                .build();
        User user = User.builder().email("sample@gmail.com").password("Test123456")
                .build();

        // when
        when(userService.findUserByEmail(Mockito.anyString())).thenReturn(user);
        // when(registrationRequest.ge)
        ResultActions response = mockMvc.perform(post("/registration/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().isFound());
        String responseBody = response.andReturn().getResponse().getContentAsString();
        assertThat(responseBody).isEqualTo("EXISTED EMAIL");

    }

    @Test
    void testRegistration_EXISTED_DRIVER_LICENSE() throws Exception {
        // given
        RegistrationRequest registrationRequest = RegistrationRequest.builder().roleName("ROLE_DRIVER")
                .driverLicense("U893784")
                .email("sample@gmail.com")
                .password("Test123456")
                .cardNumber("1785637892").expiration("12/2025").cvv(123)
                .licensePlate("8YYY782").make("honda")
                .build();
        User user = User.builder().email("sample@gmail.com").password("Test123456")
                .build();

        // when
        when(userService.findUserByDriverLicense(Mockito.anyString())).thenReturn(user);
        ResultActions response = mockMvc.perform(post("/registration/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().is(323));
        String responseBody = response.andReturn().getResponse().getContentAsString();
        assertThat(responseBody).isEqualTo("EXISTED DRIVER LICENSE");

    }
}
