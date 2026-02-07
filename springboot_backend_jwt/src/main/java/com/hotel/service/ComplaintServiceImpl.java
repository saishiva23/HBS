package com.hotel.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.ComplaintDTO;
import com.hotel.dtos.ComplaintResponseDTO;
import com.hotel.entities.Booking;
import com.hotel.entities.Complaint;
import com.hotel.entities.ComplaintStatus;
import com.hotel.entities.Hotel;
import com.hotel.entities.User;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.ComplaintRepository;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;

    @Override
    public Complaint raiseComplaint(ComplaintDTO dto, String userEmail) {
        log.info("Raising complaint for user: {}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        Booking booking = null;
        if (dto.getBookingId() != null) {
            booking = bookingRepository.findById(dto.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

            // Verify booking belongs to user
            if (!booking.getUser().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Booking does not belong to this user");
            }
        }

        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setHotel(hotel);
        complaint.setBooking(booking); // Can be null for general complaints
        complaint.setSubject(dto.getSubject());
        complaint.setDescription(dto.getDescription());
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setGuestName(user.getFirstName() + " " + user.getLastName());
        complaint.setGuestEmail(user.getEmail());

        return complaintRepository.save(complaint);
    }

    @Override
    public List<ComplaintResponseDTO> getUserComplaints(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Complaint> complaints = complaintRepository.findByUserId(user.getId());

        return complaints.stream().map(this::convertToResponseDTO).toList();
    }

    private ComplaintResponseDTO convertToResponseDTO(Complaint complaint) {
        ComplaintResponseDTO dto = new ComplaintResponseDTO();
        dto.setId(complaint.getId());
        dto.setHotelId(complaint.getHotel() != null ? complaint.getHotel().getId() : null);
        dto.setHotelName(complaint.getHotel() != null ? complaint.getHotel().getName() : null);
        dto.setBookingId(complaint.getBooking() != null ? complaint.getBooking().getId() : null);
        dto.setBookingReference(complaint.getBooking() != null ? complaint.getBooking().getBookingReference() : null);
        dto.setGuestName(complaint.getGuestName());
        dto.setGuestEmail(complaint.getGuestEmail());
        dto.setSubject(complaint.getSubject());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus() != null ? complaint.getStatus().name() : null);
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setResolvedAt(complaint.getResolvedAt());
        dto.setResolution(complaint.getResolution());
        return dto;
    }

    @Override
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @Override
    public ApiResponse resolveComplaint(Long id, String status, String comment) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        // Convert string to enum
        ComplaintStatus complaintStatus = ComplaintStatus.valueOf(status.toUpperCase());
        complaint.setStatus(complaintStatus);

        if (comment != null) {
            complaint.setAdminComment(comment);
            complaint.setResolution(comment); // Also set resolution field
        }

        if (complaintStatus == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        complaintRepository.save(complaint);
        return new ApiResponse("Success", "Complaint updated successfully");
    }
}
