package com.project.LetItFly.model;

import com.project.LetItFly.requestModel.PaymentRequest;
import com.project.LetItFly.requestModel.RegistrationRequest;
import com.project.LetItFly.requestModel.UserRequest;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "expiration")
    private String expiration;

    @Column(name = "cvv")
    private int cvv;

    @Column(name = "type")
    private String type;

    @ManyToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH })
    @JoinColumn(name = "user_id")
    private User userId;

    @Column(name = "name")
    private String name;

    @Column(name = "billing_address")
    private String billingAddress;

    @Column(name = "in_use")
    private boolean inUse = true;

    @Column(name = "balance")
    private double balance;

    public Payment(String cardNumber, String expiration, int cvv, String type, User userId, String name,
            String billingAddress,
            boolean inUse, double balance) {
        this.cardNumber = cardNumber;
        this.expiration = expiration;
        this.cvv = cvv;
        this.type = type;
        this.userId = userId;
        this.name = name;
        this.billingAddress = billingAddress;
        this.inUse = inUse;
        this.balance = balance;
    }

    public Payment(PaymentRequest payment) {
        this.cardNumber = payment.getCardNumber();
        this.expiration = payment.getExpiration();
        this.cvv = payment.getCvv();
        this.type = payment.getType();
        this.name = payment.getName();
        this.billingAddress = payment.getBillingAddress();
        this.inUse = payment.isInUse();
        this.balance = payment.getBalance();
    }

    public Payment(RegistrationRequest registrationRequest) {
        this.cardNumber = registrationRequest.getCardNumber();
        this.expiration = registrationRequest.getExpiration();
        this.cvv = registrationRequest.getCvv();
        this.type = registrationRequest.getPaymentType();
        this.name = registrationRequest.getName();
        this.billingAddress = registrationRequest.getBillingAddress();
        this.inUse = registrationRequest.isPaymentInUse();
        this.balance = registrationRequest.getBalance();
    }

}