package com.project.LetItFly.service;

import java.util.List;

import com.project.LetItFly.model.DriverStatus;
import com.project.LetItFly.model.User;

public interface DriverStatusService {

    public List<DriverStatus> findAllDriverStatus();

    public DriverStatus findDriverStatusById(int id);

    public DriverStatus findDriverStatusByUserId(int userId);

    // update

    // delete

}
