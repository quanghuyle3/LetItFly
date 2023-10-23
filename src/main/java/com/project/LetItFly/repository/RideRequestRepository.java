package com.project.LetItFly.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.RideRequest;

@Repository
public interface RideRequestRepository extends JpaRepository<RideRequest, Integer> {

    RideRequest findRideRequestById(int id);

}
