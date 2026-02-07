package com.hotel.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.dtos.HotelDTO;
import com.hotel.dtos.ComplaintResponseDTO;
import com.hotel.dtos.RoomDTO;
import com.hotel.dtos.RoomTypeDTO;
import com.hotel.entities.Booking;
import com.hotel.entities.Hotel;
import com.hotel.entities.Room;
import com.hotel.entities.RoomType;
import com.hotel.entities.User;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.RoomTypeRepository;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class HotelOwnerServiceImpl implements HotelOwnerService {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final com.hotel.repository.RoomOccupancyRepository roomOccupancyRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final com.hotel.repository.ReviewRepository reviewRepository;
    private final com.hotel.repository.ComplaintRepository complaintRepository;
    private final com.hotel.repository.LocationRepository locationRepository;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    @Override
    public List<Hotel> getOwnerHotels(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
        return hotelRepository.findByOwnerId(owner.getId());
    }

    @Override
    public Hotel getOwnerHotelDetails(Long hotelId, String ownerEmail) {
        log.info("Getting hotel details - hotelId: {}, ownerEmail: {}", hotelId, ownerEmail);

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        // Add null-safety checks and detailed logging
        if (hotel.getOwner() == null) {
            log.error("Hotel {} has null owner!", hotelId);
            throw new IllegalArgumentException("Hotel has no owner assigned");
        }

        log.info("Hotel owner ID: {}, Requesting user ID: {}", hotel.getOwner().getId(), owner.getId());

        // Strict ownership check
        if (!hotel.getOwner().getId().equals(owner.getId())) {
            log.error("Authorization failed - Hotel owner: {}, Requested by: {}",
                    hotel.getOwner().getId(),
                    owner.getId());
            throw new IllegalArgumentException("Not authorized to access this hotel");
        }

        return hotel;
    }

    @Override
    public Hotel createHotel(HotelDTO hotelDTO, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);
        hotel.setOwner(owner);
        hotel.setStatus("PENDING"); // Requires admin approval

        processHotelImages(hotel, hotelDTO.getImages());

        return hotelRepository.save(hotel);
    }

    @Override
    public Hotel updateHotel(Long hotelId, HotelDTO hotelDTO, String ownerEmail) {
        Hotel hotel = getOwnerHotelDetails(hotelId, ownerEmail);

        hotel.setName(hotelDTO.getName());
        hotel.setCity(hotelDTO.getCity());
        hotel.setState(hotelDTO.getState());
        hotel.setAddress(hotelDTO.getAddress());
        hotel.setDescription(hotelDTO.getDescription());
        hotel.setStarRating(hotelDTO.getStarRating());
        hotel.setPriceRange(hotelDTO.getPriceRange());

        hotel.setWifi(hotelDTO.isWifi());
        hotel.setParking(hotelDTO.isParking());
        hotel.setGym(hotelDTO.isGym());
        hotel.setAc(hotelDTO.isAc());
        hotel.setRestaurant(hotelDTO.isRestaurant());
        hotel.setRoomService(hotelDTO.isRoomService());

        processHotelImages(hotel, hotelDTO.getImages());

        return hotelRepository.save(hotel);
    }

    @Override
    public ApiResponse deleteHotel(Long hotelId, String ownerEmail) {
        Hotel hotel = getOwnerHotelDetails(hotelId, ownerEmail);
        hotelRepository.delete(hotel);
        return new ApiResponse("Success", "Hotel deleted successfully");
    }

    @Override
    public List<RoomType> getHotelRooms(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership
        return roomTypeRepository.findByHotelId(hotelId);
    }

    @Override
    public RoomType addRoomType(Long hotelId, RoomTypeDTO roomTypeDTO, String ownerEmail) {
        Hotel hotel = getOwnerHotelDetails(hotelId, ownerEmail);

        if (!"APPROVED".equals(hotel.getStatus())) {
            throw new IllegalStateException("Cannot add room types until hotel is approved by admin");
        }

        RoomType roomType = modelMapper.map(roomTypeDTO, RoomType.class);
        roomType.setHotel(hotel);

        processRoomTypeJsonFields(roomType, roomTypeDTO.getAmenities(), roomTypeDTO.getImages());

        RoomType saved = roomTypeRepository.save(roomType);
        updateHotelPriceRange(hotel);
        return saved;
    }

    @Override
    public RoomType updateRoomType(Long hotelId, Long roomTypeId, RoomTypeDTO roomTypeDTO, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found"));

        if (!roomType.getHotel().getId().equals(hotelId)) {
            throw new IllegalArgumentException("Room type does not belong to this hotel");
        }

        roomType.setName(roomTypeDTO.getName());
        roomType.setDescription(roomTypeDTO.getDescription());
        roomType.setPricePerNight(roomTypeDTO.getPricePerNight());
        roomType.setCapacity(roomTypeDTO.getCapacity());
        roomType.setBeds(roomTypeDTO.getBeds());

        // Validate totalRooms change
        if (roomTypeDTO.getTotalRooms() != null && roomTypeDTO.getTotalRooms() > 0) {
            Long existingRoomCount = roomRepository.countByRoomTypeId(roomTypeId);
            if (roomTypeDTO.getTotalRooms() < existingRoomCount) {
                throw new IllegalStateException(
                        "Cannot reduce total rooms to " + roomTypeDTO.getTotalRooms() +
                                ". " + existingRoomCount + " individual rooms already exist. " +
                                "Please delete some rooms first.");
            }
            roomType.setTotalRooms(roomTypeDTO.getTotalRooms());
        }

        processRoomTypeJsonFields(roomType, roomTypeDTO.getAmenities(), roomTypeDTO.getImages());

        RoomType saved = roomTypeRepository.save(roomType);
        Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
        if (hotel != null)
            updateHotelPriceRange(hotel);
        return saved;
    }

    @Override
    public ApiResponse deleteRoomType(Long hotelId, Long roomTypeId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found"));

        if (!roomType.getHotel().getId().equals(hotelId)) {
            throw new IllegalArgumentException("Room type does not belong to this hotel");
        }

        roomTypeRepository.delete(roomType);
        Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
        if (hotel != null)
            updateHotelPriceRange(hotel);
        return new ApiResponse("Success", "Room type deleted successfully");
    }

    // Individual Room Management
    @Override
    public List<com.hotel.dtos.RoomResponseDTO> getHotelRoomsList(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership
        List<Room> rooms = roomRepository.findByHotelId(hotelId);

        // Map to DTO to avoid lazy loading issues
        return rooms.stream()
                .map(room -> {
                    com.hotel.dtos.RoomResponseDTO dto = new com.hotel.dtos.RoomResponseDTO();
                    dto.setId(room.getId());
                    dto.setRoomNumber(room.getRoomNumber());
                    dto.setRoomTypeId(room.getRoomType().getId());
                    dto.setRoomTypeName(room.getRoomType().getName());
                    dto.setIsActive(room.getIsActive());
                    dto.setStatus(room.getStatus());

                    // Add room count information
                    dto.setRoomTypeLimit(room.getRoomType().getTotalRooms());
                    Long usedCount = roomRepository.countByRoomTypeId(room.getRoomType().getId());
                    dto.setRoomTypeUsed(usedCount.intValue());

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Room addRoom(Long hotelId, RoomDTO roomDTO, String ownerEmail) {
        Hotel hotel = getOwnerHotelDetails(hotelId, ownerEmail);

        if (!"APPROVED".equals(hotel.getStatus())) {
            throw new IllegalStateException("Cannot add rooms until hotel is approved by admin");
        }

        RoomType roomType = roomTypeRepository.findById(roomDTO.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found"));

        if (!roomType.getHotel().getId().equals(hotelId)) {
            throw new IllegalArgumentException("Room type does not belong to this hotel");
        }

        // Validate room count doesn't exceed totalRooms limit
        Long currentCount = roomRepository.countByRoomTypeId(roomDTO.getRoomTypeId());
        if (currentCount >= roomType.getTotalRooms()) {
            throw new IllegalStateException(
                    "Cannot add more rooms. Room type '" + roomType.getName() +
                            "' allows maximum " + roomType.getTotalRooms() + " rooms. " +
                            currentCount + " rooms already exist.");
        }

        Room room = new Room();
        room.setRoomNumber(roomDTO.getRoomNumber());
        room.setHotel(hotel);
        room.setRoomType(roomType);
        room.setIsActive(roomDTO.getIsActive() != null ? roomDTO.getIsActive() : true);
        room.setStatus(roomDTO.getStatus() != null ? roomDTO.getStatus() : "AVAILABLE");

        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(Long hotelId, Long roomId, RoomDTO roomDTO, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getHotel().getId().equals(hotelId)) {
            throw new IllegalArgumentException("Room does not belong to this hotel");
        }

        if (roomDTO.getRoomNumber() != null) {
            room.setRoomNumber(roomDTO.getRoomNumber());
        }

        if (roomDTO.getRoomTypeId() != null) {
            RoomType roomType = roomTypeRepository.findById(roomDTO.getRoomTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room type not found"));
            if (!roomType.getHotel().getId().equals(hotelId)) {
                throw new IllegalArgumentException("Room type does not belong to this hotel");
            }
            room.setRoomType(roomType);
        }

        if (roomDTO.getIsActive() != null) {
            room.setIsActive(roomDTO.getIsActive());
        }

        if (roomDTO.getStatus() != null) {
            room.setStatus(roomDTO.getStatus());
        }

        return roomRepository.save(room);
    }

    @Override
    public ApiResponse deleteRoom(Long hotelId, Long roomId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getHotel().getId().equals(hotelId)) {
            throw new IllegalArgumentException("Room does not belong to this hotel");
        }

        roomRepository.delete(room);
        return new ApiResponse("Success", "Room deleted successfully");
    }

    // Room Statistics - Real-time occupancy based on RoomOccupancy table
    @Override
    public com.hotel.dtos.RoomStatsDTO getRoomStats(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        // Total rooms in hotel (active rooms only)
        Long totalRooms = roomRepository.countByHotelId(hotelId);

        // Rooms in maintenance
        Long maintenanceRooms = roomRepository.countByHotelIdAndStatus(hotelId, "MAINTENANCE");

        // Occupied rooms for today (based on actual bookings from RoomOccupancy table)
        java.time.LocalDate today = java.time.LocalDate.now();
        Long occupiedRooms = roomOccupancyRepository.countOccupiedRoomsByHotel(
                hotelId, today, today.plusDays(1));

        // Available = Total - Occupied - Maintenance
        Long availableRooms = totalRooms - occupiedRooms - maintenanceRooms;
        if (availableRooms < 0)
            availableRooms = 0L;

        return new com.hotel.dtos.RoomStatsDTO(totalRooms, availableRooms, occupiedRooms, maintenanceRooms);
    }

    @Override
    public List<BookingResponseDTO> getOwnerBookings(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        List<Hotel> ownerHotels = hotelRepository.findByOwnerId(owner.getId());
        List<Long> hotelIds = ownerHotels.stream().map(Hotel::getId).collect(Collectors.toList());

        return bookingRepository.findAll().stream()
                .filter(b -> hotelIds.contains(b.getHotel().getId()))
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getHotelBookings(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        return bookingRepository.findByHotelId(hotelId).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ApiResponse updateBookingStatus(Long bookingId, String status, String ownerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify owner owns this hotel
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        if (!booking.getHotel().getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("Not authorized to update this booking");
        }

        booking.setStatus(status);
        bookingRepository.save(booking);

        return new ApiResponse("Success", "Booking status updated successfully");
    }

    @Override
    public Map<String, Object> getOwnerDashboardStats(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        List<Hotel> ownerHotels = hotelRepository.findByOwnerId(owner.getId());
        List<Long> hotelIds = ownerHotels.stream().map(Hotel::getId).collect(Collectors.toList());

        List<Booking> allBookings = bookingRepository.findAll().stream()
                .filter(b -> hotelIds.contains(b.getHotel().getId()))
                .collect(Collectors.toList());

        long totalBookings = allBookings.size();
        long activeBookings = allBookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus())).count();
        long completedBookings = allBookings.stream().filter(b -> "COMPLETED".equals(b.getStatus())).count();

        BigDecimal totalRevenue = allBookings.stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalHotels", ownerHotels.size());
        stats.put("totalBookings", totalBookings);
        stats.put("activeBookings", activeBookings);
        stats.put("completedBookings", completedBookings);
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingApprovals", ownerHotels.stream().filter(h -> "PENDING".equals(h.getStatus())).count());

        return stats;
    }

    private void processHotelImages(Hotel hotel, Object images) {
        try {
            if (images != null) {
                hotel.setImages(objectMapper.writeValueAsString(images));
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing hotel images", e);
        }
    }

    private void processRoomTypeJsonFields(RoomType roomType, Object amenities, Object images) {
        try {
            if (amenities != null) {
                roomType.setAmenities(objectMapper.writeValueAsString(amenities));
            }
            if (images != null) {
                roomType.setImages(objectMapper.writeValueAsString(images));
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing room type data", e);
        }
    }

    private BookingResponseDTO mapToBookingResponse(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setHotelName(booking.getHotel().getName());
        dto.setHotelCity(booking.getHotel().getCity());
        dto.setRoomTypeName(booking.getRoomType().getName());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setAdults(booking.getAdults());
        dto.setChildren(booking.getChildren());
        dto.setRooms(booking.getRooms());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setBookingDate(booking.getBookingDate());
        dto.setGuestFirstName(booking.getGuestFirstName());
        dto.setGuestLastName(booking.getGuestLastName());
        dto.setGuestEmail(booking.getGuestEmail());
        dto.setGuestPhone(booking.getGuestPhone());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setPaymentMethod(booking.getPaymentMethod());
        dto.setTransactionId(booking.getTransactionId());
        return dto;
    }

    // Customer Experience - Reviews
    @Override
    public List<com.hotel.dtos.ReviewResponseDTO> getHotelReviews(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        List<com.hotel.entities.Review> reviews = reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId);
        return reviews.stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getReviewStats(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        List<com.hotel.entities.Review> reviews = reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReviews", reviews.size());

        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                    .mapToInt(com.hotel.entities.Review::getRating)
                    .average()
                    .orElse(0.0);
            stats.put("averageRating", Math.round(avgRating * 10.0) / 10.0);
        } else {
            stats.put("averageRating", 0.0);
        }

        long newReviews = reviews.stream()
                .filter(r -> r.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(7)))
                .count();
        stats.put("newReviews", newReviews);

        return stats;
    }

    // Customer Experience - Complaints (Placeholder implementations)
    @Override
    public List<com.hotel.dtos.ComplaintResponseDTO> getHotelComplaints(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership
        List<com.hotel.entities.Complaint> complaints = complaintRepository.findByHotelId(hotelId);
        return complaints.stream().map(this::mapToComplaintResponse).collect(Collectors.toList());
    }

    @Override
    public ApiResponse resolveComplaint(Long complaintId, String resolution, String ownerEmail) {
        com.hotel.entities.Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        // Verify owner has rights to this complaint's hotel
        getOwnerHotelDetails(complaint.getHotel().getId(), ownerEmail);

        complaint.setResolution(resolution);
        complaint.setStatus(com.hotel.entities.ComplaintStatus.RESOLVED);
        complaint.setResolvedAt(java.time.LocalDateTime.now());
        complaintRepository.save(complaint);

        return new ApiResponse("Success", "Complaint resolved successfully");
    }

    // Helper method to map Review to ReviewResponseDTO
    private com.hotel.dtos.ReviewResponseDTO mapToReviewResponse(com.hotel.entities.Review review) {
        com.hotel.dtos.ReviewResponseDTO dto = new com.hotel.dtos.ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setGuestName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
        dto.setGuestEmail(review.getUser().getEmail());
        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    private ComplaintResponseDTO mapToComplaintResponse(com.hotel.entities.Complaint complaint) {
        ComplaintResponseDTO dto = new ComplaintResponseDTO();
        dto.setId(complaint.getId());
        dto.setSubject(complaint.getSubject());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus().name());
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setResolvedAt(complaint.getResolvedAt());
        dto.setGuestName(complaint.getGuestName());
        dto.setBookingReference(complaint.getBooking().getBookingReference());
        dto.setResolution(complaint.getResolution());
        return dto;
    }

    // Payment Management
    @Override
    public List<BookingResponseDTO> getPaymentHistory(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        List<Booking> bookings = bookingRepository.findByHotelId(hotelId);

        return bookings.stream()
                .filter(b -> b.getPaymentStatus() != null) // Only bookings with payment status
                .sorted((b1, b2) -> b2.getBookingDate().compareTo(b1.getBookingDate()))
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getPaymentStats(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        List<Booking> bookings = bookingRepository.findByHotelId(hotelId);

        BigDecimal totalRevenue = bookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()) || "COMPLETED".equals(b.getStatus()))
                .filter(b -> "COMPLETED".equals(b.getPaymentStatus()))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingPayments = bookings.stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()))
                .filter(b -> "PENDING".equals(b.getPaymentStatus()))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long completedTrans = bookings.stream()
                .filter(b -> "COMPLETED".equals(b.getPaymentStatus()))
                .count();

        long failedTrans = bookings.stream()
                .filter(b -> "FAILED".equals(b.getPaymentStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingPayments", pendingPayments);
        stats.put("completedTransactions", completedTrans);
        stats.put("failedTransactions", failedTrans);

        return stats;
    }

    @Override
    public byte[] generatePaymentReport(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        List<Booking> bookings = bookingRepository.findByHotelId(hotelId);
        List<Booking> sortedBookings = bookings.stream()
                .filter(b -> b.getPaymentStatus() != null)
                .sorted((b1, b2) -> b2.getBookingDate().compareTo(b1.getBookingDate()))
                .collect(Collectors.toList());

        StringBuilder csv = new StringBuilder();
        // CSV Header
        csv.append("Transaction ID,Guest Name,Email,Check-In,Check-Out,Amount,Method,Status,Date\n");

        // CSV Rows
        for (Booking b : sortedBookings) {
            csv.append(escapeCsv(b.getTransactionId() != null ? b.getTransactionId() : "N/A")).append(",");
            csv.append(escapeCsv(b.getGuestFirstName() + " " + b.getGuestLastName())).append(",");
            csv.append(escapeCsv(b.getGuestEmail())).append(",");
            csv.append(b.getCheckInDate()).append(",");
            csv.append(b.getCheckOutDate()).append(",");
            csv.append(b.getTotalPrice()).append(",");
            csv.append(escapeCsv(b.getPaymentMethod() != null ? b.getPaymentMethod() : "N/A")).append(",");
            csv.append(escapeCsv(b.getPaymentStatus())).append(",");
            csv.append(b.getBookingDate()).append("\n");
        }

        return csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    // Helper to escape CSV fields
    private String escapeCsv(String field) {
        if (field == null)
            return "";
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }

    private void updateHotelPriceRange(Hotel hotel) {
        try {
            List<RoomType> rooms = roomTypeRepository.findByHotelId(hotel.getId());
            if (rooms.isEmpty()) {
                hotel.setPriceRange("Price not available");
            } else {
                BigDecimal min = rooms.stream()
                        .map(RoomType::getPricePerNight)
                        .min(BigDecimal::compareTo)
                        .orElse(BigDecimal.ZERO);
                BigDecimal max = rooms.stream()
                        .map(RoomType::getPricePerNight)
                        .max(BigDecimal::compareTo)
                        .orElse(BigDecimal.ZERO);

                if (min.compareTo(max) == 0) {
                    hotel.setPriceRange("₹" + min.toString());
                } else {
                    hotel.setPriceRange("₹" + min.toString() + " - ₹" + max.toString());
                }
            }
            hotelRepository.save(hotel);
        } catch (Exception e) {
            log.error("Error updating hotel price range", e);
        }
    }
}
