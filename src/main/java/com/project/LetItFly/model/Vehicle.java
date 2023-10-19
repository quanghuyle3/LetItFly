package com.project.LetItFly.model;

import com.project.LetItFly.requestModel.RegistrationRequest;
import com.project.LetItFly.requestModel.VehicleRequest;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

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

    @Column(name = "in_use")
    private boolean inUse = true;

    @ManyToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH })
    @JoinColumn(name = "user_id")
    private User userId;

    public Vehicle() {
    }

    public Vehicle(String licensePlate, String make, String model, int year, String type, boolean inUse, User userId) {
        this.licensePlate = licensePlate;
        this.make = make;
        this.model = model;
        this.year = year;
        this.type = type;
        this.inUse = inUse;
        this.userId = userId;
    }

    public Vehicle(VehicleRequest vehicleRequest) {
        this.licensePlate = vehicleRequest.getLicensePlate();
        this.make = vehicleRequest.getMake();
        this.model = vehicleRequest.getModel();
        this.year = vehicleRequest.getYear();
        this.type = vehicleRequest.getType();
        this.inUse = vehicleRequest.isInUse();
    }

    public Vehicle(RegistrationRequest registrationRequest) {
        this.licensePlate = registrationRequest.getLicensePlate();
        this.make = registrationRequest.getMake();
        this.model = registrationRequest.getModel();
        this.year = registrationRequest.getYear();
        this.type = registrationRequest.getVehicleType();
        this.inUse = registrationRequest.isVehicleInUse();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public boolean isInUse() {
        return inUse;
    }

    public void setInUse(boolean inUse) {
        this.inUse = inUse;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Vehicle [id=" + id + ", licensePlate=" + licensePlate + ", make=" + make + ", model=" + model
                + ", year=" + year + ", type=" + type + ", inUse=" + inUse + ", userId=" + userId + "]";
    }

}
