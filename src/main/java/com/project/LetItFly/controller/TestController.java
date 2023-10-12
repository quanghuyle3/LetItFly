package com.project.LetItFly.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.LetItFly.model.DriverStatus;
import com.project.LetItFly.model.HistoryLog;
import com.project.LetItFly.model.Payment;
import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;
import com.project.LetItFly.model.Vehicle;
import com.project.LetItFly.requestModel.UserRequest;
import com.project.LetItFly.service.DriverStatusService;
import com.project.LetItFly.service.HistoryLogService;
import com.project.LetItFly.service.PaymentService;
import com.project.LetItFly.service.RoleService;
import com.project.LetItFly.service.UserService;
import com.project.LetItFly.service.VehicleService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class TestController {

    private UserService userService;
    private RoleService roleService;
    private HistoryLogService historyLogService;
    private PaymentService paymentService;
    private VehicleService vehicleService;
    private DriverStatusService driverStatusService;
    // private Principal principal;

    @Autowired
    public TestController(UserService userService, RoleService roleService, HistoryLogService historyLogService,
            PaymentService paymentService, VehicleService vehicleService, DriverStatusService driverStatusService) {
        this.userService = userService;
        this.roleService = roleService;
        this.historyLogService = historyLogService;
        this.paymentService = paymentService;
        this.vehicleService = vehicleService;
        this.driverStatusService = driverStatusService;
        // this.principal = principal;
    }

    // USER
    @GetMapping("/retrieveAllUsers")
    public List<User> retrieveAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/findUser")
    public User findUser(@RequestParam("id") int id) {
        return userService.findUserById(id);
    }

    @GetMapping("findUserByEmail")
    public User findUserByEmail(@RequestParam("email") String email) {
        return userService.findUserByEmail(email);
    }

    @GetMapping("/findUsersHold2Roles")
    public List<User> retrieveAllUsersHold2Roles() {
        return userService.findUsersHold2Roles();
    }

    @PostMapping("/saveUser")
    public User saveUser(@RequestBody UserRequest userRequest) {
        return userService.saveUser(userRequest);
    }

    @PostMapping("/updateUser")
    public String updateUser(@RequestBody UserRequest userRequest) {
        return userService.updateUser(userRequest);
    }

    @GetMapping("/sessionUser")
    public Principal getPrincipal(Principal principal) {
        return principal;
    }

    // ROLE

    @GetMapping("/retrieveAllRoles")
    public List<Role> retrieveAllRoles() {
        return roleService.findAllRoles();
    }

    @GetMapping("/findRole")
    public Role findRole(@RequestParam("roleName") String roleName) {
        return roleService.findByName(roleName);
    }

    // HISTORY LOG

    @GetMapping("/retrieveAllHistoryLogs")
    public List<HistoryLog> retriveAllHistoryLogs() {
        return historyLogService.findAllHistoryLog();
    }

    @GetMapping("/findHistoryLog")
    public HistoryLog findHistoryLog(@RequestParam("id") int id) {
        return historyLogService.findHistoryLogById(id);
    }

    @GetMapping("/findHistoryLogsByDriverId")
    public List<HistoryLog> findHistoryLogsByDriverId(@RequestParam("id") int id) {
        return historyLogService.findHistoryLogsByDriverId(id);
    }

    @GetMapping("/findHistoryLogsByPassengerId")
    public List<HistoryLog> findHistoryLogsByPassengerId(@RequestParam("id") int id) {
        return historyLogService.findHistoryLogsByPassengerId(id);
    }

    // PAYMENT
    @GetMapping("/retrieveAllPayments")
    public List<Payment> retrieveAllPayments() {
        return paymentService.findAllPayments();
    }

    @GetMapping("/findPaymentById")
    public Payment findPaymentById(@RequestParam("id") int id) {
        return paymentService.findPaymentById(id);
    }

    @GetMapping("/findPaymentByCardNumber")
    public Payment findPaymentByCardNumber(@RequestParam("cardNumber") String cardNumber) {
        return paymentService.findPaymentByCardNumber(cardNumber);
    }

    @GetMapping("/findPaymentsByUserId")
    public List<Payment> findPaymentsByUserId(@RequestParam("userId") int userId) {
        return paymentService.findPaymentsByUserId(userId);
    }

    // VEHICLE
    @GetMapping("/retrieveAllVehicles")
    public List<Vehicle> retrieveAllVehicles() {
        return vehicleService.findAllVehicles();
    }

    @GetMapping("/findVehicleById")
    public Vehicle findVehicleById(@RequestParam("id") int id) {
        return vehicleService.findVehicleById(id);
    }

    @GetMapping("/findVehicleByLicensePlate")
    public Vehicle findVehicleByLicensePlate(@RequestParam("licensePlate") String licensePlate) {
        return vehicleService.findVehicleByLicensePlate(licensePlate);
    }

    @GetMapping("/findVehiclesByUserId")
    public List<Vehicle> findVehiclesByUserId(@RequestParam("userId") int userId) {
        return vehicleService.findVehiclesByUserId(userId);
    }

    // DRIVER STATUS
    @GetMapping("/retrieveAllDriverStatus")
    public List<DriverStatus> retrieveAllDriverStatus() {
        return driverStatusService.findAllDriverStatus();
    }

    @GetMapping("/findDriverStatusById")
    public DriverStatus findDriverStatusById(@RequestParam("id") int id) {
        return driverStatusService.findDriverStatusById(id);
    }

    @GetMapping("/findDriverStatusByUserId")
    public DriverStatus findDriverStatusByUserId(@RequestParam("userId") int userId) {
        return driverStatusService.findDriverStatusByUserId(userId);
    }

}
