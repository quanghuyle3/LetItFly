package com.project.LetItFly.controller;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
import com.project.LetItFly.requestModel.UserRequest;
import com.project.LetItFly.service.UserService;

@WebMvcTest(controllers = CheckController.class)
@AutoConfigureMockMvc(addFilters = false) // no more worry about token and security
@ExtendWith(MockitoExtension.class)
public class CheckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // prevent error "Failed to inject JwtAuthenticationFilter"

    @Autowired
    private ObjectMapper objectMapper;

    private User user;

    @BeforeEach
    private void init() {
        user = User.builder().id(5).email("sampleemail@gmail.com").password("Test123456")
                .driverLicense("U786374").build();
    }

    @Test
    void testCheckDriverLicenseExist_NOTEXIST() throws Exception {
        // when
        when(userService.findUserByDriverLicense(user.getDriverLicense())).thenReturn(null);
        ResultActions response = mockMvc.perform(get("/api/check/driverLicense")
                .contentType(MediaType.APPLICATION_JSON)
                .param("driverLicense", user.getDriverLicense()));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
        String responseBody = response.andReturn().getResponse().getContentAsString();
        assertThat(responseBody).isEqualTo("NOT EXIST");

    }

    @Test
    void testCheckDriverLicenseExist_EXIST() throws Exception {
        // when
        when(userService.findUserByDriverLicense(user.getDriverLicense())).thenReturn(user);
        ResultActions response = mockMvc.perform(get("/api/check/driverLicense")
                .contentType(MediaType.APPLICATION_JSON)
                .param("driverLicense", user.getDriverLicense()));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
        String responseBody = response.andReturn().getResponse().getContentAsString();
        assertThat(responseBody).isEqualTo("EXIST");

    }

    @Test
    void testCheckEmailExist_EXIST() throws Exception {
        // when
        when(userService.findUserByEmail(user.getEmail())).thenReturn(user);
        ResultActions response = mockMvc.perform(get("/api/check/email")
                .contentType(MediaType.APPLICATION_JSON)
                .param("email", user.getEmail()));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
        String responseBody = response.andReturn().getResponse().getContentAsString();
        assertThat(responseBody).isEqualTo("EXIST");

    }

    @Test
    void testCheckEmailExist_NOTEXIST() throws Exception {
        // when
        when(userService.findUserByEmail(user.getEmail())).thenReturn(null);
        ResultActions response = mockMvc.perform(get("/api/check/email")
                .contentType(MediaType.APPLICATION_JSON)
                .param("email", user.getEmail()));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
        String responseBody = response.andReturn().getResponse().getContentAsString();
        assertThat(responseBody).isEqualTo("NOT EXIST");

    }
}
