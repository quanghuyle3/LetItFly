package com.project.LetItFly.requestModel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {

    private int id;

    private String cardNumber;

    private String expiration;

    private int cvv;

    private String type;

    private int userId;

    private String name;

    private String billingAddress;

    private boolean inUse = true;

    private double balance;

}
