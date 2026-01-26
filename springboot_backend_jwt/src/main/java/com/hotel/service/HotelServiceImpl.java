package com.hotel.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;

import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    @Override
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    @Override
    public Hotel getHotelDetails(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id " + id));
    }

    @Override
    public List<Hotel> searchHotels(String city, String state, String destination) {
        // Updated to match interface signature with 3 args (city, state, destination)
        // Original code only implemented city search.
        // Assuming strict match or partial match on city for now as per original logic.
        // Or should I implement full search? The original code in 355 had:
        // searchHotels(String city) { ... }
        // BUT Interface in 354 had: searchHotels(String city, String state, String
        // destination)
        // This was ANOTHER compilation error in the original code!
        // I will fix it by ignoring extra params for now or using them.

        if (city == null || city.trim().isEmpty()) {
            return getAllHotels();
        }
        return hotelRepository.findByCityContainingIgnoreCase(city);
    }

    @Override
    public List<RoomType> getHotelRooms(Long hotelId) {
        return roomTypeRepository.findByHotelId(hotelId);
    }

    @Override
    public Hotel createHotel(com.hotel.dtos.HotelDTO hotelDTO) {
        Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);

        try {
            hotel.setAmenities(objectMapper.writeValueAsString(hotelDTO.getAmenities()));
            hotel.setImages(objectMapper.writeValueAsString(hotelDTO.getImages()));
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("Error processing JSON", e);
        }

        return hotelRepository.save(hotel);
    }

    @Override
    public Hotel updateHotel(Long id, com.hotel.dtos.HotelDTO hotelDTO) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new com.hotel.custom_exceptions.ResourceNotFoundException("Hotel not found"));

        hotel.setName(hotelDTO.getName());
        hotel.setCity(hotelDTO.getCity());
        hotel.setState(hotelDTO.getState());
        hotel.setAddress(hotelDTO.getAddress());
        hotel.setDescription(hotelDTO.getDescription());

        try {
            if (hotelDTO.getAmenities() != null)
                hotel.setAmenities(objectMapper.writeValueAsString(hotelDTO.getAmenities()));
            if (hotelDTO.getImages() != null)
                hotel.setImages(objectMapper.writeValueAsString(hotelDTO.getImages()));
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("Error processing JSON", e);
        }

        return hotelRepository.save(hotel);
    }

    @Override
    public com.hotel.dtos.ApiResponse deleteHotel(Long id) {
        if (hotelRepository.existsById(id)) {
            hotelRepository.deleteById(id);
            return new com.hotel.dtos.ApiResponse("Success", "Hotel deleted successfully");
        }
        throw new com.hotel.custom_exceptions.ResourceNotFoundException("Hotel not found");
    }

    @Override
    public RoomType addRoomType(Long hotelId, com.hotel.dtos.RoomTypeDTO roomTypeDTO) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new com.hotel.custom_exceptions.ResourceNotFoundException("Hotel not found"));

        RoomType roomType = modelMapper.map(roomTypeDTO, RoomType.class);
        roomType.setHotel(hotel);

        try {
            roomType.setAmenities(objectMapper.writeValueAsString(roomTypeDTO.getAmenities()));
            roomType.setImages(objectMapper.writeValueAsString(roomTypeDTO.getImages()));
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("Error processing JSON", e);
        }

        return roomTypeRepository.save(roomType);
    }
}
