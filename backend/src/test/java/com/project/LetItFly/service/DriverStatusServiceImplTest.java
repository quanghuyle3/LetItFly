package com.project.LetItFly.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.LetItFly.model.DriverStatus;
import com.project.LetItFly.model.User;
import com.project.LetItFly.repository.DriverStatusRepository;
import com.project.LetItFly.repository.UserRepository;
import com.project.LetItFly.requestModel.DriverStatusRequest;

@ExtendWith(MockitoExtension.class)
public class DriverStatusServiceImplTest {

    @Mock
    private DriverStatusRepository driverStatusRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DriverStatusServiceImpl driverStatusService;

    @Test
    void testDeleteByDriverId_SUCCESS() {
        // given
        User driver = User.builder().email("sampleemail@gmail.com").password("Test123456").build();
        DriverStatus ds = new DriverStatus();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(driver);
        when(driverStatusRepository.findDriverStatusByUserId(Mockito.any(User.class))).thenReturn(ds);
        String result = driverStatusService.deleteByDriverId(Mockito.anyInt());

        // then
        verify(driverStatusRepository).delete(Mockito.any(DriverStatus.class));
        assertThat(result).isEqualTo("SUCCESS");
    }

    @Test
    void testDeleteByDriverId_NOTEXIST() {
        // given
        User driver = User.builder().email("sampleemail@gmail.com").password("Test123456").build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(driver);
        when(driverStatusRepository.findDriverStatusByUserId(Mockito.any(User.class))).thenReturn(null);
        String result = driverStatusService.deleteByDriverId(Mockito.anyInt());

        // then
        verify(driverStatusRepository, never()).delete(Mockito.any(DriverStatus.class));
        assertThat(result).isEqualTo("NOT EXIST");
    }

    @Test
    void testFindAllDriverStatus() {
        // when
        driverStatusService.findAllDriverStatus();
        // then
        verify(driverStatusRepository).findAll();

    }

    @Test
    void testFindDriverStatusById() {
        // when
        driverStatusService.findDriverStatusById(5);
        // then
        verify(driverStatusRepository).findDriverStatusById(5);
    }

    @Test
    void testFindDriverStatusByUserId() {
        // given
        User user = User.builder().email("sampleemail@gmail.com").password("Test123456").build();

        // when
        when(userRepository.findUserById(3)).thenReturn(user);
        driverStatusService.findDriverStatusByUserId(3);

        // then
        verify(driverStatusRepository).findDriverStatusByUserId(Mockito.any(User.class));

    }

    @Test
    void testSave_IF() {
        // given
        User driver = User.builder().email("sampleemail@gmail.com").password("Test123456").build();
        DriverStatusRequest dsRequest = new DriverStatusRequest();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(driver);
        when(driverStatusRepository.findDriverStatusByUserId(Mockito.any(User.class))).thenReturn(null);
        String result = driverStatusService.save(dsRequest);

        // then
        verify(driverStatusRepository).save(Mockito.any());
        assertThat(result).isEqualTo("SUCCESS");
    }

    @Test
    void testSave_ELSE() {
        // given
        User driver = User.builder().email("sampleemail@gmail.com").password("Test123456").build();
        DriverStatus driverStatus = DriverStatus.builder().userId(driver).curLat(-37.9862).curLong(120.85733).build();
        DriverStatusRequest dsRequest = new DriverStatusRequest();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(driver);
        when(driverStatusRepository.findDriverStatusByUserId(Mockito.any(User.class))).thenReturn(driverStatus);
        String result = driverStatusService.save(dsRequest);

        // then
        verify(driverStatusRepository).save(Mockito.any());
        assertThat(result).isEqualTo("SUCCESS");
    }

    @Test
    void testUpdateCoordinatesDriver_SUCCESS() {
        // given
        User driver = User.builder().email("sampleemail@gmail.com").password("Test123456").build();
        DriverStatus driverStatus = DriverStatus.builder().userId(driver).curLat(-37.9862).curLong(120.85733).build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(driver);
        when(driverStatusRepository.findDriverStatusByUserId(Mockito.any(User.class))).thenReturn(driverStatus);
        String result = driverStatusService.updateCoordinatesDriver(3, 12.890, 34.000);

        // then
        verify(driverStatusRepository).save(Mockito.any());
        assertThat(result).isEqualTo("SUCCESS");
    }

    @Test
    void testUpdateCoordinatesDriver_NOTEXIST() {
        // given
        User driver = User.builder().email("sampleemail@gmail.com").password("Test123456").build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(driver);
        when(driverStatusRepository.findDriverStatusByUserId(Mockito.any(User.class))).thenReturn(null);
        String result = driverStatusService.updateCoordinatesDriver(3, 12.890, 34.000);

        // then
        verify(driverStatusRepository, never()).save(Mockito.any());
        assertThat(result).isEqualTo("NOT EXIST");
    }

    @Test
    void testUpdateDispatchStatus_SUCCESS() {
        // given
        User user = User.builder().email("sampleemail@gmail.com").password("Test123456").build();
        DriverStatus driverStatus = DriverStatus.builder().userId(user).curLat(-37.9862).curLong(120.85733).build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(user);
        when(driverStatusRepository.findDriverStatusByUserId(user)).thenReturn(driverStatus);
        String result = driverStatusService.updateDispatchStatus(Mockito.anyInt(), true);

        // then
        verify(driverStatusRepository).save(Mockito.any(DriverStatus.class));
        assertThat(result).isEqualTo("SUCCESS");
    }

    @Test
    void testUpdateDispatchStatus_NOTEXIST() {
        // given
        User user = User.builder().email("sampleemail@gmail.com").password("Test123456").build();

        // when
        when(userRepository.findUserById(Mockito.anyInt())).thenReturn(user);
        when(driverStatusRepository.findDriverStatusByUserId(user)).thenReturn(null);
        String result = driverStatusService.updateDispatchStatus(Mockito.anyInt(), true);

        // then
        verify(driverStatusRepository, never()).save(Mockito.any(DriverStatus.class));
        assertThat(result).isEqualTo("NOT EXIST");
    }
}
