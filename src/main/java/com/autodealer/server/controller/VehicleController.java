package com.autodealer.server.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.autodealer.server.entity.SearchResultDTO;
import com.autodealer.server.entity.Vehicle;
import com.autodealer.server.repository.VehicleRepository;

@RestController
@RequestMapping("/api/vehicles")
// @CrossOrigin(origins = "http://localhost:5173") // Allows React dev server,
// not needed: springboot serving static files via Docker
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);

        if (vehicle.isPresent()) {
            return ResponseEntity.ok(vehicle.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public List<SearchResultDTO> searchVehicles(@RequestParam String q,
            @RequestParam(defaultValue = "10") int limit) {
        PageRequest pageable = PageRequest.of(0, limit);

        // 1. Fetch vehicles matching the query
        List<Vehicle> vehicles = vehicleRepository.searchVehicles(q, pageable);
        List<SearchResultDTO> results = vehicles.stream()
                .map(v -> new SearchResultDTO("vehicle", v))
                .collect(Collectors.toList());

        // 2. Fetch all distinct makes and filter by query
        List<String> allMakes = vehicleRepository.findAllDistinctMakes();
        List<String> matchingMakes = allMakes.stream()
                .filter(make -> make.toLowerCase().contains(q.toLowerCase()))
                .collect(Collectors.toList());

        // 3. Add brand results to the same list
        for (String make : matchingMakes) {
            results.add(new SearchResultDTO("brand", Map.of("make", make)));
        }

        return results;
    }

}
