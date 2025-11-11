package com.autodealer.server.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.autodealer.server.entity.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByStatus(String status);

    List<Vehicle> findByMakeIgnoreCase(String make);

    List<Vehicle> findByPriceBetween(Double minPrice, Double maxPrice);

    // Search bar autocomplete
    @Query("SELECT v FROM Vehicle v " +
            "WHERE CAST(v.year AS string) LIKE CONCAT('%', :query, '%') " +
            "OR LOWER(v.make) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(v.model) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Vehicle> searchVehicles(@Param("query") String query, Pageable pageable);

    // Query only the brands
    @Query("SELECT DISTINCT v.make FROM Vehicle v")
    List<String> findAllDistinctMakes();
}