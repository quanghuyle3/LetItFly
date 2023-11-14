package com.project.LetItFly.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.project.LetItFly.model.User;
import com.project.LetItFly.model.Vehicle;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.util.List;

@DataJpaTest
public class VehicleRepositoryTest {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSave() {
        // given
        Vehicle vehicle = Vehicle.builder().inUse(true).licensePlate("8YYY782").make("honda")
                .model("pilot")
                .year(2015).build();

        // when
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // then
        assertThat(savedVehicle.getId()).isGreaterThan(0);
    }

    @Test
    void testSave_Update() { // update the vehicle after saving
        // given
        Vehicle vehicle = Vehicle.builder().inUse(true).licensePlate("8YYY782").make("honda")
                .model("pilot")
                .year(2015).build();
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // when
        savedVehicle.setMake("toyota");
        savedVehicle.setYear(2023);
        savedVehicle = vehicleRepository.save(vehicle);

        // then
        assertThat(savedVehicle.getMake()).isEqualTo("toyota");
        assertThat(savedVehicle.getYear()).isEqualTo(2023);
    }

    @Test
    void testFindVehicleById() {
        // given
        Vehicle vehicle = Vehicle.builder().licensePlate("5SDF778").make("honda").model("accord").year(2019).build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // when
        Vehicle retrievedVehicle = vehicleRepository.findVehicleById(savedVehicle.getId());

        // then
        assertThat(retrievedVehicle).isEqualTo(savedVehicle);

    }

    @Test
    void testFindVehicleByLicensePlate() {
        // given
        Vehicle vehicle = Vehicle.builder().licensePlate("3KJH871").make("toyota").model("camry").year(2020).build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // when
        Vehicle retrievedVehicle = vehicleRepository.findVehicleByLicensePlate(savedVehicle.getLicensePlate());

        // then
        assertThat(retrievedVehicle).isEqualTo(savedVehicle);
    }

    @Test
    void testFindVehicleByUserId() {
        // given (a user has 2 vehicle)
        User user1 = User.builder().email("user1test@gmail.com").password("Test123456").build();
        user1 = userRepository.save(user1);

        Vehicle vehicle1 = Vehicle.builder().userId(user1).licensePlate("5HHH712").make("honda").model("pilot")
                .year(1999).build();
        Vehicle savedVehicle1 = vehicleRepository.save(vehicle1);

        Vehicle vehicle2 = Vehicle.builder().userId(user1).licensePlate("9MNB990").make("toyota").model("camry")
                .year(2005).build();
        Vehicle savedVehicle2 = vehicleRepository.save(vehicle2);

        // when
        List<Vehicle> retrievedVehicles = vehicleRepository.findVehicleByUserId(user1);

        // then
        assertThat(retrievedVehicles.size()).isEqualTo(2);
        assertThat(retrievedVehicles.get(0)).isEqualTo(savedVehicle1);
        assertThat(retrievedVehicles.get(1)).isEqualTo(savedVehicle2);
    }

    @Test
    void testFindVehiclesInUseByUserId_Case1() { // User has two vehicles in use
        // given
        User user1 = User.builder().email("user1test@gmail.com").password("Test123456").build();
        user1 = userRepository.save(user1);

        Vehicle vehicle1 = Vehicle.builder().userId(user1).inUse(true).licensePlate("5HHH712").make("honda")
                .model("pilot")
                .year(1999).build();
        Vehicle savedVehicle1 = vehicleRepository.save(vehicle1);

        Vehicle vehicle2 = Vehicle.builder().userId(user1).inUse(true).licensePlate("9MNB990").make("toyota")
                .model("camry")
                .year(2005).build();
        Vehicle savedVehicle2 = vehicleRepository.save(vehicle2);

        // when
        List<Vehicle> retrievedVehicles = vehicleRepository.findVehiclesInUseByUserId(user1);

        // then
        assertThat(retrievedVehicles.size()).isEqualTo(2);
        assertThat(retrievedVehicles.get(0)).isEqualTo(savedVehicle1);

    }

    @Test
    void testFindVehiclesInUseByUserId_Case2() { // User has two vehicles but one is not in use
        // given
        User user1 = User.builder().email("user1test@gmail.com").password("Test123456").build();
        user1 = userRepository.save(user1);

        Vehicle vehicle1 = Vehicle.builder().userId(user1).inUse(false).licensePlate("5HHH712").make("honda")
                .model("pilot")
                .year(1999).build();
        Vehicle savedVehicle1 = vehicleRepository.save(vehicle1);

        Vehicle vehicle2 = Vehicle.builder().userId(user1).inUse(true).licensePlate("9MNB990").make("toyota")
                .model("camry")
                .year(2005).build();
        Vehicle savedVehicle2 = vehicleRepository.save(vehicle2);

        // when
        List<Vehicle> retrievedVehicles = vehicleRepository.findVehiclesInUseByUserId(user1);

        // then
        assertThat(retrievedVehicles.size()).isEqualTo(1);
        assertThat(retrievedVehicles.get(0)).isEqualTo(savedVehicle2);

    }

}
