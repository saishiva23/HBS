package com.hotel.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.HotelDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomTypeRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.custom_exceptions.InvalidInputException;
import com.hotel.dtos.HotelRegistrationDTO;
import com.hotel.dtos.UserRegDTO;
import com.hotel.entities.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.hotel.repository.BookingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final com.hotel.repository.UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    private final com.hotel.security.JwtUtils jwtUtils;

    @Override
    public List<Hotel> getAllHotels() {
        try {
            log.debug("Getting all hotels");
            return hotelRepository.findAll();
        } catch (Exception e) {
            log.error("Error getting all hotels", e);
            throw new RuntimeException("Failed to retrieve hotels", e);
        }
    }

    @Override
    public Hotel getHotelDetails(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Hotel ID cannot be null");
        }

        try {
            log.debug("Getting hotel details for ID: {}", id);
            return hotelRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + id));
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error getting hotel details for ID: {}", id, e);
            throw new RuntimeException("Failed to retrieve hotel details", e);
        }
    }

    @Override
    public List<Hotel> searchHotels(String city, String state, String destination) {
        try {
            log.info("Searching hotels with city: {}, state: {}, destination: {}", city, state, destination);

            if (city != null && !city.trim().isEmpty()) {
                return hotelRepository.findByCityContainingIgnoreCase(city);
            }

            return getAllHotels();
        } catch (Exception e) {
            log.error("Error searching hotels", e);
            throw new RuntimeException("Failed to search hotels", e);
        }
    }

    @Override
    public List<RoomType> getHotelRooms(Long hotelId) {
        if (hotelId == null) {
            throw new IllegalArgumentException("Hotel ID cannot be null");
        }

        try {
            log.debug("Getting rooms for hotel ID: {}", hotelId);
            return roomTypeRepository.findByHotelId(hotelId);
        } catch (Exception e) {
            log.error("Error getting rooms for hotel ID: {}", hotelId, e);
            throw new RuntimeException("Failed to retrieve hotel rooms", e);
        }
    }

    @Override
    public Boolean checkRoomAvailability(Long hotelId, Long roomTypeId, String checkIn, String checkOut,
            Integer rooms) {
        try {
            java.time.LocalDate checkInDate = java.time.LocalDate.parse(checkIn);
            java.time.LocalDate checkOutDate = java.time.LocalDate.parse(checkOut);

            // Get total rooms of this type
            Long totalRooms = roomRepository.countAvailableRooms(hotelId, roomTypeId);

            // Get booked rooms in this date range
            Long bookedRooms = bookingRepository.countBookingsInDateRange(hotelId, roomTypeId, checkInDate,
                    checkOutDate);

            // Check if requested rooms are available
            Long availableRooms = totalRooms - bookedRooms;

            log.info("Availability check - Total: {}, Booked: {}, Available: {}, Requested: {}",
                    totalRooms, bookedRooms, availableRooms, rooms);

            return availableRooms >= rooms;
        } catch (Exception e) {
            log.error("Error checking room availability", e);
            throw new RuntimeException("Failed to check room availability", e);
        }
    }

    @Override
    public Hotel addNewHotel(HotelDTO hotelDTO, String ownerEmail) {
        try {
            log.info("Adding new hotel for owner: {}", ownerEmail);

            // 1. Get Owner
            com.hotel.entities.User owner = userRepository.findByEmail(ownerEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + ownerEmail));

            // 2. Map DTO to Entity
            Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);

            // 3. Set Defaults & Relationships
            hotel.setOwner(owner);
            hotel.setStatus("APPROVED"); // Auto-approve all hotels (admin approval bypassed)
            hotel.setRating(0.0);
            hotel.setRatingCount(0);

            // Handle JSON fields manually
            try {
                if (hotelDTO.getAmenities() != null) {
                    hotel.setAmenities(objectMapper.writeValueAsString(hotelDTO.getAmenities()));
                }
                if (hotelDTO.getImages() != null) {
                    hotel.setImages(objectMapper.writeValueAsString(hotelDTO.getImages()));
                }
            } catch (Exception e) {
                log.error("Error serializing hotel JSON fields", e);
                // continue, fields will be null or whatever mapper set
            }

            // 4. Save
            Hotel savedHotel = hotelRepository.save(hotel);
            log.info("Hotel saved with ID: {}", savedHotel.getId());

            return savedHotel;
        } catch (Exception e) {
            log.error("Error adding hotel", e);
            throw new RuntimeException("Failed to add hotel", e);
        }
    }

    @Override
    public List<Hotel> getHotelsByStatus(String status) {
        try {
            log.info("Getting hotels with status: {}", status);
            return hotelRepository.findByStatus(status);
        } catch (Exception e) {
            log.error("Error getting hotels by status", e);
            throw new RuntimeException("Failed to retrieve hotels by status", e);
        }
    }

    @Override
    public Hotel updateHotelStatus(Long hotelId, String status) {
        try {
            log.info("Updating hotel ID: {} status to: {}", hotelId, status);

            Hotel hotel = hotelRepository.findById(hotelId)
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));

            hotel.setStatus(status);
            return hotelRepository.save(hotel);
        } catch (Exception e) {
            log.error("Error updating hotel status", e);
            throw new RuntimeException("Failed to update hotel status", e);
        }
    }

    @Override
    public List<com.hotel.dtos.DestinationDTO> getPopularDestinations(String type) {
        try {
            List<Hotel> allHotels = hotelRepository.findByStatus("APPROVED");

            // Group by City or State
            java.util.Map<String, List<Hotel>> grouped;
            if ("state".equalsIgnoreCase(type)) {
                grouped = allHotels.stream()
                        .filter(h -> h.getState() != null)
                        .collect(java.util.stream.Collectors.groupingBy(h -> h.getState().trim()));
            } else {
                // Default to City
                grouped = allHotels.stream()
                        .filter(h -> h.getCity() != null)
                        .collect(java.util.stream.Collectors.groupingBy(h -> h.getCity().trim()));
            }

            return grouped.entrySet().stream().map(entry -> {
                String name = entry.getKey();
                List<Hotel> hotels = entry.getValue();

                // Calculate Stats
                Long count = (long) hotels.size();
                Double avgRating = hotels.stream().mapToDouble(Hotel::getRating).average().orElse(0.0);
                // Simplify image picking: take first hotel's first image or default
                String image = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=60"; // fallback

                for (Hotel h : hotels) {
                    if (h.getImages() != null && h.getImages().length() > 5) { // minimal valid json length
                        try {
                            String raw = h.getImages();
                            if (raw.contains("http")) {
                                // extremely naive parser: extract first http link
                                int start = raw.indexOf("http");
                                int end = raw.indexOf("\"", start);
                                if (end == -1)
                                    end = raw.indexOf("'", start);
                                if (end > start) {
                                    image = raw.substring(start, end);
                                    break; // found one
                                }
                            }
                        } catch (Exception e) {
                            // ignore parse error, use default
                        }
                    }
                }

                Double dummyPrice = avgRating > 0 ? avgRating * 1500 : 3500.0;

                // Extract cities if type is state
                java.util.List<String> cityList = null;
                if ("state".equalsIgnoreCase(type)) {
                    cityList = hotels.stream()
                            .map(Hotel::getCity)
                            .filter(java.util.Objects::nonNull)
                            .distinct()
                            .limit(5)
                            .collect(java.util.stream.Collectors.toList());
                }

                return new com.hotel.dtos.DestinationDTO(name, count.intValue(), dummyPrice, image, cityList);
            })
                    .sorted((a, b) -> b.getHotels().compareTo(a.getHotels())) // Sort by count desc
                    .limit(10)
                    .collect(java.util.stream.Collectors.toList());

        } catch (Exception e) {
            log.error("Error fetching popular destinations", e);
            return new java.util.ArrayList<>();
        }
    }

    @Override
    public Hotel registerHotelWithUser(HotelRegistrationDTO registrationDTO) {
        log.info("Registering new hotel with new user: {}", registrationDTO.getUser().getEmail());

        // 1. Create User
        UserRegDTO userDTO = registrationDTO.getUser();
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new InvalidInputException("User already exists with this email");
        }

        com.hotel.entities.User user = modelMapper.map(userDTO, com.hotel.entities.User.class);
        user.setUserRole(UserRole.ROLE_HOTEL_MANAGER); // Explicitly set as Manager
        user.setAccountStatus("ACTIVE");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        com.hotel.entities.User savedUser = userRepository.save(user);
        log.info("User created with ID: {}", savedUser.getId());

        // 2. Create Hotel
        HotelDTO hotelDTO = registrationDTO.getHotel();
        Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);

        hotel.setOwner(savedUser);
        hotel.setStatus("PENDING");
        hotel.setRating(0.0);
        hotel.setRatingCount(0);

        // Handle JSON fields manually
        try {
            if (hotelDTO.getAmenities() != null) {
                hotel.setAmenities(objectMapper.writeValueAsString(hotelDTO.getAmenities()));
            }
            if (hotelDTO.getImages() != null) {
                hotel.setImages(objectMapper.writeValueAsString(hotelDTO.getImages()));
            }
        } catch (Exception e) {
            log.error("Error serializing hotel JSON fields", e);
        }

        Hotel savedHotel = hotelRepository.save(hotel);
        log.info("Hotel registered with ID: {}", savedHotel.getId());

        return savedHotel;
    }

    @Override
    public com.hotel.dtos.AuthResp registerHotelWithUserAndAuthenticate(HotelRegistrationDTO registrationDTO) {
        log.info("Registering new hotel with new user and auto-login: {}", registrationDTO.getUser().getEmail());

        // 1. Create User
        UserRegDTO userDTO = registrationDTO.getUser();

        // Check for duplicate email
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new InvalidInputException(
                    "Email already registered. Please use a different email or login to your existing account.");
        }

        com.hotel.entities.User user = modelMapper.map(userDTO, com.hotel.entities.User.class);
        user.setUserRole(UserRole.ROLE_HOTEL_MANAGER); // Explicitly set as Manager
        user.setAccountStatus("ACTIVE");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        com.hotel.entities.User savedUser = userRepository.save(user);
        log.info("User created with ID: {}", savedUser.getId());

        // 2. Create Hotel
        HotelDTO hotelDTO = registrationDTO.getHotel();
        Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);

        hotel.setOwner(savedUser);
        hotel.setStatus("APPROVED"); // Auto-approve all hotels (admin approval bypassed)
        hotel.setRating(0.0);
        hotel.setRatingCount(0);

        // Handle JSON fields manually
        try {
            if (hotelDTO.getAmenities() != null) {
                hotel.setAmenities(objectMapper.writeValueAsString(hotelDTO.getAmenities()));
            }
            if (hotelDTO.getImages() != null) {
                hotel.setImages(objectMapper.writeValueAsString(hotelDTO.getImages()));
            }
        } catch (Exception e) {
            log.error("Error serializing hotel JSON fields", e);
        }

        Hotel savedHotel = hotelRepository.save(hotel);
        log.info("Hotel registered with ID: {}", savedHotel.getId());

        // 3. Generate JWT Token for auto-login
        String token = jwtUtils.generateToken(
                savedUser.getEmail(),
                savedUser.getUserRole().name(),
                savedUser.getId());

        String fullName = savedUser.getFirstName() + " " + savedUser.getLastName();

        com.hotel.dtos.AuthResp authResp = new com.hotel.dtos.AuthResp();
        authResp.setJwt(token);
        authResp.setMessage("Registration successful! Welcome to HBS.");
        authResp.setRole(savedUser.getUserRole().name());
        authResp.setName(fullName);

        log.info("Authentication response created for user: {}", savedUser.getEmail());
        return authResp;
    }

}