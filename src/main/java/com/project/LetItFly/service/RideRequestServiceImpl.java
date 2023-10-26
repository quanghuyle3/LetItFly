package com.project.LetItFly.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.LetItFly.model.RideRequest;
import com.project.LetItFly.repository.RideRequestRepository;
import com.project.LetItFly.requestModel.RideRequestRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RideRequestServiceImpl implements RideRequestService {

    private final RideRequestRepository rideRequestRepository;

    @Override
    public RideRequest findRideRequestById(int id) {
        return rideRequestRepository.findRideRequestById(id);
    }

    @Override
    public List<RideRequest> findAllRideRequest() {
        return rideRequestRepository.findAll();
    }

    @Override
    public String save(RideRequestRequest rideRequestRequest) {
        RideRequest rideRequest = new RideRequest(rideRequestRequest);
        rideRequestRepository.save(rideRequest);

        return "SUCCESS";
    }

    @Override
    public String delete(int id) {
        rideRequestRepository.deleteById(id);
        return "SUCCESS";
    }

}
