package com.project.LetItFly.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.RideRequest;
import com.project.LetItFly.model.User;

@Repository
public interface RideRequestRepository extends JpaRepository<RideRequest, Integer> {

    RideRequest findRideRequestById(int id);

    List<RideRequest> findRideRequestByPassengerId(User passengerId);

    List<RideRequest> findRideRequestByDriverId(User passengerId);

    @Query("SELECT r FROM RideRequest r WHERE r.driverId = NULL")
    List<RideRequest> findAllAvailableRideRequest();

    // @Query("SELECT r FROM RideRequest r WHERE r.passengerId = :passengerId ORDER
    // BY r.id DESC")
    // RideRequest findLatestRideRequestByPassengerId(@Param("passengerId") User
    // passengerId, Pageable pageable);

}
