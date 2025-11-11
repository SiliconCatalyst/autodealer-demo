package com.autodealer.server.Util;

import java.util.Arrays;
import java.util.stream.Collectors;

public final class MakeNormalizer {

    private MakeNormalizer() {
        // Utility class — no instantiation
    }

    public static String normalize(String make) {
        if (make == null || make.isBlank())
            return make;

        String normalized = make.trim().toLowerCase();

        switch (normalized) {
            // --- Alfa Romeo ---
            case "alfa":
            case "alfa romeo":
            case "alfaromeo":
                return "Alfa Romeo";

            // --- Aston Martin ---
            case "aston":
            case "aston martin":
            case "astonmartin":
                return "Aston Martin";

            // --- Audi ---
            case "audi":
            case "aodi":
                return "Audi";

            // --- Bentley ---
            case "bentley":
            case "bently":
                return "Bentley";

            // --- BMW ---
            case "bmw":
            case "b.m.w":
            case "b m w":
                return "BMW";

            // --- BYD ---
            case "byd":
            case "b.y.d":
                return "BYD";

            // --- Cadillac ---
            case "cadillac":
            case "cadilac":
            case "caddy":
                return "Cadillac";

            // --- Chery ---
            case "chery":
            case "cherry":
                return "Chery";

            // --- Chevrolet ---
            case "chevy":
            case "chevrolet":
            case "chevrolет":
                return "Chevrolet";

            // --- Citroën ---
            case "citroen":
            case "citroan":
            case "citroën":
                return "Citroën";

            // --- Cupra ---
            case "cupra":
            case "cuppa":
                return "Cupra";

            // --- Dacia ---
            case "dacia":
            case "dacia renault":
                return "Dacia";

            // --- DFSK ---
            case "dfsk":
            case "dongfeng":
            case "d.f.s.k":
                return "DFSK";

            // --- Dodge ---
            case "dodge":
            case "dodge ram":
                return "Dodge";

            // --- DS ---
            case "ds":
            case "d.s":
            case "ds automobiles":
                return "DS";

            // --- Ferrari ---
            case "ferrari":
            case "ferarri":
            case "ferari":
                return "Ferrari";

            // --- Fiat ---
            case "fiat":
            case "fiat chrysler":
                return "Fiat";

            // --- Ford ---
            case "ford":
            case "ford motor":
                return "Ford";

            // --- Geely ---
            case "geely":
            case "gely":
            case "geely auto":
                return "Geely";

            // --- GMC ---
            case "gmc":
            case "g.m.c":
            case "general motors":
                return "GMC";

            // --- Great Wall ---
            case "great wall":
            case "greatwall":
            case "gwm":
            case "great wall motors":
                return "Great Wall";

            // --- Honda ---
            case "honda":
            case "honda motors":
                return "Honda";

            // --- Hyundai ---
            case "hyundai":
            case "hundai":
            case "hyunday":
                return "Hyundai";

            // --- Infiniti ---
            case "infiniti":
            case "infinity":
            case "infinti":
                return "Infiniti";

            // --- Jaguar ---
            case "jaguar":
            case "jag":
            case "jaquar":
                return "Jaguar";

            // --- Jeep ---
            case "jeep":
            case "jeep chrysler":
                return "Jeep";

            // --- Jetour ---
            case "jetour":
            case "jetour auto":
                return "Jetour";

            // --- Kia ---
            case "kia":
            case "kia motors":
            case "kiah":
                return "Kia";

            // --- Lamborghini ---
            case "lamborghini":
            case "lambo":
            case "lamborgini":
                return "Lamborghini";

            // --- Lancia ---
            case "lancia":
            case "lancia automobiles":
                return "Lancia";

            // --- Land Rover ---
            case "land rover":
            case "landrover":
            case "range rover":
            case "rangerover":
                return "Land Rover";

            // --- Lexus ---
            case "lexus":
            case "lexsus":
                return "Lexus";

            // --- Maserati ---
            case "maserati":
            case "masserati":
            case "maserati spa":
                return "Maserati";

            // --- Mazda ---
            case "mazda":
            case "mazda motors":
                return "Mazda";

            // --- Mercedes ---
            case "mercedes":
            case "mercedes benz":
            case "mercedes-benz":
            case "merc":
            case "benz":
                return "Mercedes";

            // --- MG ---
            case "mg":
            case "m.g":
            case "morris garages":
                return "MG";

            // --- Mini Cooper ---
            case "mini":
            case "mini cooper":
            case "cooper":
            case "mini coop":
            case "mini cooper s":
                return "Mini Cooper";

            // --- Mitsubishi ---
            case "mitsubishi":
            case "mitsu":
            case "mitsubishi motors":
                return "Mitsubishi";

            // --- Nissan ---
            case "nissan":
            case "nisan":
                return "Nissan";

            // --- Opel ---
            case "opel":
            case "oppel":
                return "Opel";

            // --- Peugeot ---
            case "peugeot":
            case "peugot":
            case "puegeot":
                return "Peugeot";

            // --- Porsche ---
            case "porsche":
            case "porche":
            case "posche":
                return "Porsche";

            // --- Renault ---
            case "renault":
            case "renaul":
                return "Renault";

            // --- Rolls-Royce ---
            case "rolls royce":
            case "rolls-royce":
            case "rollsroyce":
            case "rolls":
                return "Rolls-Royce";

            // --- Seat ---
            case "seat":
            case "seat sa":
                return "Seat";

            // --- Skoda ---
            case "skoda":
            case "škoda":
            case "skoda auto":
                return "Skoda";

            // --- Subaru ---
            case "subaru":
            case "subaro":
                return "Subaru";

            // --- Suzuki ---
            case "suzuki":
            case "suzuky":
                return "Suzuki";

            // --- Toyota ---
            case "toyota":
            case "toyata":
            case "toyotta":
            case "toyota motors":
                return "Toyota";

            // --- Volkswagen ---
            case "volkswagen":
            case "vw":
            case "volkswagon":
            case "volks wagen":
                return "Volkswagen";

            // --- Volvo ---
            case "volvo":
            case "volvo cars":
                return "Volvo";

            default:
                return capitalizeWords(make);
        }
    }

    public static String capitalizeWords(String input) {
        return Arrays.stream(input.trim().split("\\s+"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }
}
