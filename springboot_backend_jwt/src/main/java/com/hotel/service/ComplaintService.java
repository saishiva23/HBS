package com.hotel.service;

import java.util.List;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.ComplaintDTO;
import com.hotel.dtos.ComplaintResponseDTO;
import com.hotel.entities.Complaint;

public interface ComplaintService {

    Complaint raiseComplaint(ComplaintDTO dt, String userEmail);

    List<ComplaintResponseDTO> getUserComplaints(String userEmail);

    List<Complaint> getAllComplaints();

    ApiResponse resolveComplaint(Long id, String status, String comment);
}
