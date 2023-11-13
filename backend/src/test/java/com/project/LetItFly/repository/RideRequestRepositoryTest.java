package com.project.LetItFly.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.project.LetItFly.model.RideRequest;
import com.project.LetItFly.model.User;

@DataJpaTest
public class RideRequestRepositoryTest {

    @Autowired
    private RideRequestRepository rideRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testFindRideRequestByDriverId() {
        // given
        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user = userRepository.save(user);

        RideRequest rideRequest = RideRequest.builder().driverId(user).curLat(-37.9862).curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();
        rideRequest = rideRequestRepository.save(rideRequest);

        // when
        List<RideRequest> retrievedRideRequests = rideRequestRepository.findRideRequestByDriverId(user);

        // then
        assertThat(retrievedRideRequests).isEqualTo(Arrays.asList(rideRequest));

    }

    @Test
    void testFindRideRequestById() {
        // given
        RideRequest rideRequest = RideRequest.builder().curLat(-37.9862).curLong(120.85733).destLat(-38.9788)
                .destLong(120.64743).build();
        rideRequest = rideRequestRepository.save(rideRequest);

        // when
        RideRequest retrievedRideRequest = rideRequestRepository.findRideRequestById(rideRequest.getId());

        // then
        assertThat(retrievedRideRequest).isEqualTo(rideRequest);
    }

    @Test
    void testFindRideRequestByPassengerId() {
        // given
        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user = userRepository.save(user);

        RideRequest rideRequest = RideRequest.builder().passengerId(user).curLat(-37.9862).curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();
        rideRequest = rideRequestRepository.save(rideRequest);

        // when
        List<RideRequest> retrievedRideRequests = rideRequestRepository.findRideRequestByPassengerId(user);

        // then
        assertThat(retrievedRideRequests).isEqualTo(Arrays.asList(rideRequest));
    }
}
