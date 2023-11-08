package com.project.LetItFly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.User;
import com.project.LetItFly.model.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    Vehicle findVehicleById(int id);

    Vehicle findVehicleByLicensePlate(String licensePlate);

    List<Vehicle> findVehicleByUserId(User userId);

    @Query("SELECT v FROM Vehicle v WHERE v.userId = :userId AND v.inUse = TRUE")
    List<Vehicle> findVehiclesInUseByUserId(@Param("userId") User userId);

}
