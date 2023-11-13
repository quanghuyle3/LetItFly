package com.project.LetItFly.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.LetItFly.model.User;
import com.project.LetItFly.model.Vehicle;
import com.project.LetItFly.repository.UserRepository;
import com.project.LetItFly.repository.VehicleRepository;
import com.project.LetItFly.requestModel.VehicleRequest;

@ExtendWith(MockitoExtension.class)
public class VehicleServiceImplTest {

        @Mock
        private VehicleRepository vehicleRepository;

        @Mock
        private UserRepository userRepository;

        @InjectMocks
        private VehicleServiceImpl vehicleService;

        // @Mock
        // private VehicleService vehicleService;

        // @BeforeEach
        // void setUp() {
        // vehicleService = new VehicleServiceImpl(vehicleRepository, userRepository);
        // }

        @Test
        void testFindAllVehicles() {
                // when
                vehicleService.findAllVehicles();
                // then
                verify(vehicleRepository).findAll();

        }

        @Test
        void testFindVehicleById() {
                // when
                vehicleService.findVehicleById(Mockito.anyInt());
                // then
                verify(vehicleRepository).findVehicleById(Mockito.anyInt());

        }

        @Test
        void testFindVehicleByLicensePlate() {
                // when
                vehicleService.findVehicleByLicensePlate(Mockito.anyString());
                // then
                verify(vehicleRepository).findVehicleByLicensePlate(Mockito.anyString());
        }

        @Test
        void testFindVehiclesByUserId_WithExistedUser() {
                // given
                User user = User.builder().email("user1test@gmail.com").password("Test123456").build();

                Vehicle vehicle1 = Vehicle.builder().userId(user).inUse(false).licensePlate("5HHH712").make("honda")
                                .model("pilot")
                                .year(1999).build();
                Vehicle vehicle2 = Vehicle.builder().userId(user).inUse(true).licensePlate("9MNB990").make("toyota")
                                .model("camry")
                                .year(2005).build();

                // when
                when(userRepository.findUserById(Mockito.anyInt())).thenReturn(user);
                when(vehicleRepository.findVehiclesInUseByUserId(user))
                                .thenReturn(Arrays.asList(vehicle1, vehicle2));

                List<Vehicle> result = vehicleService.findVehiclesByUserId(Mockito.anyInt());

                // then
                verify(vehicleRepository).findVehiclesInUseByUserId(user);

                assertThat(result.size()).isEqualTo(2);
        }

        @Test
        void testFindVehiclesByUserId_WithNonExistedUser() {
                // given
                User user = User.builder().email("user1test@gmail.com").password("Test123456").build();

                // when
                when(userRepository.findUserById(Mockito.anyInt())).thenReturn(null);

                List<Vehicle> result = vehicleService.findVehiclesByUserId(Mockito.anyInt());

                // then
                verify(vehicleRepository, never()).findVehiclesInUseByUserId(user);

                assertThat(result).isNull();
        }

        @Test
        void testSaveVehicle_Success() {
                // given
                VehicleRequest vehicleRequest = VehicleRequest.builder().inUse(true).licensePlate("8YYY782")
                                .make("honda")
                                .model("pilot")
                                .year(2015).build();

                // when
                vehicleService.saveVehicle(vehicleRequest);

                // then
                ArgumentCaptor<Vehicle> vehicleArgumentCaptor = ArgumentCaptor.forClass(Vehicle.class);

                verify(vehicleRepository).save(vehicleArgumentCaptor.capture());

                Vehicle capturedVehicle = vehicleArgumentCaptor.getValue();

                assertThat(capturedVehicle).isNotNull();
                assertThat(capturedVehicle.isInUse()).isTrue();
                assertThat(capturedVehicle.getLicensePlate()).isEqualTo("8YYY782");
                assertThat(capturedVehicle.getModel()).isEqualTo("pilot");
                assertThat(capturedVehicle.getYear()).isEqualTo(2015);

        }

        @Test
        void testSaveVehicle_NotSuccess() {
                // given
                VehicleRequest vehicleRequest = VehicleRequest.builder().inUse(true).licensePlate("8YYY782")
                                .make("honda")
                                .model("pilot")
                                .year(2015).build();
                Vehicle vehicle = Vehicle.builder().inUse(true).licensePlate("8YYY782").make("honda")
                                .model("pilot")
                                .year(2015).build();
                User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                                .lastName("Jose").driverLicense("Y672674").build();

                // when
                when(userRepository.findUserById(Mockito.anyInt())).thenReturn(user);
                when(vehicleRepository.findVehiclesInUseByUserId(Mockito.any(User.class)))
                                .thenReturn(Arrays.asList(vehicle));
                Vehicle result = vehicleService.saveVehicle(vehicleRequest);

                // then
                verify(userRepository).findUserById(Mockito.anyInt());
                verify(vehicleRepository).findVehiclesInUseByUserId(Mockito.any(User.class));
                verify(vehicleRepository, never()).save(Mockito.any(Vehicle.class));

                assertThat(result).isNull();

        }

        @Test
        void testSetVehicleToNotUse_UPDATED() {
                // given
                Vehicle vehicle = Vehicle.builder().inUse(true).licensePlate("8YYY782").make("honda")
                                .model("pilot")
                                .year(2015).build();

                // when
                when(vehicleRepository.findVehicleByLicensePlate(Mockito.anyString())).thenReturn(vehicle);

                String result = vehicleService.setVehicleToNotUse(Mockito.anyString());

                // then
                verify(vehicleRepository).save(vehicle);

                assertThat(result).isEqualTo("UPDATED");

        }

        @Test
        void testSetVehicleToNotUse_NOTEXIST() {
                // given

                // when
                when(vehicleRepository.findVehicleByLicensePlate(Mockito.anyString())).thenReturn(null);

                String result = vehicleService.setVehicleToNotUse(Mockito.anyString());

                // then
                verify(vehicleRepository, never()).save(Mockito.any(Vehicle.class));

                assertThat(result).isEqualTo("NOT EXIST");

        }

        @Test
        void testUpdateVehicle_UPDATED() {
                // given
                VehicleRequest vehicleRequest = VehicleRequest.builder().inUse(true).licensePlate("8YYY782")
                                .make("honda")
                                .model("pilot")
                                .year(2019).build();
                Vehicle existedVehicle = Vehicle.builder().inUse(true).licensePlate("8YYY782").make("toyota")
                                .model("camry")
                                .year(2015).build();

                when(vehicleRepository.findVehicleByLicensePlate(Mockito.any(String.class)))
                                .thenReturn(existedVehicle);
                // when
                String result = vehicleService.updateVehicle(vehicleRequest);

                // then
                ArgumentCaptor<String> strArgumentCaptor = ArgumentCaptor.forClass(String.class);
                ArgumentCaptor<Vehicle> vehicleArgumentCaptor = ArgumentCaptor.forClass(Vehicle.class);

                verify(vehicleRepository).findVehicleByLicensePlate(strArgumentCaptor.capture());
                verify(vehicleRepository).save(vehicleArgumentCaptor.capture());

                Vehicle capturedVehicle = vehicleArgumentCaptor.getValue();

                assertThat(result).isEqualTo("UPDATED");
                assertThat(capturedVehicle.getLicensePlate()).isEqualTo("8YYY782");
                assertThat(capturedVehicle.getMake()).isEqualTo("honda");
                assertThat(capturedVehicle.getModel()).isEqualTo("pilot");
                assertThat(capturedVehicle.getYear()).isEqualTo(2019);

        }

        @Test
        void testUpdateVehicle_NOTEXIST() {
                // given
                VehicleRequest vehicleRequest = VehicleRequest.builder().inUse(true).licensePlate("8YYY782")
                                .make("honda")
                                .model("pilot")
                                .year(2019).build();
                Vehicle existedVehicle = null;

                when(vehicleRepository.findVehicleByLicensePlate(Mockito.any(String.class)))
                                .thenReturn(existedVehicle);
                // when
                String result = vehicleService.updateVehicle(vehicleRequest);

                // then
                verify(vehicleRepository).findVehicleByLicensePlate(Mockito.anyString());
                verify(vehicleRepository, never()).save(Mockito.any(Vehicle.class));

                assertThat(result).isEqualTo("NOT EXIST");

        }

        @Test
        void testFindAllVehicles2() {

        }

        @Test
        void testFindVehicleById2() {

        }

        @Test
        void testFindVehicleByLicensePlate2() {

        }

        @Test
        void testFindVehiclesByUserId() {

        }

        @Test
        void testSaveVehicle() {

        }

        @Test
        void testSetVehicleToNotUse() {

        }

        @Test
        void testUpdateVehicle() {

        }
}
