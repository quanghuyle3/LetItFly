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
import com.project.LetItFly.model.RideRequest;
import com.project.LetItFly.model.User;
import com.project.LetItFly.requestModel.RideRequestRequest;
import com.project.LetItFly.service.RideRequestService;

@WebMvcTest(controllers = RideRequestController.class)
@AutoConfigureMockMvc(addFilters = false) // no more worry about token and security
@ExtendWith(MockitoExtension.class)
public class RideRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RideRequestService rideRequestService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // prevent error "Failed to inject JwtAuthenticationFilter"

    @Autowired
    private ObjectMapper objectMapper;

    private User driver;
    private User passenger;
    private RideRequest rideRequest;
    private RideRequestRequest rideRequestRequest;

    @BeforeEach
    public void init() {
        driver = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        passenger = User.builder().email("sampleemail@gmail.com").password("Test123456").build();
        rideRequest = RideRequest.builder().driverId(driver).passengerId(passenger).curLat(-37.9862).curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();
        rideRequestRequest = RideRequestRequest.builder().curLat(-37.9862).curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();
    }

    @Test
    void testDelete() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/ride-request/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .param("id", String.valueOf(rideRequest.getId())));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    void testDeleteByPassengerId() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/ride-request/deleteByPassengerId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("passengerId", String.valueOf(passenger.getId())));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    void testFindAll() throws Exception {
        // when
        when(rideRequestService.findAllRideRequest()).thenReturn(Arrays.asList(rideRequest));
        ResultActions response = mockMvc.perform(get("/api/ride-request/findAll")
                .contentType(MediaType.APPLICATION_JSON));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testFindByDriverId() throws Exception {
        // when
        when(rideRequestService.findRideRequestByDriverId(driver.getId())).thenReturn(Arrays.asList(rideRequest));
        ResultActions response = mockMvc.perform(get("/api/ride-request/findByDriverId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("id", String.valueOf(driver.getId())));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    void testFindById() throws Exception {
        // when
        when(rideRequestService.findRideRequestById(rideRequest.getId())).thenReturn(rideRequest);
        ResultActions response = mockMvc.perform(get("/api/ride-request/findById")
                .contentType(MediaType.APPLICATION_JSON)
                .param("id", String.valueOf(rideRequest.getId())));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    void testFindByPassengerId() throws Exception {
        // when
        when(rideRequestService.findRideRequestByPassengerId(passenger.getId())).thenReturn(rideRequest);
        ResultActions response = mockMvc.perform(get("/api/ride-request/findByPassengerId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("id", String.valueOf(passenger.getId())));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    void testGetDriverIdOfRideRequest() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/ride-request/getDriverIdOfRideRequest")
                .contentType(MediaType.APPLICATION_JSON)
                .param("passengerId", String.valueOf(driver.getId())));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testSave() throws Exception {
        // when
        ResultActions response = mockMvc.perform(post("/api/ride-request/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rideRequestRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testSetDriverToRideRequest() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/ride-request/setDriverToRideRequest")
                .contentType(MediaType.APPLICATION_JSON)
                .param("driverId", String.valueOf(driver.getId()))
                .param("rideId", String.valueOf(rideRequest.getId())));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testUpdateCoordinatesPassenger() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/ride-request/updateCoordinatesPassenger")
                .contentType(MediaType.APPLICATION_JSON)
                .param("rideRequestId", String.valueOf(rideRequest.getId()))
                .param("curLat", "23.923")
                .param("curLong", "120.9404"));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }
}
