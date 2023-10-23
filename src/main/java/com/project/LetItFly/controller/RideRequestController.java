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

    @PostMapping("/save")
    public String save(@RequestBody RideRequestRequest rideRequestRequest) {
        return rideRequestService.save(rideRequestRequest);
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") int id) {
        return rideRequestService.delete(id);
    }
}
