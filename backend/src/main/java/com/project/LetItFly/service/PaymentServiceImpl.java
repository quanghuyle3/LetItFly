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

        // find payments (IN USE) and based on the user object
        return paymentRepository.findPaymentsInUseByUserId(user);
    }

    @Override
    public Payment findPaymentById(int id) {
        return paymentRepository.findPaymentById(id);
    }

    @Override
    public Payment savePayment(PaymentRequest paymentRequest) {
        // find the associate User
        User user = userRepository.findUserById(paymentRequest.getUserId());

        // check if there's already an in-used payment in sys
        // that associated with the user
        List<Payment> payments = paymentRepository.findPaymentsInUseByUserId(user);
        for (Payment p : payments) {
            if (p.getCardNumber().equals(paymentRequest.getCardNumber())) {
                return null;
            }
        }

        // convert PaymentRequest to Payment object
        Payment payment = new Payment(paymentRequest);

        // assocaite User to Payment object
        payment.setUserId(user);

        // save
        return paymentRepository.save(payment);
    }

    @Override
    public String updatePayment(PaymentRequest paymentRequest) {

        Payment exist = paymentRepository.findPaymentByCardNumber(paymentRequest.getCardNumber());
        if (exist == null) {
            return "NOT EXIST";
        }

        // update new infor (expiration, cvv, name, billing address, )
        exist.setExpiration(paymentRequest.getExpiration());
        exist.setCvv(paymentRequest.getCvv());
        exist.setName(paymentRequest.getName());
        exist.setBillingAddress(paymentRequest.getBillingAddress());

        paymentRepository.save(exist);
        return "UPDATED";

    }

    @Override
    public String setPaymentToNotUse(String cardNumber) {
        Payment exist = paymentRepository.findPaymentByCardNumber(cardNumber);
        if (exist == null) {
            return "NOT EXIST";
        }

        exist.setInUse(false);
        paymentRepository.save(exist);
        return "UPDATED";
    }

}
