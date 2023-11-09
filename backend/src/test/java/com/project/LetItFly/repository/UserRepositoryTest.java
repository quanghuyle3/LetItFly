package com.project.LetItFly.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.project.LetItFly.model.User;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository underTest;

    @Test
    void checkFindUserById() {
        // given
        User passenger = new User();
        String email = "testpassenger@gmail.com";
        passenger.setEmail(email);
        passenger.setPassword("Test123456");
        passenger.setFirstName("Andy");
        passenger.setLastName("Jose");
        passenger.setBirthdate("2000-12-15");

        underTest.save(passenger);

        // when
        User passengerRetrieve = underTest.findUserByEmail(email);

        // then
        assertThat(passengerRetrieve.getEmail()).isEqualTo(email);

    }

    @Test
    void findUserByEmail() {
    }

    @Test
    void findUsersByRoles() {
    }

    @Test
    void findUsersByTwoRoles() {
    }

    @Test
    void findUserByDriverLicense() {
    }
}