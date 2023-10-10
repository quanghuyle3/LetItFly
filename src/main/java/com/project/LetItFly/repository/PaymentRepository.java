package com.project.LetItFly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.User;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    Payment findPaymentByCardNumber(String cardNumber);

    List<Payment> findPaymentsByUserId(User userId);

}
