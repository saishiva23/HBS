package com.hotel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@Slf4j
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
		log.info("Server started on port 8080");
	}

	// ModelMapper bean is now configured in ModelMapperConfig.java

	// centralized method to config password encoder
	@Bean
	public PasswordEncoder passwordEncoder() {
		log.info("in password encoder bean");
		return new BCryptPasswordEncoder();
	}

	@Bean
	public org.springframework.boot.CommandLineRunner debugRunner(com.hotel.repository.RoomTypeRepository repo) {
		return args -> {
			log.info("=== DEBUG: STARTING ROOM TYPE CHECK ===");
			repo.findAll().forEach(rt -> log.info("Found RoomType - ID: {}, Name: {}, HotelID: {}", rt.getId(),
					rt.getName(), rt.getHotel().getId()));
			log.info("=== DEBUG: END ROOM TYPE CHECK ===");
		};
	}
}
