package com.autodealer.server.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.autodealer.server.Util.MakeNormalizer;
import com.autodealer.server.entity.Vehicle;
import com.autodealer.server.repository.VehicleRepository;
import com.autodealer.server.security.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.coobird.thumbnailator.Thumbnails;

@RestController
@RequestMapping("/admin/api")
// @CrossOrigin(origins = "http://localhost:5173") // not needed: springboot
// serving static files via Docker
public class AdminController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passEncoder;

    @Autowired
    private Environment env;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Value("${upload.path}")
    private String uploadPath;

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String password = credentials.get("password");
        String storedHash = env.getProperty("cred.secret");

        if (storedHash == null || storedHash.isBlank()) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Server misconfiguration: Missing Admin Credentials"));
        }

        if (passEncoder.matches(password, storedHash)) {
            String token = jwtUtil.generateToken("admin");

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
    }

    @PostMapping("/vehicles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        vehicle.setMake(MakeNormalizer.normalize(vehicle.getMake()));
        vehicle.setModel(MakeNormalizer.capitalizeWords(vehicle.getModel()));

        Vehicle saved = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/vehicles/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicle.setMake(vehicleDetails.getMake());
                    vehicle.setModel(vehicleDetails.getModel());
                    vehicle.setYear(vehicleDetails.getYear());
                    vehicle.setPrice(vehicleDetails.getPrice());
                    vehicle.setMileage(vehicleDetails.getMileage());
                    vehicle.setStatus(vehicleDetails.getStatus());
                    vehicle.setCondition(vehicleDetails.getCondition());
                    vehicle.setDetailsJson(vehicleDetails.getDetailsJson());

                    Vehicle updated = vehicleRepository.save(vehicle);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/vehicles/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    try {
                        ObjectMapper objectMapper = new ObjectMapper();
                        JsonNode detailsNode = objectMapper.readTree(vehicle.getDetailsJson());

                        if (detailsNode.has("images") && detailsNode.get("images").isArray()) {
                            for (JsonNode imageNode : detailsNode.get("images")) {
                                String filename = imageNode.asText();
                                Path filePath = Paths.get(uploadPath).resolve(filename).normalize();
                                try {
                                    Files.deleteIfExists(filePath);
                                } catch (IOException e) {
                                    System.err.println("Failed to delete image " + filename + ": " + e.getMessage());
                                }
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Error parsing detailsJson for vehicle ID " + id + ": " + e.getMessage());
                    }

                    vehicleRepository.delete(vehicle);
                    return ResponseEntity.ok(Map.of("message", "Vehicle and associated images deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/vehicles/images/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("files") MultipartFile[] files) {

        List<String> fileNames = new ArrayList<>();

        try {
            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            for (MultipartFile file : files) {
                if (file.isEmpty())
                    continue;

                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : "";
                String filename = UUID.randomUUID().toString() + extension;

                Path targetLocation = uploadDir.resolve(filename);

                // Resize image before saving
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                Thumbnails.of(file.getInputStream())
                        .size(600, 600) // Max 1200px on longest side
                        .keepAspectRatio(true) // Explicitly maintain ratio
                        .outputQuality(0.60) // Drop the quality by 70%
                        .toOutputStream(outputStream);

                // Save resized image
                Files.write(targetLocation, outputStream.toByteArray());

                fileNames.add(filename);
            }

            return ResponseEntity.ok(fileNames);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/vehicles/images/{filename}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadPath).resolve(filename).normalize();
            Files.deleteIfExists(filePath);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}