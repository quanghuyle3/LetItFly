package com.project.LetItFly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.LetItFly.model.HistoryLog;
import com.project.LetItFly.model.User;

@Repository
public interface HistoryLogRepository extends JpaRepository<HistoryLog, Integer> {

    HistoryLog findHistoryLogById(int id);

    List<HistoryLog> findHistoryLogsByDriverId(User driverId);

    List<HistoryLog> findHistoryLogsByPassengerId(User passengerId);

}
