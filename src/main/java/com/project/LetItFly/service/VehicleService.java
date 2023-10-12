package com.project.LetItFly.service;

import java.util.List;

import com.project.LetItFly.model.Vehicle;
import com.project.LetItFly.requestModel.VehicleRequest;

public interface VehicleService {

    public List<Vehicle> findAllVehicles();

    public Vehicle findVehicleById(int id);

    public Vehicle findVehicleByLicensePlate(String licensePlate);

    public List<Vehicle> findVehiclesByUserId(int userId);

    public Vehicle saveVehicle(VehicleRequest vehicleRequest);

    // update

    // delete

}
