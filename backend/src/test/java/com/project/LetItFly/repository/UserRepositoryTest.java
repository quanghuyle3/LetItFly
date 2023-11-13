package com.project.LetItFly.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.project.LetItFly.model.Role;
import com.project.LetItFly.model.User;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.util.List;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void testSave() {
        // given
        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();

        // when
        user = userRepository.save(user);

        // then
        assertThat(user.getId()).isGreaterThan(0);
        assertThat(user.getFirstName()).isEqualTo("Andy");
        assertThat(user.getDriverLicense()).isEqualTo("Y672674");
    }

    @Test
    void testSave_Update() {
        // given
        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user = userRepository.save(user);

        // when
        user.setLastName("Edan");
        user.setDriverLicense("H999999");
        user = userRepository.save(user);

        // then
        assertThat(user.getLastName()).isEqualTo("Edan");
        assertThat(user.getDriverLicense()).isEqualTo("H999999");

    }

    @Test
    void testFindUserById() {
        // given
        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();

        user = userRepository.save(user);

        // when
        User retrievedUser = userRepository.findUserById(user.getId());

        // then
        assertThat(retrievedUser).isEqualTo(user);

    }

    @Test
    void findUserByEmail() {
        // given
        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();

        user = userRepository.save(user);

        // when
        User retrievedUser = userRepository.findUserByEmail(user.getEmail());

        // then
        assertThat(retrievedUser).isEqualTo(user);
    }

    @Test
    void findUsersByRoles_Case1() {
        // given
        Role role = Role.builder().name("Sample Role").build();
        role = roleRepository.save(role);

        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user.addRole(role);

        user = userRepository.save(user);

        // when
        List<User> retrievedUsers = userRepository.findUsersByRoles(role);

        // then
        assertThat(retrievedUsers.size()).isEqualTo(1);
        assertThat(retrievedUsers.get(0)).isEqualTo(user);
    }

    @Test
    void findUsersByRoles_Case2() {
        // given
        Role role = Role.builder().name("Sample Role").build();
        role = roleRepository.save(role);

        User user1 = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user1.addRole(role);
        User user2 = User.builder().email("useraccount2@gmail.com").password("Test123456").firstName("Karik")
                .lastName("Sah").driverLicense("O999812").build();
        user2.addRole(role);

        user1 = userRepository.save(user1);
        user2 = userRepository.save(user2);

        // when
        List<User> retrievedUsers = userRepository.findUsersByRoles(role);

        // then
        assertThat(retrievedUsers.size()).isEqualTo(2);
    }

    @Test
    void findUsersByTwoRoles() {
        // given
        Role role1 = Role.builder().name("Sample Role").build();
        role1 = roleRepository.save(role1);
        Role role2 = Role.builder().name("Sample Role 2").build();
        role2 = roleRepository.save(role2);

        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user.addRole(role1);
        user.addRole(role2);

        user = userRepository.save(user);

        // when
        List<User> retrievedUsers = userRepository.findUsersByTwoRoles(role1, role2);

        // then
        assertThat(retrievedUsers.size()).isEqualTo(1);
    }

    @Test
    void findUserByDriverLicense() {
        // given
        User user = User.builder().email("useraccount@gmail.com").password("Test123456").firstName("Andy")
                .lastName("Jose").driverLicense("Y672674").build();
        user = userRepository.save(user);

        // when
        User retrievedUser = userRepository.findUserByDriverLicense(user.getDriverLicense());

        // then
        assertThat(retrievedUser).isEqualTo(user);
    }
}