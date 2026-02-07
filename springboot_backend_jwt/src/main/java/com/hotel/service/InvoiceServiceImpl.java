package com.hotel.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hotel.entities.Booking;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceServiceImpl implements InvoiceService {

    private final RestTemplate restTemplate;

    @Value("${invoice.service.url:http://localhost:5000}")
    private String invoiceServiceUrl;

    @Override
    public void generateAndSendInvoice(Booking booking) {
        try {
            log.info("Generating invoice for booking: {}", booking.getBookingReference());

            String url = invoiceServiceUrl + "/api/invoice/generate";

            // Prepare invoice request payload
            Map<String, Object> invoiceRequest = new HashMap<>();
            invoiceRequest.put("bookingReference", booking.getBookingReference());
            invoiceRequest.put("guestName", booking.getGuestFirstName() + " " + booking.getGuestLastName());
            invoiceRequest.put("guestEmail", booking.getGuestEmail());
            invoiceRequest.put("hotelName", booking.getHotel().getName());
            invoiceRequest.put("roomType", booking.getRoomType().getName());
            invoiceRequest.put("checkInDate", booking.getCheckInDate().toString());
            invoiceRequest.put("checkOutDate", booking.getCheckOutDate().toString());
            invoiceRequest.put("totalPrice", booking.getTotalPrice());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(invoiceRequest, headers);

            // Call the .NET Invoice Service
            restTemplate.postForEntity(url, request, byte[].class);

            log.info("Invoice generated and emailed successfully for booking: {}", booking.getBookingReference());
        } catch (Exception e) {
            // Log error but don't fail the booking process
            log.error("Failed to generate invoice for booking: {}. Error: {}", 
                booking.getBookingReference(), e.getMessage());
        }
    }
}
