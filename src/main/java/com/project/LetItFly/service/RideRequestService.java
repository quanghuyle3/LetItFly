package com.project.LetItFly.service;

import java.util.List;

import com.project.LetItFly.model.RideRequest;
import com.project.LetItFly.requestModel.RideRequestRequest;

public interface RideRequestService {

    public RideRequest findRideRequestById(int id);

    public List<RideRequest> findAllRideRequest();

    public String save(RideRequestRequest rideRequestRequest);

    public String delete(int id);
}
