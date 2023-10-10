package com.project.LetItFly.service;

import java.util.List;

import com.project.LetItFly.model.Vehicle;

public interface VehicleService {

    public List<Vehicle> findAllVehicles();

    public Vehicle findVehicleByLicensePlate(String licensePlate);

    public List<Vehicle> findVehiclesByUserId(int userId);

    // update

    // delete

}
