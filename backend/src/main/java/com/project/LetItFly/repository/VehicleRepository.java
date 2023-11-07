package com.project.LetItFly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.User;
import com.project.LetItFly.model.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    Vehicle findVehicleById(int id);

    Vehicle findVehicleByLicensePlate(String licensePlate);

    List<Vehicle> findVehicleByUserId(User userId);

}
