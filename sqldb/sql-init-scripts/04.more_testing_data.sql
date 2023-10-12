USE let_it_fly;

INSERT INTO user (email, password, first_name, birthdate, address, phone, driver_license) VALUES
		("driveraccount2@gmail.com", "$2a$10$591ppVsEmSnbkbTCZDapmuytr//Txp5I7Zm9dfuDKfiI7W9gHcdIq", "George", "2001-10-07", "3rd Street, San Jose, CA 95121", "4095627864", "K6728892");
INSERT INTO user (email, password, first_name, birthdate, address, phone) VALUES
		("passengeraccount2@gmail.com", "$2a$10$591ppVsEmSnbkbTCZDapmuytr//Txp5I7Zm9dfuDKfiI7W9gHcdIq", "Sally", "2003-06-07", "4rd Street, San Jose, CA 95121", "4095627864");
        
INSERT INTO user (email, password) VALUES
		("driveraccount3@gmail.com", "$2a$10$591ppVsEmSnbkbTCZDapmuytr//Txp5I7Zm9dfuDKfiI7W9gHcdIq"),
		("passengeraccount3@gmail.com", "$2a$10$591ppVsEmSnbkbTCZDapmuytr//Txp5I7Zm9dfuDKfiI7W9gHcdIq");
        
INSERT INTO payment (card_number, expiration, cvv, type, user_id, name, billing_address) VALUES
		("1000000000000003", "10/2024", 123, "debit", 10002, "Kevin Star", "5rd Street, San Jose, CA 95121"),
        ("1000000000000004", "10/2025", 123, "debit", 10003, "Sally Luu", "4rd Street, San Jose, CA 95121"),
        ("1000000000000005", "11/2025", 123, "debit", 10004, "Daniel Young", "5rd Street, San Jose, CA 95121"),
        ("1000000000000006", "11/2025", 123, "debit", 10005, "Emily Marta", "4rd Street, San Jose, CA 95121"),
        ("1000000000000007", "10/2024", 123, "debit", 10002, "Andy Viktor", "5rd Street, San Jose, CA 95121");
	
INSERT INTO user_role(user_id, role_id) VALUES
		(10002, 1),
        (10004, 1),
        (10003, 2),
        (10005, 2);
		
INSERT INTO vehicle (license_plate, make, model, year, type, user_id) VALUES
		("5SHS555", "chevrolet", "corvette", 2023, "sedan", 10002),
        ("3MNM343", "chevrolet", "camaro", 2023, "sedan", 10004),
        ("4HHH4545", "nissan", "gtr", 2023, "sedan", 10002); 

INSERT INTO driver_status (user_id, dispatch, seat_available) VALUES
		(10002, false, 4),
        (10004, false, 4); 
        
INSERT INTO history_log (driver_id, passenger_id, date, pickup_location, destination, distance, time_duration, cost) VALUES
		(10002, 10003, "2023-12-16", "9th Street, San Jose, CA 95100", "Airport Way, San Francisco, CA 95334", 23.8, "02:12", 36.50),
        (10004, 10005, "2023-12-20", "Airport Way, San Francisco, CA 95334", "9th Street, San Jose, CA 95100", 23.8, "02:20", 32.50);

