package com.hotel.service;

import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.AdminAnalyticsDTO;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.entities.Booking;
import com.hotel.entities.Hotel;
import com.hotel.entities.User;
import com.hotel.entities.Location;
import com.hotel.dtos.LocationDTO;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.UserRepository;
import com.hotel.repository.LocationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    // Hotel Approval Management
    @Override
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    @Override
    public List<Hotel> getPendingHotels() {
        return hotelRepository.findByStatus("PENDING");
    }

    @Override
    public List<Hotel> getApprovedHotels() {
        return hotelRepository.findByStatus("APPROVED");
    }

    @Override
    public List<Hotel> getRejectedHotels() {
        return hotelRepository.findByStatus("REJECTED");
    }

    @Override
    public ApiResponse approveHotel(Long hotelId) {
        if (hotelId == null) {
            throw new IllegalArgumentException("Hotel ID cannot be null");
        }
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));

        hotel.setStatus("APPROVED");
        hotel.setRejectionReason(null);
        hotelRepository.save(hotel);

        log.info("Hotel approved: {}", hotelId);
        return new ApiResponse("Success", "Hotel approved successfully");
    }

    @Override
    public ApiResponse rejectHotel(Long hotelId, String reason) {
        if (hotelId == null) {
            throw new IllegalArgumentException("Hotel ID cannot be null");
        }
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));

        hotel.setStatus("REJECTED");
        hotel.setRejectionReason(reason);
        hotelRepository.save(hotel);

        log.info("Hotel rejected: {} with reason: {}", hotelId, reason);
        return new ApiResponse("Success", "Hotel rejected successfully");
    }

    @Override
    public void deleteHotel(Long hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with ID: " + hotelId);
        }
        // Constraint: Check for bookings
        List<Booking> bookings = bookingRepository.findByHotelId(hotelId);
        if (!bookings.isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete hotel with existing bookings. Please reject/archive it instead.");
        }
        hotelRepository.deleteById(hotelId);
    }

    // Payment Management
    @Override
    public List<BookingResponseDTO> getAllPayments() {
        return bookingRepository.findAll().stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getPendingPayments() {
        return bookingRepository.findByPaymentStatus("PENDING").stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getCompletedPayments() {
        return bookingRepository.findByPaymentStatus("COMPLETED").stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getFailedPayments() {
        return bookingRepository.findByPaymentStatus("FAILED").stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    // User Management
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getSuspendedUsers() {
        return userRepository.findByAccountStatus("SUSPENDED");
    }

    @Override
    public ApiResponse suspendUser(Long userId, String reason) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setAccountStatus("SUSPENDED");
        user.setSuspensionReason(reason);
        userRepository.save(user);

        log.info("User suspended: {} with reason: {}", userId, reason);
        return new ApiResponse("Success", "User suspended successfully");
    }

    @Override
    public ApiResponse activateUser(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setAccountStatus("ACTIVE");
        user.setSuspensionReason(null);
        userRepository.save(user);

        log.info("User activated: {}", userId);
        return new ApiResponse("Success", "User activated successfully");
    }

    @Override
    public AdminAnalyticsDTO getAnalytics() {
        AdminAnalyticsDTO analytics = new AdminAnalyticsDTO();

        // 1. Basic Counts
        analytics.setTotalHotels(hotelRepository.count());
        analytics.setTotalCustomers(userRepository.findAll().stream()
                .filter(u -> u.getUserRole() == com.hotel.entities.UserRole.ROLE_CUSTOMER).count());
        analytics.setTotalBookings(bookingRepository.count());

        List<Booking> allBookings = bookingRepository.findAll();

        // 2. Total Revenue
        BigDecimal revenue = allBookings.stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()))
                .filter(b -> b.getPaymentStatus() != null && "COMPLETED".equals(b.getPaymentStatus()))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        analytics.setTotalRevenue(revenue);

        // 3. Bookings Trend (Group by Month)
        Map<Month, Long> bookingsByMonth = allBookings.stream()
                .filter(b -> b.getBookingDate() != null)
                .map(b -> b.getBookingDate().getMonth())
                .collect(Collectors.groupingBy(m -> m, Collectors.counting()));

        List<AdminAnalyticsDTO.MonthlyBookingData> trend = bookingsByMonth.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new AdminAnalyticsDTO.MonthlyBookingData(
                        e.getKey().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                        e.getValue()))
                .collect(Collectors.toList());
        analytics.setBookingsTrend(trend);

        // 4. Top Locations (by Bookings count)
        Map<String, Long> bookingsByCity = allBookings.stream()
                .filter(b -> b.getHotel() != null && b.getHotel().getCity() != null)
                .map(b -> b.getHotel().getCity())
                .collect(Collectors.groupingBy(city -> city, Collectors.counting()));

        List<AdminAnalyticsDTO.LocationStats> locationStats = bookingsByCity.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue())) // Descending
                .limit(5)
                .map(e -> {
                    String city = e.getKey();
                    long bookingsCount = e.getValue();
                    long hotelsCount = hotelRepository.findByCity(city).size();
                    return new AdminAnalyticsDTO.LocationStats(city, hotelsCount, bookingsCount);
                })
                .collect(Collectors.toList());
        analytics.setTopLocations(locationStats);

        // 5. Recent Bookings
        List<BookingResponseDTO> recent = allBookings.stream()
                .sorted((b1, b2) -> {
                    if (b2.getBookingDate() == null || b1.getBookingDate() == null)
                        return 0;
                    return b2.getBookingDate().compareTo(b1.getBookingDate());
                })
                .limit(5)
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
        analytics.setRecentBookings(recent);

        return analytics;
    }

    // Helper method to map Booking to BookingResponseDTO
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

        // Set user details if available
        if (booking.getUser() != null) {
            dto.setUserEmail(booking.getUser().getEmail());
            dto.setUserName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
        }

        return dto;
    }

    // Recent Activity Implementation
    @Override
    public List<User> getRecentCustomers() {
        return userRepository
                .findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
                        "id"))
                .stream()
                .filter(u -> u.getUserRole() == com.hotel.entities.UserRole.ROLE_CUSTOMER)
                .limit(5)
                .collect(Collectors.toList());
    }

    @Override
    public List<Hotel> getRecentHotels() {
        return hotelRepository
                .findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
                        "id"))
                .stream()
                .limit(5)
                .collect(Collectors.toList());
    }

    // Location Management Implementation
    @Override
    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream().map(loc -> {
            LocationDTO dto = new LocationDTO();
            dto.setId(loc.getId());
            dto.setCity(loc.getCity());
            dto.setState(loc.getState());
            dto.setCountry(loc.getCountry());
            dto.setDescription(loc.getDescription());
            dto.setAddedDate(loc.getAddedDate());
            // Calculate hotels in this city
            long count = hotelRepository.findByCity(loc.getCity()).size();
            dto.setHotelCount(count);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public Location addLocation(Location location) {
        if (location.getAddedDate() == null) {
            location.setAddedDate(java.time.LocalDate.now());
        }
        return locationRepository.save(location);
    }

    @Override
    public Location updateLocation(Long id, Location location) {
        Location existing = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with ID: " + id));

        existing.setCity(location.getCity());
        existing.setState(location.getState());
        existing.setCountry(location.getCountry());
        existing.setDescription(location.getDescription());
        // Don't update addedDate usually

        return locationRepository.save(existing);
    }

    @Override
    public void deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Location not found with ID: " + id);
        }
        locationRepository.deleteById(id);
    }
}
