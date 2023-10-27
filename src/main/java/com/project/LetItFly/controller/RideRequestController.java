package com.project.LetItFly.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.RideRequest;
import com.project.LetItFly.requestModel.RideRequestRequest;
import com.project.LetItFly.service.RideRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ride-request")
public class RideRequestController {

    private final RideRequestService rideRequestService;

    @GetMapping("/findById")
    public ResponseEntity<RideRequest> findById(@RequestParam("id") int id) {
        RideRequest rideRequest = rideRequestService.findRideRequestById(id);
        return ResponseEntity.ok(rideRequest);
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<RideRequest>> findAll() {
        List<RideRequest> rideRequests = rideRequestService.findAllRideRequest();
        return ResponseEntity.ok(rideRequests);

    }

    // return the id of the ride request
    // 0: if failed saving the ride request
    @PostMapping("/save")
    public int save(@RequestBody RideRequestRequest rideRequestRequest) {
        return rideRequestService.save(rideRequestRequest);
    }

    // id of the ride request
    @GetMapping("/delete")
    public String delete(@RequestParam("id") int id) {
        return rideRequestService.delete(id);
    }

    // find current ride request by passenger id
    @GetMapping("/findByPassengerId")
    public ResponseEntity<RideRequest> findByPassengerId(@RequestParam("id") int id) {
        RideRequest rideRequest = rideRequestService.findRideRequestByPassengerId(id);
        return ResponseEntity.ok(rideRequest);
    }

    // find current rides taken by driver id
    @GetMapping("/findByDriverId")
    public ResponseEntity<List<RideRequest>> findByDriverId(@RequestParam("id") int id) {
        List<RideRequest> rideRequests = rideRequestService.findRideRequestByDriverId(id);
        return ResponseEntity.ok(rideRequests);
    }

    // update current coordinates of passenger

    // get current coordinates of passenger

    // add the driver id to the ride (the one accepts the ride)
    // this will also set the start attribute of the ride to TRUE

    // get driver id of the ride request
    // 0: if no driver accepts the ride yet
}
