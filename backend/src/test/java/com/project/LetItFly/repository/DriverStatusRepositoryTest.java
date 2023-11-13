package com.project.LetItFly.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.project.LetItFly.model.DriverStatus;
import com.project.LetItFly.model.User;

@DataJpaTest
public class DriverStatusRepositoryTest {

    @Autowired
    private DriverStatusRepository driverStatusRepository;

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    public void setup() {
        user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user = userRepository.save(user);
    }

    @Test
    void testFindDriverStatusById() {
        // given
        DriverStatus driverStatus = DriverStatus.builder().userId(user).curLat(-37.9862).curLong(120.85733).build();
        driverStatus = driverStatusRepository.save(driverStatus);

        // when
        DriverStatus retrievedDriverStatus = driverStatusRepository.findDriverStatusById(driverStatus.getId());

        // then
        assertThat(retrievedDriverStatus).isEqualTo(driverStatus);

    }

    @Test
    void testFindDriverStatusByUserId() {
        // given
        DriverStatus driverStatus = DriverStatus.builder().userId(user).curLat(-37.9862).curLong(120.85733).build();
        driverStatus = driverStatusRepository.save(driverStatus);

        // when
        DriverStatus retrievedDriverStatus = driverStatusRepository.findDriverStatusByUserId(user);

        // then
        assertThat(retrievedDriverStatus).isEqualTo(driverStatus);
    }
}
