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

        // find all in-used vehicles based on user object
        return vehicleRepository.findVehiclesInUseByUserId(user);

    }

    @Override
    public Vehicle findVehicleById(int id) {
        return vehicleRepository.findVehicleById(id);
    }

    @Override
    public Vehicle saveVehicle(VehicleRequest vehicleRequest) {
        // find associated User object
        User user = userRepository.findUserById(vehicleRequest.getUserId());

        // check if there's already an in-used vehicle in sys
        // that associated with the user
        List<Vehicle> vehicles = vehicleRepository.findVehiclesInUseByUserId(user);
        for (Vehicle v : vehicles) {
            if (v.getLicensePlate().equals(vehicleRequest.getLicensePlate())) {
                return null;
            }
        }

        // convert vehicleRequest to vehicle object
        Vehicle vehicle = new Vehicle(vehicleRequest);

        // associate User to Vehicle object
        vehicle.setUserId(user);

        // save vehicle
        return vehicleRepository.save(vehicle);
    }

    @Override
    public String updateVehicle(VehicleRequest vehicleRequest) {
        Vehicle exist = vehicleRepository.findVehicleByLicensePlate(vehicleRequest.getLicensePlate());
        if (exist == null) {
            return "NOT EXIST";
        }

        // update new infor (expiration, cvv, name, billing address, )
        exist.setMake(vehicleRequest.getMake());
        exist.setModel(vehicleRequest.getModel());
        exist.setYear(vehicleRequest.getYear());
        exist.setType(vehicleRequest.getType());

        vehicleRepository.save(exist);
        return "UPDATED";
    }

    @Override
    public String setVehicleToNotUse(int id) {
        Vehicle exist = vehicleRepository.findVehicleById(id);
        if (exist == null) {
            return "NOT EXIST";
        }

        exist.setInUse(false);
        vehicleRepository.save(exist);
        return "UPDATED";
    }

}
