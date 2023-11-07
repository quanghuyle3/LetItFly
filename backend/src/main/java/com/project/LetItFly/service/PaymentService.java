package com.project.LetItFly.service;

import java.util.List;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.requestModel.PaymentRequest;

public interface PaymentService {

    public List<Payment> findAllPayments();

    public Payment findPaymentById(int id);

    public Payment findPaymentByCardNumber(String cardNumber);

    public List<Payment> findPaymentsByUserId(int userId);

    public Payment savePayment(PaymentRequest paymentRequest);

    // update
    public String updatePayment(PaymentRequest paymentRequest);

    public String setPaymentToNotUse(String cardNumber);

    // delete
}
