package com.project.LetItFly.service;

import java.util.List;

import com.project.LetItFly.model.Payment;

public interface PaymentService {

    public List<Payment> findAllPayments();

    public Payment findPaymentByCardNumber(String cardNumber);

    public List<Payment> findPaymentsByUserId(int userId);

    // update

    // delete
}
