package com.project.LetItFly.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.LetItFly.model.RideRequest;
import com.project.LetItFly.model.User;
import com.project.LetItFly.repository.RideRequestRepository;
import com.project.LetItFly.repository.UserRepository;
import com.project.LetItFly.requestModel.RideRequestRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RideRequestServiceImpl implements RideRequestService {

    private final RideRequestRepository rideRequestRepository;
    private final UserRepository userRepository;

    @Override
    public RideRequest findRideRequestById(int id) {
        return rideRequestRepository.findRideRequestById(id);
    }

    @Override
    public List<RideRequest> findAllRideRequest() {
        return rideRequestRepository.findAll();
    }

    @Override
    public int save(RideRequestRequest rideRequestRequest) {
        RideRequest rideRequest = new RideRequest(rideRequestRequest);

        // find passenger object from passenger id
        User user = userRepository.findUserById(rideRequestRequest.getPassengerId());

        // associate passenger object to the ride request
        rideRequest.setPassengerId(user);

        try {
            RideRequest rq = rideRequestRepository.save(rideRequest);
            return rq.getId();
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public String delete(int id) {
        rideRequestRepository.deleteById(id);
        return "SUCCESS";
    }

    // @Override
    public RideRequest findRideRequestByPassengerId(int passengerId) {
        // retrieve the passenger object first
        User passenger = userRepository.findUserById(passengerId);

        return rideRequestRepository.findRideRequestByPassengerId(passenger);
    }

    @Override
    public List<RideRequest> findRideRequestByDriverId(int driverId) {
        // retrieve the passenger object first
        User driver = userRepository.findUserById(driverId);

        return rideRequestRepository.findRideRequestByDriverId(driver);
    }

}
