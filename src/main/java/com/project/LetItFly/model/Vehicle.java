package com.project.LetItFly.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @Column(name = "license_plate")
    private String licensePlate;

    @Column(name = "make")
    private String make;

    @Column(name = "model")
    private String model;

    @Column(name = "year")
    private int year;

    @Column(name = "type")
    private String type;

    @ManyToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH })
    @JoinColumn(name = "user_id")
    private User userId;

    public Vehicle() {
    }

    public Vehicle(String licensePlate, String make, String model, int year, String type, User userId) {
        this.licensePlate = licensePlate;
        this.make = make;
        this.model = model;
        this.year = year;
        this.type = type;
        this.userId = userId;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Vehicle [licensePlate=" + licensePlate + ", make=" + make + ", model=" + model + ", year=" + year
                + ", type=" + type + ", userId=" + userId + "]";
    }

}
