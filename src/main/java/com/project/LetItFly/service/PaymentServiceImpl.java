package com.project.LetItFly.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.User;
import com.project.LetItFly.repository.PaymentRepository;
import com.project.LetItFly.repository.UserRepository;
import com.project.LetItFly.requestModel.PaymentRequest;

@Service
public class PaymentServiceImpl implements PaymentService {

    private PaymentRepository paymentRepository;
    private UserRepository userRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository, UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Payment> findAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment findPaymentByCardNumber(String cardNumber) {
        return paymentRepository.findPaymentByCardNumber(cardNumber);
    }

    @Override
    public List<Payment> findPaymentsByUserId(int userId) {
        // find User object
        User user = userRepository.findUserById(userId);
        if (user == null) {
            return null;
        }

        // find payments based on the user object
        return paymentRepository.findPaymentsByUserId(user);
    }

    @Override
    public Payment findPaymentById(int id) {
        return paymentRepository.findPaymentById(id);
    }

    @Override
    public Payment savePayment(PaymentRequest paymentRequest) {
        // find the associate User
        User user = userRepository.findUserById(paymentRequest.getUserId());

        // convert PaymentRequest to Payment object
        Payment payment = new Payment(paymentRequest);

        // assocaite User to Payment object
        payment.setUserId(user);

        // save
        return paymentRepository.save(payment);
    }

}
