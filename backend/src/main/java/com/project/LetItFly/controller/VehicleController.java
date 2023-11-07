package com.project.LetItFly.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.Vehicle;
import com.project.LetItFly.requestModel.PaymentRequest;
import com.project.LetItFly.requestModel.VehicleRequest;
import com.project.LetItFly.service.VehicleService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/vehicle")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping("/findByLicensePlate")
    public ResponseEntity<Vehicle> findByLicensePlate(@RequestParam("licensePlate") String licensePlate) {
        Vehicle vehicle = vehicleService.findVehicleByLicensePlate(licensePlate);
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/findByUserId") // only vehicles that are in use
    public ResponseEntity<List<Vehicle>> findByUserId(@RequestParam("userId") int userId) {
        List<Vehicle> vehicles = vehicleService.findVehiclesByUserId(userId);
        return ResponseEntity.ok(vehicles);
    }

    @PostMapping("/update")
    public String updateVehicle(@RequestBody VehicleRequest vehicleRequest) {
        return vehicleService.updateVehicle(vehicleRequest);
    }

    @GetMapping("/setToNotUse")
    public String setToNotUse(@RequestParam("licensePlate") String licensePlate) {
        return vehicleService.setVehicleToNotUse(licensePlate);
    }

    @PostMapping("/save")
    public ResponseEntity<Vehicle> save(@RequestBody VehicleRequest vehicleRequest) {
        Vehicle vehicle = vehicleService.saveVehicle(vehicleRequest);
        return ResponseEntity.ok(vehicle);
    }

}
