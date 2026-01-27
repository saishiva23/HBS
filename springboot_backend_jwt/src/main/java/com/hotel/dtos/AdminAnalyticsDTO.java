package com.hotel.dtos;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsDTO {
    private long totalHotels;
    private long totalCustomers;
    private long totalBookings;
    private BigDecimal totalRevenue;

    private List<MonthlyBookingData> bookingsTrend;
    private List<LocationStats> topLocations;
    private List<BookingResponseDTO> recentBookings;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyBookingData {
        private String month;
        private long bookings;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationStats {
        private String city;
        private long hotels;
        private long bookings;
    }
}
