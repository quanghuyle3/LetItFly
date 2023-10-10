package com.project.LetItFly.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.User;
import com.project.LetItFly.repository.PaymentRepository;
import com.project.LetItFly.repository.UserRepository;

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

}
