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

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.User;
import com.project.LetItFly.repository.PaymentRepository;
import com.project.LetItFly.repository.UserRepository;
import com.project.LetItFly.requestModel.PaymentRequest;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @Test
    void testFindAllPayments() {
        // when
        paymentService.findAllPayments();
        // then
        verify(paymentRepository).findAll();
    }

    @Test
    void testFindPaymentByCardNumber() {
        // when
        paymentService.findPaymentByCardNumber(Mockito.anyString());
        // then
        verify(paymentRepository).findPaymentByCardNumber(Mockito.anyString());

    }

    @Test
    void testFindPaymentById() {
        // when
        paymentService.findPaymentById(Mockito.anyInt());
        // then
        verify(paymentRepository).findPaymentById(Mockito.anyInt());
    }

    @Test
    void testFindPaymentsByUserId() {
        // given
        Payment payment = Payment.builder().cardNumber("1785637892").expiration("12/2025").cvv(123).build();
        User user = User.builder().email("sampleemail@gmail.com").password("Test123456").build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(user);

        paymentService.findPaymentsByUserId(Mockito.anyInt());

        // then
        verify(paymentRepository).findPaymentsInUseByUserId(Mockito.any(User.class));

    }

    @Test
    void testSavePayment() {
        // given
        PaymentRequest paymentRequest = PaymentRequest.builder().cardNumber("88876129833").expiration("08/2026")
                .cvv(321).build();
        Payment payment = Payment.builder().cardNumber("1785637892").expiration("12/2025").cvv(123).build();
        User user = User.builder().email("sampleemail@gmail.com").password("Test123456").build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(user);
        when(paymentRepository.findPaymentsInUseByUserId(Mockito.any(User.class))).thenReturn(Arrays.asList(payment));

        Payment added = paymentService.savePayment(paymentRequest);

        // then
        ArgumentCaptor<Payment> paymentArgCaptor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(paymentArgCaptor.capture());

        Payment savedPayment = paymentArgCaptor.getValue();
        assertThat(savedPayment.getCardNumber()).isEqualTo(paymentRequest.getCardNumber());
    }

    @Test
    void testSetPaymentToNotUse_UPDATED() {
        // given
        Payment payment = Payment.builder().cardNumber("1785637892").expiration("12/2025").cvv(123).build();

        // when
        when(paymentService.findPaymentByCardNumber(Mockito.anyString())).thenReturn(payment);

        String result = paymentService.setPaymentToNotUse(Mockito.anyString());

        // then
        verify(paymentRepository).save(payment);
        assertThat(result).isEqualTo("UPDATED");
    }

    @Test
    void testSetPaymentToNotUse_NOTEXIST() {
        // given

        // when
        when(paymentService.findPaymentByCardNumber(Mockito.anyString())).thenReturn(null);

        String result = paymentService.setPaymentToNotUse(Mockito.anyString());

        // then
        verify(paymentRepository, never()).save(Mockito.any());
        assertThat(result).isEqualTo("NOT EXIST");
    }

    @Test
    void testUpdatePayment_UPDATED() {
        // given
        PaymentRequest paymentRequest = PaymentRequest.builder().cardNumber("88876129833").expiration("08/2026")
                .cvv(321).build();
        Payment payment = Payment.builder().cardNumber("88876129833").expiration("12/2025").cvv(123).build();

        // when
        when(paymentRepository.findPaymentByCardNumber(Mockito.anyString())).thenReturn(payment);

        String result = paymentService.updatePayment(paymentRequest);

        // then
        ArgumentCaptor<Payment> paymentArgCaptor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(paymentArgCaptor.capture());

        assertThat(result).isEqualTo("UPDATED");
        Payment savedPayment = paymentArgCaptor.getValue();
        assertThat(savedPayment.getCardNumber()).isEqualTo(paymentRequest.getCardNumber());
        assertThat(savedPayment.getExpiration()).isEqualTo(paymentRequest.getExpiration());
        assertThat(savedPayment.getCvv()).isEqualTo(paymentRequest.getCvv());

    }

    @Test
    void testUpdatePayment_NOTEXIST() {
        // given
        PaymentRequest paymentRequest = PaymentRequest.builder().cardNumber("88876129833").expiration("08/2026")
                .cvv(321).build();

        // when
        when(paymentRepository.findPaymentByCardNumber(Mockito.anyString())).thenReturn(null);

        String result = paymentService.updatePayment(paymentRequest);

        // then
        ArgumentCaptor<Payment> paymentArgCaptor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository, never()).save(paymentArgCaptor.capture());

        assertThat(result).isEqualTo("NOT EXIST");

    }
}
