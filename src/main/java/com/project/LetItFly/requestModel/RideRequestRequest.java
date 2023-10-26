package com.project.LetItFly.requestModel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RideRequestRequest {

    private int id;
    private double curLat;
    private double curLong;
    private double destLat;
    private double destLong;
}
