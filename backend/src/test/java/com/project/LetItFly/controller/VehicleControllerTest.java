package com.project.LetItFly.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatcher;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.LetItFly.configuration.JwtAuthenticationFilter;
import com.project.LetItFly.model.Vehicle;
import com.project.LetItFly.requestModel.VehicleRequest;
import com.project.LetItFly.service.VehicleService;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@WebMvcTest(controllers = VehicleController.class)
@AutoConfigureMockMvc(addFilters = false) // no more worry about token and security
@ExtendWith(MockitoExtension.class)
public class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VehicleService vehicleService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // prevent error "Failed to inject JwtAuthenticationFilter"

    @Autowired
    private ObjectMapper objectMapper;

    private VehicleRequest vehicleRequest;
    private Vehicle vehicle;

    @BeforeEach
    public void init() {
        vehicleRequest = VehicleRequest.builder().inUse(true).licensePlate("8YYY782").make("honda")
                .model("pilot")
                .year(2015).build();

        vehicle = Vehicle.builder().inUse(true).licensePlate("8YYY782").make("honda")
                .model("pilot")
                .year(2015).build();
    }

    @Test
    void testFindByLicensePlate() throws Exception {
        // when
        when(vehicleService.findVehicleByLicensePlate(Mockito.anyString())).thenReturn(vehicle);

        ResultActions response = mockMvc.perform(get("/api/vehicle/findByLicensePlate")
                .contentType(MediaType.APPLICATION_JSON)
                .param("licensePlate", Mockito.anyString()));

        // then
        verify(vehicleService).findVehicleByLicensePlate(Mockito.anyString());
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    void testFindByUserId() throws Exception {
        // when
        when(vehicleService.findVehiclesByUserId(Mockito.anyInt())).thenReturn(Arrays.asList(vehicle));

        ResultActions response = mockMvc.perform(get("/api/vehicle/findByUserId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("userId", "2"));

        // then
        verify(vehicleService).findVehiclesByUserId(2);
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testSave_SUCCESS() throws Exception {
        // when
        when(vehicleService.saveVehicle(Mockito.any(VehicleRequest.class))).thenReturn(vehicle);
        
        ResultActions response = mockMvc.perform(post("/api/vehicle/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(vehicleRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testSave_DUPLICATED() throws Exception {
        // when
        when(vehicleService.saveVehicle(Mockito.any(VehicleRequest.class))).thenReturn(null);

        ResultActions response = mockMvc.perform(post("/api/vehicle/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(vehicleRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().isConflict());
    }

    @Test
    void testSetToNotUse() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/vehicle/setToNotUse")
                .contentType(MediaType.APPLICATION_JSON)
                .param("id", "3"));

        // then
        verify(vehicleService).setVehicleToNotUse(Mockito.anyInt());
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testUpdateVehicle() throws Exception {
        // when
        ResultActions response = mockMvc.perform(post("/api/vehicle/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(vehicleRequest)));

        // then
        verify(vehicleService).updateVehicle(vehicleRequest);
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }
}
