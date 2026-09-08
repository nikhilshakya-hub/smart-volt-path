import { mock, request, USE_MOCK } from "./api";
import { recommendation, timeSlots, electricityPrices, type TimeSlot } from "@/data/mockData";

/** AI scheduler — future source: ML scheduler service. */
export const scheduleService = {
  getRecommendation: () =>
    USE_MOCK ? mock(recommendation) : request<typeof recommendation>("/schedule/recommendation"),
  getTimeSlots: () => (USE_MOCK ? mock(timeSlots) : request<TimeSlot[]>("/schedule/slots")),
  getElectricityPrices: () =>
    USE_MOCK ? mock(electricityPrices) : request<typeof electricityPrices>("/prices/forecast"),

  /**
   * Front-end cost estimate. Mirrors the formula the backend will use so the
   * UI can be swapped to a POST /schedule/estimate call without visual change.
   */
  estimateCharging(current: number, target: number, capacityKwh: number) {
    const delta = Math.max(0, Math.min(100, target) - Math.max(0, current));
    const requiredEnergy = (delta / 100) * capacityKwh;
    // Assume ~8% charging loss and the AI-recommended off-peak tariff.
    const withLoss = requiredEnergy * 1.08;
    const cost = withLoss * recommendation.electricityPrice;
    const peakCost = withLoss * 10.2;
    const hours = withLoss / 7.2; // 7.2 kW AC charger
    return {
      requiredEnergy: Number(requiredEnergy.toFixed(1)),
      estimatedCost: Math.round(cost),
      peakCost: Math.round(peakCost),
      savings: Math.round(peakCost - cost),
      durationHours: Number(hours.toFixed(1)),
      recommendedTime: recommendation.recommendedTime,
    };
  },
};
