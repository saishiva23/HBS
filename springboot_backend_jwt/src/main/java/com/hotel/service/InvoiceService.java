package com.hotel.service;

import com.hotel.entities.Booking;

public interface InvoiceService {
    void generateAndSendInvoice(Booking booking);
}
