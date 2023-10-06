package com.project.LetItFly.service;

import java.util.List;

import com.project.LetItFly.model.HistoryLog;

public interface HistoryLogService {

    public List<HistoryLog> findAllHistoryLog();

    public HistoryLog findHistoryLogById(int id);

    public List<HistoryLog> findHistoryLogsByDriverId(int id);

    public List<HistoryLog> findHistoryLogsByPassengerId(int id);
}
