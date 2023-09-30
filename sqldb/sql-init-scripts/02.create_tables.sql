USE let_it_fly;

CREATE TABLE user(
		id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        birthdate DATE,
        gender VARCHAR(50),
        address VARCHAR(150),
        phone VARCHAR(50),
        date_join DATE,
        active BOOLEAN DEFAULT TRUE,
        verified BOOLEAN DEFAULT FALSE
        )AUTO_INCREMENT = 10000;

-- type: type of card (debit/credit)
-- name: person's name on the card
-- expiration: 12/2024
CREATE TABLE payment(
		card_number VARCHAR(50) PRIMARY KEY,
        expiration VARCHAR(50),
        cvv INT,
        type VARCHAR(50), 
        user_id INT,
        name VARCHAR(100),
        billing_address VARCHAR(150),
        balance DOUBLE DEFAULT 0.00, 
        CONSTRAINT payment_user_fk FOREIGN KEY (user_id) REFERENCES user(id));

CREATE TABLE driver_status(
		user_id INT PRIMARY KEY,
        dispatch BOOLEAN, 
        seat_available INT,
        CONSTRAINT driver_status_user_fk FOREIGN KEY (user_id) REFERENCES user(id));

CREATE TABLE vehicle(
		license_plate VARCHAR(50) PRIMARY KEY,
        make VARCHAR(50),
        model VARCHAR(50),
        year INT,
        type VARCHAR(50),
        user_id INT,
        CONSTRAINT vehicle_user_fk FOREIGN KEY (user_id) REFERENCES user(id));
        
        
CREATE TABLE role(
		id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL); 


CREATE TABLE user_role(
		user_id INT,
        role_id INT,
        PRIMARY KEY(user_id, role_id),
        CONSTRAINT user_role_user_fk FOREIGN KEY (user_id) REFERENCES user(id), 
        CONSTRAINT user_role_role_fk FOREIGN KEY (role_id) REFERENCES role(id));
        

-- time duration: hh-mm-ss
CREATE TABLE history_log(
		id INT PRIMARY KEY AUTO_INCREMENT,
        driver_id INT,
        passenger_id INT,
        date DATE,
        pickup_location VARCHAR(150),
        destination VARCHAR(150),
        distance DOUBLE,
        time_duration TIME,
        cost DOUBLE,
        CONSTRAINT history_log_user_fk1 FOREIGN KEY (driver_id) REFERENCES user(id),
        CONSTRAINT history_log_user_fk2 FOREIGN KEY (passenger_id) REFERENCES user(id));