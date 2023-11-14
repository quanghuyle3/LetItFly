package com.project.LetItFly.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.LetItFly.model.DriverStatus;
import com.project.LetItFly.model.RideRequest;
import com.project.LetItFly.model.User;
import com.project.LetItFly.repository.DriverStatusRepository;
import com.project.LetItFly.repository.RideRequestRepository;
import com.project.LetItFly.repository.UserRepository;
import com.project.LetItFly.requestModel.RideRequestRequest;

import java.util.Arrays;
import java.util.List;
import java.util.Arrays.*;

@ExtendWith(MockitoExtension.class)
public class RideRequestServiceImplTest {

    @Mock
    private RideRequestRepository rideRequestRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DriverStatusRepository driverStatusRepository;

    @InjectMocks
    private RideRequestServiceImpl rideRequestService;

    @Test
    void testDelete() {
        // when
        String result = rideRequestService.delete(Mockito.anyInt());
        // then
        verify(rideRequestRepository).deleteById(Mockito.anyInt());
        assertThat(result).isEqualTo("SUCCESS");

    }

    @Test
    void testDeleteByPassengerId_SUCCESS() {
        // then
        User passenger = User.builder().email("sampleemail@gmail.com").password("Test123456").build();
        RideRequest r1 = new RideRequest();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(passenger);
        when(rideRequestRepository.findRideRequestByPassengerId(passenger)).thenReturn(Arrays.asList(r1));

        String result = rideRequestService.deleteByPassengerId(Mockito.anyInt());

        // then
        verify(rideRequestRepository).deleteAll(Arrays.asList(r1));
        assertThat(result).isEqualTo("SUCCESS");
    }

    @Test
    void testDeleteByPassengerId_NOTEXIST() {
        // then
        User passenger = User.builder().email("sampleemail@gmail.com").password("Test123456").build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(passenger);
        when(rideRequestRepository.findRideRequestByPassengerId(passenger)).thenReturn(null);

        String result = rideRequestService.deleteByPassengerId(Mockito.anyInt());

        // then
        verify(rideRequestRepository, never()).deleteAll();
        assertThat(result).isEqualTo("NOT EXIST");
    }

    @Test
    void testFindAllRideRequest() {
        rideRequestService.findAllRideRequest();
        verify(rideRequestRepository).findAllAvailableRideRequest();

    }

    @Test
    void testFindRideRequestByDriverId() {
        User driver = User.builder().email("sampleemail@gmail.com").password("Test123456").build();

        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(driver);
        rideRequestService.findRideRequestByDriverId(Mockito.anyInt());

        verify(rideRequestRepository).findRideRequestByDriverId(driver);
    }

    @Test
    void testFindRideRequestById() {
        rideRequestService.findRideRequestById(Mockito.anyInt());
        verify(rideRequestRepository).findRideRequestById(Mockito.anyInt());

    }

    @Test
    void testFindRideRequestByPassengerId() {
        User passenger = User.builder().email("sampleemail@gmail.com").password("Test123456").build();
        RideRequest r1 = new RideRequest();
        RideRequest r2 = new RideRequest();

        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(passenger);
        when(rideRequestRepository.findRideRequestByPassengerId(passenger)).thenReturn(java.util.Arrays.asList(r1, r2));

        RideRequest rideRequest = rideRequestService.findRideRequestByPassengerId(Mockito.anyInt());

        assertThat(rideRequest).isNotNull();

    }

    @Test
    void testGetDriverIdOfRideRequest_POSITIVE() {
        User passenger = User.builder().id(4).email("sampleemail@gmail.com").password("Test123456").build();
        User driver = User.builder().id(5).email("sampleemail2@gmail.com").password("Test123456").build();
        RideRequest rideRequest = RideRequest.builder().passengerId(passenger).driverId(driver).curLat(-37.9862)
                .curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();

        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(passenger);
        when(rideRequestRepository.findRideRequestByPassengerId(passenger))
                .thenReturn(java.util.Arrays.asList(rideRequest));

        int id = rideRequestService.getDriverIdOfRideRequest(Mockito.anyInt());

        assertThat(id).isEqualTo(5);
    }

    @Test
    void testGetDriverIdOfRideRequest_NEGATIVE() {
        User passenger = User.builder().id(4).email("sampleemail@gmail.com").password("Test123456").build();
        RideRequest rideRequest = RideRequest.builder().passengerId(passenger).curLat(-37.9862)
                .curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();

        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(passenger);
        when(rideRequestRepository.findRideRequestByPassengerId(passenger))
                .thenReturn(java.util.Arrays.asList(rideRequest));

        int id = rideRequestService.getDriverIdOfRideRequest(Mockito.anyInt());

        assertThat(id).isEqualTo(-1);
    }

    @Test
    void testSave_POSITIVE() {
        // given
        User user = User.builder().id(4).email("sampleemail@gmail.com").password("Test123456").build();
        RideRequest rideRequest = RideRequest.builder().id(4).curLat(-37.9862)
                .curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();
        RideRequestRequest rideRequestRequest = RideRequestRequest.builder().passengerId(4).curLat(-37.9862)
                .curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(user);
        when(rideRequestRepository.save(Mockito.any(RideRequest.class))).thenReturn(rideRequest);

        int id = rideRequestService.save(rideRequestRequest);

        // then
        assertThat(id).isGreaterThan(0);

    }

    @Test
    void testSave_NEGATIVE() {
        // given
        User user = User.builder().id(4).email("sampleemail@gmail.com").password("Test123456").build();
        RideRequestRequest rideRequestRequest = RideRequestRequest.builder().passengerId(4).curLat(-37.9862)
                .curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(user);
        // when(rideRequestRepository.save(Mockito.any(RideRequest.class))).thenReturn(rideRequest);

        int id = rideRequestService.save(rideRequestRequest);

        // then
        assertThat(id).isEqualTo(-1);

    }

    @Test
    void testSetDriverToRideRequest() {
        // given
        User driver = User.builder().id(4).email("sampleemail@gmail.com").password("Test123456").build();
        RideRequest rideRequest = RideRequest.builder().id(3).curLat(-37.9862)
                .curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();
        DriverStatus ds = DriverStatus.builder().userId(driver).curLat(23).curLong(120).build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(driver);
        when(rideRequestRepository.findRideRequestById(Mockito.anyInt())).thenReturn(rideRequest);
        when(driverStatusRepository.findDriverStatusByUserId(driver)).thenReturn(ds);

        String result = rideRequestService.setDriverToRideRequest(4, 3);

        // then
        assertThat(result).isEqualTo("SUCCESS");
    }

    @Test
    void testUpdateCoordinatesPassenger_SUCCESS() {
        // given
        RideRequest rideRequest = RideRequest.builder().curLat(-37.9862)
                .curLong(120.85733)
                .destLat(-38.9788)
                .destLong(120.64743).build();

        // when
        when(rideRequestRepository.findRideRequestById(Mockito.anyInt())).thenReturn(rideRequest);
        String result = rideRequestService.updateCoordinatesPassenger(Mockito.anyInt(), -12.00, 23.99);

        // then
        assertThat(result).isEqualTo("SUCCESS");
    }

    @Test
    void testUpdateCoordinatesPassenger_NOTEXIST() {
        // given

        // when
        when(rideRequestRepository.findRideRequestById(Mockito.anyInt())).thenReturn(null);
        String result = rideRequestService.updateCoordinatesPassenger(Mockito.anyInt(), -12.00, 23.99);

        // then
        assertThat(result).isEqualTo("NOT EXIST");
    }
}
