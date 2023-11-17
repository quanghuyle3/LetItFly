package com.project.LetItFly.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.Arrays;

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
import com.project.LetItFly.model.DriverStatus;
import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.DriverStatusRequest;
import com.project.LetItFly.service.DriverStatusService;

@WebMvcTest(controllers = DriverStatusController.class)
@AutoConfigureMockMvc(addFilters = false) // no more worry about token and security
@ExtendWith(MockitoExtension.class)
public class DriverStatusControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DriverStatusService driverStatusService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // prevent error "Failed to inject JwtAuthenticationFilter"

    @Autowired
    private ObjectMapper objectMapper;

    private User user;
    private DriverStatus driverStatus;
    private DriverStatusRequest driverStatusRequest;

    @BeforeEach
    private void init() {
        user = User.builder().id(2).email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        driverStatus = DriverStatus.builder().id(5).userId(user).curLat(-37.9862).curLong(120.85733).build();
        driverStatusRequest = DriverStatusRequest.builder().id(5).curLat(-37.9862).curLong(120.85733)
                .build();
    }

    @Test
    void testDeleteByDriverId() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/driver-status/deleteByDriverId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("driverId", "2"));

        // then
        verify(driverStatusService).deleteByDriverId(2);
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testFindAll() throws Exception {
         // when
       when(driverStatusService.findAllDriverStatus()).thenReturn(Arrays.asList(driverStatus));
        ResultActions response = mockMvc.perform(get("/api/driver-status/findAll")
                .contentType(MediaType.APPLICATION_JSON));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testFindByDriverId() throws Exception {
        // when
       when(driverStatusService.findDriverStatusByUserId(user.getId())).thenReturn(driverStatus);
        ResultActions response = mockMvc.perform(get("/api/driver-status/findByDriverId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("driverId", "2"));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testFindById() throws Exception {
         // when
       when(driverStatusService.findDriverStatusByUserId(user.getId())).thenReturn(driverStatus);
        ResultActions response = mockMvc.perform(get("/api/driver-status/findById")
                .contentType(MediaType.APPLICATION_JSON)
                .param("id", "2"));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testSave() throws Exception {
        // when
        ResultActions response = mockMvc.perform(post("/api/driver-status/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(driverStatusRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testUpdateCoordinatesDriver() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/driver-status/updateCoordinatesDriver")
                .contentType(MediaType.APPLICATION_JSON)
                .param("driverId", "2")
                .param("curLat", "34.899")
                .param("curLong", "120.9433"));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testUpdateDispatchStatus() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/driver-status/updateDispatchStatus")
                .contentType(MediaType.APPLICATION_JSON)
                .param("driverId", "2")
                .param("dispatch", "true"));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }
}
