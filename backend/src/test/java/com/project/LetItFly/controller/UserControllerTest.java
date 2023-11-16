package com.project.LetItFly.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
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
import com.project.LetItFly.requestModel.UserRequest;
import com.project.LetItFly.service.UserService;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false) // no more worry about token and security
@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // prevent error "Failed to inject JwtAuthenticationFilter"

    @Autowired
    private ObjectMapper objectMapper;

    private UserRequest userRequest;
    private User user;

    @BeforeEach
    private void init() {
        // given
        userRequest = UserRequest.builder().email("sample@gmail.com").password("Test123456")
                .build();

        user = User.builder().email("sample@gmail.com").password("Test123456")
                .build();
    }

    @Test
    void testFindByEmail() throws Exception {
        // when
       when(userService.findUserByEmail(Mockito.anyString())).thenReturn(user);
        ResultActions response = mockMvc.perform(get("/api/user/findByEmail")
                .contentType(MediaType.APPLICATION_JSON)
                .param("email", user.getEmail()));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testFindById() throws Exception {
        // when
       when(userService.findUserById(Mockito.anyInt())).thenReturn(user);
        ResultActions response = mockMvc.perform(get("/api/user/findById")
                .contentType(MediaType.APPLICATION_JSON)
                .param("id", "2"));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testUpdateUser() throws Exception {
        // when
        ResultActions response = mockMvc.perform(post("/api/user/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userRequest)));

        // then
        verify(userService).updateUser(userRequest);
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }
}
