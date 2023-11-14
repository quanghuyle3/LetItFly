package com.project.LetItFly.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.User;

@DataJpaTest
public class PaymentRepositoryTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testFindPaymentByCardNumber() {
        // given
        Payment payment = Payment.builder().cardNumber("1289672546").expiration("12/2024").cvv(123).build();
        payment = paymentRepository.save(payment);

        // when
        Payment retrievedPayment = paymentRepository.findPaymentByCardNumber(payment.getCardNumber());

        // then
        assertThat(retrievedPayment).isEqualTo(payment);
    }

    @Test
    void testFindPaymentById() {
        // given
        Payment payment = Payment.builder().cardNumber("1289672546").expiration("12/2024").cvv(123).build();
        payment = paymentRepository.save(payment);

        // when
        Payment retrievedPayment = paymentRepository.findPaymentById(payment.getId());

        // then
        assertThat(retrievedPayment).isEqualTo(payment);
    }

    @Test
    void testFindPaymentsByUserId() {
        // given
        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user = userRepository.save(user);

        Payment payment1 = Payment.builder().userId(user).cardNumber("1289672546").expiration("12/2024").cvv(123)
                .build();
        payment1 = paymentRepository.save(payment1);

        Payment payment2 = Payment.builder().userId(user).cardNumber("7826781652").expiration("12/2025").cvv(321)
                .build();
        payment2 = paymentRepository.save(payment2);

        // when
        List<Payment> retrievedPayments = paymentRepository.findPaymentsByUserId(user);

        // then
        assertThat(retrievedPayments.size()).isEqualTo(2);
        assertThat(retrievedPayments).isEqualTo(Arrays.asList(payment1, payment2));

    }

    @Test
    void testFindPaymentsInUseByUserId() {
        // given
        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user = userRepository.save(user);

        Payment payment1 = Payment.builder().inUse(false).userId(user).cardNumber("1289672546").expiration("12/2024")
                .cvv(123)
                .build();
        payment1 = paymentRepository.save(payment1);

        Payment payment2 = Payment.builder().inUse(true).userId(user).cardNumber("7826781652").expiration("12/2025")
                .cvv(321)
                .build();
        payment2 = paymentRepository.save(payment2);

        // when
        List<Payment> retrievedPayments = paymentRepository.findPaymentsInUseByUserId(user);

        // then
        assertThat(retrievedPayments.size()).isEqualTo(1);
        assertThat(retrievedPayments).isEqualTo(Arrays.asList(payment2));
    }
}
