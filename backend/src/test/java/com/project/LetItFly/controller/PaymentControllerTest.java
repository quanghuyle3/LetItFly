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
import com.project.LetItFly.model.Payment;
import com.project.LetItFly.requestModel.PaymentRequest;
import com.project.LetItFly.service.PaymentService;

@WebMvcTest(controllers = PaymentController.class)
@AutoConfigureMockMvc(addFilters = false) // no more worry about token and security
@ExtendWith(MockitoExtension.class)
public class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService paymentService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // prevent error "Failed to inject JwtAuthenticationFilter"

    @Autowired
    private ObjectMapper objectMapper;

    private PaymentRequest paymentRequest;
    private Payment payment;

    @BeforeEach
    private void init() {
        // given
        paymentRequest = PaymentRequest.builder().cardNumber("88876129833").expiration("08/2026")
                .cvv(321).build();
        payment = Payment.builder().cardNumber("88876129833").expiration("08/2026").cvv(321).build();
    }

    @Test
    void testFindByCardNumber() throws Exception {
        // when
       when(paymentService.findPaymentByCardNumber(Mockito.anyString())).thenReturn(payment);
        ResultActions response = mockMvc.perform(get("/api/payment/findByCardNumber")
                .contentType(MediaType.APPLICATION_JSON)
                .param("cardNumber", "5627891652"));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testFindByUserId() throws Exception {
        // when
       when(paymentService.findPaymentsByUserId(Mockito.anyInt())).thenReturn(Arrays.asList(payment));
        ResultActions response = mockMvc.perform(get("/api/payment/findByUserId")
                .contentType(MediaType.APPLICATION_JSON)
                .param("userId", "5"));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testSavePayment_200() throws Exception {
        // when
        when(paymentService.savePayment(paymentRequest)).thenReturn(payment);
        ResultActions response = mockMvc.perform(post("/api/payment/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testSavePayment_409() throws Exception {
        // when
        when(paymentService.savePayment(paymentRequest)).thenReturn(null);
        ResultActions response = mockMvc.perform(post("/api/payment/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().isConflict());
    }

    @Test
    void testSetToNotUse() throws Exception {
        // when
        ResultActions response = mockMvc.perform(get("/api/payment/setToNotUse")
                .contentType(MediaType.APPLICATION_JSON)
                .param("cardNumber", "5627891652"));

        // then
        verify(paymentService).setPaymentToNotUse("5627891652");
        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testUpdatePayment() throws Exception {
        // when
        ResultActions response = mockMvc.perform(post("/api/payment/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentRequest)));

        // then
        response.andExpect(MockMvcResultMatchers.status().isOk());

    }
}
