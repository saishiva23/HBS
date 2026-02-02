package com.hotel.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.ComplaintDTO;
import com.hotel.dtos.ComplaintResponseDTO;
import com.hotel.entities.Complaint;
import com.hotel.service.ComplaintService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponseDTO> raiseComplaint(@RequestBody @jakarta.validation.Valid ComplaintDTO dto,
            Principal principal) {
        Complaint complaint = complaintService.raiseComplaint(dto, principal.getName());
        return ResponseEntity.ok(convertToResponseDTO(complaint));
    }

    private ComplaintResponseDTO convertToResponseDTO(Complaint complaint) {
        ComplaintResponseDTO responseDTO = new ComplaintResponseDTO();
        responseDTO.setId(complaint.getId());
        responseDTO.setHotelId(complaint.getHotel() != null ? complaint.getHotel().getId() : null);
        responseDTO.setHotelName(complaint.getHotel() != null ? complaint.getHotel().getName() : null);
        responseDTO.setBookingId(complaint.getBooking() != null ? complaint.getBooking().getId() : null);
        responseDTO.setBookingReference(
                complaint.getBooking() != null ? complaint.getBooking().getBookingReference() : null);
        responseDTO.setGuestName(complaint.getGuestName());
        responseDTO.setGuestEmail(complaint.getGuestEmail());
        responseDTO.setSubject(complaint.getSubject());
        responseDTO.setDescription(complaint.getDescription());
        responseDTO.setStatus(complaint.getStatus() != null ? complaint.getStatus().name() : null);
        responseDTO.setCreatedAt(complaint.getCreatedAt());
        responseDTO.setResolvedAt(complaint.getResolvedAt());
        responseDTO.setResolution(complaint.getResolution());
        return responseDTO;
    }

    @GetMapping("/my-complaints")
    public ResponseEntity<List<ComplaintResponseDTO>> getUserComplaints(Principal principal) {
        return ResponseEntity.ok(complaintService.getUserComplaints(principal.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse> resolveComplaint(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id, status, comment));
    }
}
