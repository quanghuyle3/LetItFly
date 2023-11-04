package com.project.LetItFly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.User;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Payment findPaymentById(int id);

    Payment findPaymentByCardNumber(String cardNumber);

    List<Payment> findPaymentsByUserId(User userId);

    @Query("SELECT p FROM Payment p WHERE p.userId = :userId AND p.inUse = TRUE")
    List<Payment> findPaymentsInUseByUserId(@Param("userId") User userId);

}
