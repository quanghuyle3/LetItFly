package com.project.LetItFly.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.LetItFly.model.HistoryLog;
import com.project.LetItFly.model.User;
import com.project.LetItFly.repository.HistoryLogRepository;
import com.project.LetItFly.repository.UserRepository;

@Service
public class HistoryLogServiceImpl implements HistoryLogService {

    private HistoryLogRepository historyLogRepository;
    private UserRepository userRepository;

    @Autowired
    public HistoryLogServiceImpl(HistoryLogRepository historyLogRepository, UserRepository userRepository) {
        this.historyLogRepository = historyLogRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<HistoryLog> findAllHistoryLog() {
        return historyLogRepository.findAll();
    }

    @Override
    public HistoryLog findHistoryLogById(int id) {
        return historyLogRepository.findHistoryLogById(id);
    }

    @Override
    public List<HistoryLog> findHistoryLogsByDriverId(int id) {

        // find driver object based on that id
        User driver = userRepository.findUserById(id);

        // find all history logs associating with that driver
        return historyLogRepository.findHistoryLogsByDriverId(driver);
    }

    @Override
    public List<HistoryLog> findHistoryLogsByPassengerId(int id) {

        // find passenger object based on that id
        User passenger = userRepository.findUserById(id);

        // find all history logs associating with that driver
        return historyLogRepository.findHistoryLogsByPassengerId(passenger);
    }

}
