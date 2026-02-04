"use client";

import { useState, useCallback } from "react";
import type { PostcodeResult } from "@/types/checkout";

// Mock Dutch address data for demo purposes
// In production, this would call Postcode.nl API or similar
const mockAddresses: Record<string, PostcodeResult> = {
  "1012AB1": {
    street: "Dam",
    city: "Amsterdam",
    municipality: "Amsterdam",
    province: "Noord-Holland",
    latitude: 52.373,
    longitude: 4.893,
  },
  "1017PT42": {
    street: "Prinsengracht",
    city: "Amsterdam",
    municipality: "Amsterdam",
    province: "Noord-Holland",
    latitude: 52.362,
    longitude: 4.884,
  },
  "3011AD10": {
    street: "Coolsingel",
    city: "Rotterdam",
    municipality: "Rotterdam",
    province: "Zuid-Holland",
    latitude: 51.922,
    longitude: 4.479,
  },
  "2511BT1": {
    street: "Binnenhof",
    city: "Den Haag",
    municipality: "'s-Gravenhage",
    province: "Zuid-Holland",
    latitude: 52.079,
    longitude: 4.313,
  },
  "3512JE15": {
    street: "Domplein",
    city: "Utrecht",
    municipality: "Utrecht",
    province: "Utrecht",
    latitude: 52.091,
    longitude: 5.122,
  },
};

// Generate more mock addresses for testing
function generateMockAddress(postcode: string, houseNumber: string): PostcodeResult | null {
  // Extract numeric part of postcode to generate deterministic data
  const numericPart = parseInt(postcode.replace(/\D/g, ""), 10);

  if (isNaN(numericPart)) return null;

  const streets = [
    "Hoofdstraat", "Kerkstraat", "Dorpsstraat", "Schoolstraat",
    "Stationsweg", "Molenweg", "Nieuwstraat", "Marktplein",
    "Vijverweg", "Parkweg", "Lindelaan", "Beukenlaan"
  ];

  const cities = [
    "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
    "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen"
  ];

  const provinces = [
    "Noord-Holland", "Zuid-Holland", "Utrecht", "Noord-Brabant",
    "Gelderland", "Overijssel", "Limburg", "Friesland"
  ];

  const streetIndex = numericPart % streets.length;
  const cityIndex = Math.floor(numericPart / 100) % cities.length;
  const provinceIndex = Math.floor(numericPart / 1000) % provinces.length;

  return {
    street: streets[streetIndex],
    city: cities[cityIndex],
    municipality: cities[cityIndex],
    province: provinces[provinceIndex],
    latitude: 51.5 + (numericPart % 200) / 100,
    longitude: 4.0 + (numericPart % 150) / 100,
  };
}

export interface UsePostcodeLookupReturn {
  lookup: (postcode: string, houseNumber: string) => Promise<void>;
  result: PostcodeResult | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function usePostcodeLookup(): UsePostcodeLookupReturn {
  const [result, setResult] = useState<PostcodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (postcode: string, houseNumber: string) => {
    // Clean inputs
    const cleanPostcode = postcode.replace(/\s/g, "").toUpperCase();
    const cleanHouseNumber = houseNumber.trim();

    // Validate inputs
    if (!cleanPostcode || !cleanHouseNumber) {
      return;
    }

    // Validate postcode format
    const postcodeRegex = /^[1-9][0-9]{3}[A-Z]{2}$/;
    if (!postcodeRegex.test(cleanPostcode)) {
      setError("Voer een geldige postcode in (bijv. 1234 AB)");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Check mock data first
      const key = `${cleanPostcode}${cleanHouseNumber}`;
      let addressResult: PostcodeResult | null = mockAddresses[key] || null;

      // If not in mock data, generate a plausible address
      if (!addressResult) {
        addressResult = generateMockAddress(cleanPostcode, cleanHouseNumber);
      }

      if (addressResult) {
        setResult(addressResult);
      } else {
        setError("Adres niet gevonden. Controleer de postcode en het huisnummer.");
      }
    } catch {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { lookup, result, isLoading, error, reset };
}
