package com.project.LetItFly.requestModel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VehicleRequest {

    private int id;

    private String licensePlate;

    private String make;

    private String model;

    private int year;

    private String type;

    private boolean inUse = true;

    private int userId;

}
