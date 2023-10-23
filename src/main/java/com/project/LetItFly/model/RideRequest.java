package com.project.LetItFly.model;

import com.project.LetItFly.requestModel.RideRequestRequest;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "ride_request")
public class RideRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "cur_lat")
    private double curLat;

    @Column(name = "cur_long")
    private double curLong;

    @Column(name = "dest_lat")
    private double destLat;

    @Column(name = "dest_long")
    private double destLong;

    public RideRequest(RideRequestRequest rideRequestRequest) {
        this.curLat = rideRequestRequest.getCurLat();
        this.curLong = rideRequestRequest.getCurLong();
        this.destLat = rideRequestRequest.getDestLat();
        this.destLong = rideRequestRequest.getDestLong();
    }

}
