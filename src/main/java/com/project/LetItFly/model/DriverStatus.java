package com.project.LetItFly.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "driver_status")
public class DriverStatus {

    @Id
    //not sure what cascade to use here
    @JoinColumn(name = "user_id")
    private int userId;

    @Column(name = "dispatch")
    private boolean dispatch;

    @Column(name = "seat_available")
    private int seatAvailable;

    public DriverStatus() {
    }

    public DriverStatus(int userId, boolean dispatch, int seatAvailable) {
        this.userId = userId;
        this.dispatch = dispatch;
        this.seatAvailable = seatAvailable;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public boolean isDispatch() {
        return dispatch;
    }

    public void setDispatch(boolean dispatch) {
        this.dispatch = dispatch;
    }

    public int getSeatAvailable() {
        return seatAvailable;
    }

    public void setSeatAvailable(int seatAvailable) {
        this.seatAvailable = seatAvailable;
    }

    @Override
    public String toString() {
        return "DriverStatus [userId=" + userId + ", dispatch=" + dispatch + ", seatAvailable=" + seatAvailable + "]";
    } 
}
