package com.project.LetItFly.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.LetItFly.model.User;
import com.project.LetItFly.model.Vehicle;
import com.project.LetItFly.repository.UserRepository;
import com.project.LetItFly.repository.VehicleRepository;
import com.project.LetItFly.requestModel.VehicleRequest;

@Service
public class VehicleServiceImpl implements VehicleService {

    private VehicleRepository vehicleRepository;
    private UserRepository userRepository;

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Vehicle> findAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public Vehicle findVehicleByLicensePlate(String licensePlate) {
        return vehicleRepository.findVehicleByLicensePlate(licensePlate);
    }

    @Override
    public List<Vehicle> findVehiclesByUserId(int userId) {
        // find User object
        User user = userRepository.findUserById(userId);
        if (user == null) {
            return null;
        }

        // find all vehicles based on user object
        return vehicleRepository.findVehicleByUserId(user);

    }

    @Override
    public Vehicle findVehicleById(int id) {
        return vehicleRepository.findVehicleById(id);
    }

    @Override
    public Vehicle saveVehicle(VehicleRequest vehicleRequest) {
        // find associated User object
        User user = userRepository.findUserById(vehicleRequest.getUserId());

        // convert vehicleRequest to vehicle object
        Vehicle vehicle = new Vehicle(vehicleRequest);

        // associate User to Vehicle object
        vehicle.setUserId(user);

        // save vehicle
        return vehicleRepository.save(vehicle);
    }

}
