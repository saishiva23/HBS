package com.hotel.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ReviewDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.Review;
import com.hotel.entities.User;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.ReviewRepository;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;

    public Review createReview(ReviewDTO reviewDTO, String userEmail) {
        log.info("Creating review for hotel {} by user {}", reviewDTO.getHotelId(), userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Hotel hotel = hotelRepository.findById(reviewDTO.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        Review review = new Review();
        review.setUser(user);
        review.setHotel(hotel);
        review.setRating(reviewDTO.getRating());
        review.setTitle(reviewDTO.getTitle());
        review.setComment(reviewDTO.getComment());

        Review savedReview = reviewRepository.save(review);

        // Update hotel rating after review is submitted
        updateHotelRating(hotel.getId());

        return savedReview;
    }

    private void updateHotelRating(Long hotelId) {
        log.info("Updating rating for hotel {}", hotelId);

        Double avgRating = reviewRepository.getAverageRatingByHotelId(hotelId);
        Long reviewCount = reviewRepository.countByHotelId(hotelId);

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        hotel.setRating(avgRating != null ? avgRating : 0.0);
        hotel.setRatingCount(reviewCount.intValue());

        // Set rating text based on average rating
        if (avgRating != null) {
            if (avgRating >= 4.5) {
                hotel.setRatingText("Excellent");
            } else if (avgRating >= 4.0) {
                hotel.setRatingText("Very Good");
            } else if (avgRating >= 3.5) {
                hotel.setRatingText("Good");
            } else if (avgRating >= 3.0) {
                hotel.setRatingText("Average");
            } else {
                hotel.setRatingText("Below Average");
            }
        } else {
            hotel.setRatingText("Not Rated");
        }

        hotelRepository.save(hotel);
        log.info("Hotel {} rating updated to {}", hotelId, avgRating);
    }

    public List<Review> getHotelReviews(Long hotelId) {
        return reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId);
    }

    public List<Review> getUserReviews(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}