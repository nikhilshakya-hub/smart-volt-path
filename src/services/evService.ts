import { mock, request, USE_MOCK } from "./api";
import {
  evData,
  batteryHistory,
  weeklyBattery,
  energyConsumption,
  chargingCostComparison,
  analyticsSummary,
  chargingHistory,
  notifications,
  userProfile,
} from "@/data/mockData";

/** Vehicle telemetry — will be fed by ESP32 sensor data later. */
export const evService = {
  getVehicleStatus: () => (USE_MOCK ? mock(evData) : request<typeof evData>("/vehicle/status")),
  getBatteryHistory: () =>
    USE_MOCK ? mock(batteryHistory) : request<typeof batteryHistory>("/vehicle/battery-history"),
  getWeeklyBattery: () => (USE_MOCK ? mock(weeklyBattery) : request<typeof weeklyBattery>("/analytics/battery")),
  getEnergyConsumption: () =>
    USE_MOCK ? mock(energyConsumption) : request<typeof energyConsumption>("/analytics/energy"),
  getCostComparison: () =>
    USE_MOCK ? mock(chargingCostComparison) : request<typeof chargingCostComparison>("/analytics/cost"),
  getAnalyticsSummary: () =>
    USE_MOCK ? mock(analyticsSummary) : request<typeof analyticsSummary>("/analytics/summary"),
  getChargingHistory: () =>
    USE_MOCK ? mock(chargingHistory) : request<typeof chargingHistory>("/vehicle/charging-history"),
  getNotifications: () => (USE_MOCK ? mock(notifications) : request<typeof notifications>("/notifications")),
  getProfile: () => (USE_MOCK ? mock(userProfile) : request<typeof userProfile>("/user/profile")),
};
