package com.hotel.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomOccupancySchedulerService {

    private final RoomOccupancyService roomOccupancyService;

    // Run every hour to check for expired occupancies
    @Scheduled(fixedRate = 3600000) // 1 hour = 3600000 ms
    public void processExpiredOccupancies() {
        try {
            log.info("Processing expired room occupancies...");
            roomOccupancyService.processExpiredOccupancies();
            log.info("Completed processing expired room occupancies");
        } catch (Exception e) {
            log.error("Error processing expired occupancies: {}", e.getMessage(), e);
        }
    }
}