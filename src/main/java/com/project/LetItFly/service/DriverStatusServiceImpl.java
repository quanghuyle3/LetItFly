package com.project.LetItFly.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.LetItFly.model.DriverStatus;
import com.project.LetItFly.model.User;
import com.project.LetItFly.repository.DriverStatusRepository;
import com.project.LetItFly.repository.UserRepository;

@Service
public class DriverStatusServiceImpl implements DriverStatusService {
    private DriverStatusRepository driverStatusRepository;
    private UserRepository userRepository;

    @Autowired
    public DriverStatusServiceImpl(DriverStatusRepository driverStatusRepository, UserRepository userRepository) {
        this.driverStatusRepository = driverStatusRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<DriverStatus> findAllDriverStatus() {
        return driverStatusRepository.findAll();
    }

    @Override
    public DriverStatus findDriverStatusById(int id) {
        return driverStatusRepository.findDriverStatusById(id);
    }

    @Override
    public DriverStatus findDriverStatusByUserId(int userId) {
        // retrieve User object
        User user = userRepository.findUserById(userId);

        if (user == null) {
            return null;
        }

        return driverStatusRepository.findDriverStatusByUserId(user);
    }

}
