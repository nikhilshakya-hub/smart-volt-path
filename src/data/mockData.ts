/**
 * EV Smart — mock data.
 * All values here are placeholders that mirror the shape of the future
 * Flask / ML scheduler / ESP32 API responses.
 */

export type StationStatus = "Available" | "Limited" | "Full";

export interface Station {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  availableSlots: number;
  totalSlots: number;
  chargingSpeed: "Fast Charging" | "Rapid Charging" | "Standard";
  chargerType: "CCS2" | "CHAdeMO" | "Type 2" | "Bharat DC-001";
  pricePerKwh: number;
  status: StationStatus;
  /** Relative position on the map placeholder (0–100). */
  mapX: number;
  mapY: number;
}

export const evData = {
  vehicleName: "Nexon EV Max",
  batteryLevel: 72,
  estimatedRange: 185,
  chargingStatus: "Idle" as "Idle" | "Charging" | "Scheduled",
  batteryTemperature: 28,
  location: "Delhi, India",
  batteryHealth: 92,
  batteryCapacityKwh: 40.5,
};

export const recommendation = {
  recommendedTime: "11:00 PM – 1:00 AM",
  bestTime: "11:00 PM",
  electricityPrice: 5.1,
  estimatedCost: 156,
  energyKwh: 20,
  savingsPercent: 22,
  savingsAmount: 44,
  message:
    "Based on your current battery level and predicted electricity prices, charging between 11:00 PM and 1:00 AM is recommended.",
};

export const batteryHistory = [
  { time: "8 AM", level: 95 },
  { time: "10 AM", level: 82 },
  { time: "12 PM", level: 72 },
  { time: "2 PM", level: 65 },
  { time: "4 PM", level: 55 },
  { time: "6 PM", level: 42 },
  { time: "8 PM", level: 35 },
];

export const electricityPrices = [
  { time: "8 AM", price: 9.5 },
  { time: "10 AM", price: 8.4 },
  { time: "12 PM", price: 7.2 },
  { time: "2 PM", price: 7.9 },
  { time: "4 PM", price: 8.8 },
  { time: "6 PM", price: 9.8 },
  { time: "8 PM", price: 10.2 },
  { time: "10 PM", price: 6.4 },
  { time: "11 PM", price: 5.1 },
  { time: "2 AM", price: 4.8 },
  { time: "5 AM", price: 6.1 },
];

export const chargingStations: Station[] = [
  {
    id: "st-01",
    name: "EV Smart Charging Hub",
    address: "Sector 62, Noida, Delhi NCR",
    distanceKm: 2.4,
    availableSlots: 3,
    totalSlots: 6,
    chargingSpeed: "Fast Charging",
    chargerType: "CCS2",
    pricePerKwh: 5.2,
    status: "Available",
    mapX: 42,
    mapY: 38,
  },
  {
    id: "st-02",
    name: "Tata Power EZ Charge",
    address: "Connaught Place, New Delhi",
    distanceKm: 3.8,
    availableSlots: 1,
    totalSlots: 4,
    chargingSpeed: "Rapid Charging",
    chargerType: "CCS2",
    pricePerKwh: 6.0,
    status: "Limited",
    mapX: 62,
    mapY: 30,
  },
  {
    id: "st-03",
    name: "Statiq GreenPoint",
    address: "Saket District Centre, Delhi",
    distanceKm: 5.1,
    availableSlots: 4,
    totalSlots: 4,
    chargingSpeed: "Standard",
    chargerType: "Type 2",
    pricePerKwh: 4.9,
    status: "Available",
    mapX: 28,
    mapY: 62,
  },
  {
    id: "st-04",
    name: "ChargeZone DLF Mall",
    address: "DLF Mall of India, Noida",
    distanceKm: 6.3,
    availableSlots: 0,
    totalSlots: 8,
    chargingSpeed: "Fast Charging",
    chargerType: "CHAdeMO",
    pricePerKwh: 5.8,
    status: "Full",
    mapX: 74,
    mapY: 58,
  },
  {
    id: "st-05",
    name: "Ather Grid Dwarka",
    address: "Sector 10, Dwarka, Delhi",
    distanceKm: 8.7,
    availableSlots: 2,
    totalSlots: 5,
    chargingSpeed: "Standard",
    chargerType: "Bharat DC-001",
    pricePerKwh: 4.6,
    status: "Available",
    mapX: 16,
    mapY: 34,
  },
  {
    id: "st-06",
    name: "BluSmart Charging Depot",
    address: "Gurugram Cyber City, Haryana",
    distanceKm: 11.2,
    availableSlots: 1,
    totalSlots: 10,
    chargingSpeed: "Rapid Charging",
    chargerType: "CCS2",
    pricePerKwh: 5.5,
    status: "Limited",
    mapX: 54,
    mapY: 76,
  },
];

export type SlotRecommendation = "Recommended" | "Alternative" | "Moderate" | "Not Recommended";

export interface TimeSlot {
  time: string;
  price: number;
  traffic: "High" | "Medium" | "Low";
  availability: "Available" | "Limited";
  aiScore: number;
  recommendation: SlotRecommendation;
}

export const timeSlots: TimeSlot[] = [
  { time: "6 PM – 8 PM", price: 10.2, traffic: "High", availability: "Available", aiScore: 45, recommendation: "Not Recommended" },
  { time: "8 PM – 10 PM", price: 8.5, traffic: "Medium", availability: "Available", aiScore: 68, recommendation: "Moderate" },
  { time: "11 PM – 1 AM", price: 5.1, traffic: "Low", availability: "Available", aiScore: 95, recommendation: "Recommended" },
  { time: "2 AM – 4 AM", price: 4.8, traffic: "Low", availability: "Limited", aiScore: 89, recommendation: "Alternative" },
];

export const energyConsumption = [
  { day: "Mon", kwh: 22 },
  { day: "Tue", kwh: 18 },
  { day: "Wed", kwh: 25 },
  { day: "Thu", kwh: 20 },
  { day: "Fri", kwh: 28 },
  { day: "Sat", kwh: 16 },
  { day: "Sun", kwh: 12 },
];

export const weeklyBattery = [
  { day: "Mon", level: 88 },
  { day: "Tue", level: 64 },
  { day: "Wed", level: 91 },
  { day: "Thu", level: 57 },
  { day: "Fri", level: 79 },
  { day: "Sat", level: 46 },
  { day: "Sun", level: 72 },
];

export const chargingCostComparison = [
  { month: "May", traditional: 2380, optimized: 1790 },
  { month: "Jun", traditional: 2510, optimized: 1860 },
  { month: "Jul", traditional: 2450, optimized: 1850 },
];

export const analyticsSummary = {
  totalDistanceKm: 1245,
  energyConsumedKwh: 245,
  totalChargingCost: 1850,
  averageEfficiency: 5.2,
  traditionalCost: 2450,
  optimizedCost: 1850,
};

export const chargingHistory = [
  { id: "ch-1", date: "Jul 21", station: "EV Smart Charging Hub", energyKwh: 18.4, cost: 96, duration: "1h 42m" },
  { id: "ch-2", date: "Jul 18", station: "Statiq GreenPoint", energyKwh: 22.0, cost: 108, duration: "2h 10m" },
  { id: "ch-3", date: "Jul 15", station: "Tata Power EZ Charge", energyKwh: 15.6, cost: 94, duration: "0h 58m" },
  { id: "ch-4", date: "Jul 11", station: "Ather Grid Dwarka", energyKwh: 20.2, cost: 93, duration: "2h 05m" },
];

export const notifications = [
  { id: "n1", title: "Cheapest window tonight", body: "₹5.1/kWh from 11:00 PM. Schedule now to save 22%.", time: "2m ago", unread: true },
  { id: "n2", title: "Battery at 72%", body: "Estimated range 185 km. No immediate charge needed.", time: "1h ago", unread: true },
  { id: "n3", title: "Station update", body: "EV Smart Charging Hub now has 3 free slots.", time: "3h ago", unread: false },
];

export const userProfile = {
  name: "Nikhil Sharma",
  email: "nikhil@evsmart.app",
  vehicleName: "My Nexon",
  vehicleModel: "Tata Nexon EV Max",
  batteryCapacity: 40.5,
  initials: "NS",
};
