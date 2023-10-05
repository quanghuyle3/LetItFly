package com.project.LetItFly.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "history_log")
public class HistoryLog {

    @Id
    @Column(name = "id")
    private int id;

    //not sure what cascade to put here
    @JoinColumn(name = "driver_id")
    private int driverId;

    //not sure what cascade to put here
    @JoinColumn(name = "passenger_id")
    private int passengerId;

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

    public HistoryLog() {
    }

    public HistoryLog(int id, int driverId, int passengerId, String date, String pickupLocation, String destination,
            String distance, String timeDuration, double cost) {
        this.id = id;
        this.driverId = driverId;
        this.passengerId = passengerId;
        this.date = date;
        this.pickupLocation = pickupLocation;
        this.destination = destination;
        this.distance = distance;
        this.timeDuration = timeDuration;
        this.cost = cost;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getDriverId() {
        return driverId;
    }

    public void setDriverId(int driverId) {
        this.driverId = driverId;
    }

    public int getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(int passengerId) {
        this.passengerId = passengerId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getTimeDuration() {
        return timeDuration;
    }

    public void setTimeDuration(String timeDuration) {
        this.timeDuration = timeDuration;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    @Override
    public String toString() {
        return "HistoryLog [id=" + id + ", driverId=" + driverId + ", passengerId=" + passengerId + ", date=" + date
                + ", pickupLocation=" + pickupLocation + ", destination=" + destination + ", distance=" + distance
                + ", timeDuration=" + timeDuration + ", cost=" + cost + "]";
    } 
}
