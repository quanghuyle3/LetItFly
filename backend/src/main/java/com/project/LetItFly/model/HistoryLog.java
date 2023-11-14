package com.project.LetItFly.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "history_log")
public class HistoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE,
            CascadeType.REFRESH })
    @JoinColumn(name = "driver_id")
    private User driverId;

    @ManyToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE,
            CascadeType.REFRESH })
    @JoinColumn(name = "passenger_id")
    private User passengerId;

    @Column(name = "date")
    private String date;

    @Column(name = "pickup_location")
    private String pickupLocation;

    @Column(name = "destination")
    private String destination;

    @Column(name = "distance")
    private String distance;

    @Column(name = "time_duration")
    private String timeDuration;

    @Column(name = "cost")
    private double cost;

    public HistoryLog(User driverId, User passengerId, String date, String pickupLocation, String destination,
            String distance, String timeDuration, double cost) {
        this.driverId = driverId;
        this.passengerId = passengerId;
        this.date = date;
        this.pickupLocation = pickupLocation;
        this.destination = destination;
        this.distance = distance;
        this.timeDuration = timeDuration;
        this.cost = cost;
    }

}
