package com.hotel.bootstrap;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hotel.entities.Hotel;
import com.hotel.entities.Room;
import com.hotel.entities.RoomType;
import com.hotel.entities.User;
import com.hotel.entities.UserRole;
import com.hotel.entities.AccountStatus;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.RoomTypeRepository;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            loadInitialData();
        } catch (Exception e) {
            log.error("Failed to load initial data: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void loadInitialData() {
        // Load users if they don't exist
        List<User> users;
        if (userRepository.count() == 0) {
            log.info("Loading default users...");
            users = createUsers();
            userRepository.saveAll(users);
            log.info("Default users created: admin@stays.in, user@stays.in, owner@stays.in");

            // Create only one test user
            User testUser = new User();
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            testUser.setEmail("test@test.com");
            testUser.setPassword(passwordEncoder.encode("test123"));
            testUser.setDob(LocalDate.of(1990, 1, 1));
            testUser.setRegAmount(0);
            testUser.setPhone("1234567890");
            testUser.setAddress("Test Address");
            testUser.setUserRole(UserRole.ROLE_CUSTOMER);
            testUser.setAccountStatus(AccountStatus.ACTIVE);

            userRepository.save(testUser);
            log.info("Test user created: test@test.com / test123");
        } else {
            log.info("Users already exist. Skipping user creation.");
        }

        // Load hotels and room types if they don't exist (TEMPORARILY ENABLED for
        // testing)
        if (hotelRepository.count() == 0) {
            log.info("Loading sample hotels and room types for testing...");

            // Get hotel owner user
            User owner = userRepository.findByEmail("owner@stays.in")
                    .orElseThrow(() -> new RuntimeException("Hotel owner user not found"));

            List<Hotel> hotels = createHotels(owner);
            hotelRepository.saveAll(hotels);
            log.info("Sample hotels created");

            List<RoomType> roomTypes = createRoomTypes(hotels);
            roomTypeRepository.saveAll(roomTypes);
            log.info("Sample room types created");
        } else {
            log.info("Hotels already exist. Skipping hotel creation.");
        }

        // Create Rooms separately - even if hotels already exist
        // This allows adding Room entities to existing data
        if (roomRepository.count() == 0) {
            log.info("No rooms found. Creating rooms for existing room types...");
            List<RoomType> existingRoomTypes = roomTypeRepository.findAll();
            if (!existingRoomTypes.isEmpty()) {
                List<Room> rooms = createRooms(existingRoomTypes);
                roomRepository.saveAll(rooms);
                log.info("Sample rooms created: {} total rooms", rooms.size());
            } else {
                log.warn("No room types found to create rooms from");
            }
        } else {
            log.info("Rooms already exist: {} rooms found", roomRepository.count());
        }
    }

    private List<User> createUsers() {
        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@stays.in");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setDob(LocalDate.of(1990, 1, 1));
        admin.setRegAmount(0);
        admin.setPhone("1234567890");
        admin.setAddress("Admin Address");
        admin.setUserRole(UserRole.ROLE_ADMIN);
        admin.setAccountStatus(AccountStatus.ACTIVE);

        User customer = new User();
        customer.setFirstName("John");
        customer.setLastName("Customer");
        customer.setEmail("user@stays.in");
        customer.setPassword(passwordEncoder.encode("password123"));
        customer.setDob(LocalDate.of(1995, 5, 15));
        customer.setRegAmount(0);
        customer.setPhone("9876543210");
        customer.setAddress("Customer Address");
        customer.setUserRole(UserRole.ROLE_CUSTOMER);
        customer.setAccountStatus(AccountStatus.ACTIVE);

        User hotelManager = new User();
        hotelManager.setFirstName("Hotel");
        hotelManager.setLastName("Manager");
        hotelManager.setEmail("owner@stays.in");
        hotelManager.setPassword(passwordEncoder.encode("owner123"));
        hotelManager.setDob(LocalDate.of(1985, 3, 10));
        hotelManager.setRegAmount(0);
        hotelManager.setPhone("5555555555");
        hotelManager.setAddress("Manager Address");
        hotelManager.setUserRole(UserRole.ROLE_HOTEL_MANAGER);
        hotelManager.setAccountStatus(AccountStatus.ACTIVE);

        return Arrays.asList(admin, customer, hotelManager);
    }

    private List<Hotel> createHotels(User owner) {
        Hotel hotel1 = new Hotel();
        hotel1.setName("Taj Lands End");
        hotel1.setCity("Mumbai");
        hotel1.setState("Maharashtra");
        hotel1.setAddress("Marine Drive, Mumbai");
        hotel1.setRating(4.5);
        hotel1.setRatingCount(1250);
        hotel1.setRatingText("Excellent");
        hotel1.setDistance("5.1 km to City centre");
        hotel1.setLocation("Marine Drive, Mumbai");
        hotel1.setDescription("Luxury hotel with ocean views");
        hotel1.setStatus("APPROVED");
        hotel1.setPriceRange("15,000 - 50,000");
        hotel1.setOwner(owner);
        hotel1.setImages(
                "[\"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60\",\"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=60\"]");
        hotel1.setWifi(true);
        hotel1.setParking(true);
        hotel1.setGym(true);
        hotel1.setRestaurant(true);

        Hotel hotel2 = new Hotel();
        hotel2.setName("The Grand Palace");
        hotel2.setCity("Jaipur");
        hotel2.setState("Rajasthan");
        hotel2.setAddress("City Palace Road, Jaipur");
        hotel2.setRating(4.8);
        hotel2.setRatingCount(987);
        hotel2.setRatingText("Exceptional");
        hotel2.setDistance("3.2 km to City centre");
        hotel2.setLocation("City Palace Road, Jaipur");
        hotel2.setDescription("Palace hotel with royal heritage");
        hotel2.setStatus("APPROVED");
        hotel2.setPriceRange("30,000 - 80,000");
        hotel2.setOwner(owner);
        hotel2.setImages(
                "[\"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=60\",\"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=60\"]");
        hotel2.setWifi(true);
        hotel2.setParking(true);
        hotel2.setRestaurant(true);

        return Arrays.asList(hotel1, hotel2);
    }

    private List<RoomType> createRoomTypes(List<Hotel> hotels) {
        RoomType room1 = new RoomType();
        room1.setName("Ocean View Room");
        room1.setDescription("Spacious room with ocean view");
        room1.setPricePerNight(new BigDecimal("18500"));
        room1.setCapacity(2);
        room1.setTotalRooms(10);
        room1.setBeds("1 King Bed");
        room1.setHotel(hotels.get(0));

        RoomType room2 = new RoomType();
        room2.setName("Premier Heritage Room");
        room2.setDescription("Luxury room with royal decor");
        room2.setPricePerNight(new BigDecimal("45000"));
        room2.setCapacity(2);
        room2.setTotalRooms(5);
        room2.setBeds("1 King Bed");
        room2.setHotel(hotels.get(1));

        return Arrays.asList(room1, room2);
    }

    private List<Room> createRooms(List<RoomType> roomTypes) {
        List<Room> allRooms = new ArrayList<>();

        for (RoomType roomType : roomTypes) {
            int totalRooms = roomType.getTotalRooms();

            for (int i = 1; i <= totalRooms; i++) {
                Room room = new Room();
                room.setHotel(roomType.getHotel());
                room.setRoomType(roomType);
                // Room number format: RT{roomTypeId}-{sequential number}
                room.setRoomNumber(String.format("RT%d-%03d", roomType.getId(), i));
                room.setIsActive(true);
                room.setStatus("AVAILABLE");

                allRooms.add(room);
            }

            log.info("Created {} rooms for room type: {}", totalRooms, roomType.getName());
        }

        return allRooms;
    }
}