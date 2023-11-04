package com.project.LetItFly.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.DriverStatus;
import com.project.LetItFly.model.User;

@Repository
public interface DriverStatusRepository extends JpaRepository<DriverStatus, Integer> {

    DriverStatus findDriverStatusById(int id);

    DriverStatus findDriverStatusByUserId(User userId);

}
