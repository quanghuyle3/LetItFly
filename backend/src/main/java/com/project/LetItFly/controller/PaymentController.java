package com.project.LetItFly.controller;

import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.requestModel.PaymentRequest;
import com.project.LetItFly.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/findByCardNumber")
    public ResponseEntity<Payment> findByCardNumber(@RequestParam("cardNumber") String cardNumber) {
        Payment payment = paymentService.findPaymentByCardNumber(cardNumber);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/findByUserId") // only cards that are in use
    public ResponseEntity<List<Payment>> findByUserId(@RequestParam("userId") int userId) {
        List<Payment> payments = paymentService.findPaymentsByUserId(userId);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/update")
    public String updatePayment(@RequestBody PaymentRequest paymentRequest) {
        return paymentService.updatePayment(paymentRequest);
    }

    @GetMapping("/setToNotUse")
    public String setToNotUse(@RequestParam("id") int id) {
        return paymentService.setPaymentToNotUse(id);
    }

    @PostMapping("/save")
    public ResponseEntity<Payment> savePayment(@RequestBody PaymentRequest paymentRequest) {
        Payment payment = paymentService.savePayment(paymentRequest);

        if (payment == null) {
            return ResponseEntity.status(HttpStatusCode.valueOf(409)) // duplicated record
                    .body(null);
        }
        return ResponseEntity.status(HttpStatusCode.valueOf(200))
                .body(payment);
    }

}
