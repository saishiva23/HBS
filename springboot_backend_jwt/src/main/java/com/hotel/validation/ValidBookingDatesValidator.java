package com.hotel.validation;

import java.time.LocalDate;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import com.hotel.dtos.BookingDTO;

public class ValidBookingDatesValidator implements ConstraintValidator<ValidBookingDates, BookingDTO> {

    @Override
    public boolean isValid(BookingDTO booking, ConstraintValidatorContext context) {
        if (booking == null) {
            return true; // Let @NotNull handle null validation
        }

        LocalDate checkIn = booking.getCheckInDate();
        LocalDate checkOut = booking.getCheckOutDate();

        // If either date is null, let @NotNull handle it
        if (checkIn == null || checkOut == null) {
            return true;
        }

        // Check-out must be after check-in
        if (!checkOut.isAfter(checkIn)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "Check-out date must be after check-in date")
                    .addPropertyNode("checkOutDate")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
