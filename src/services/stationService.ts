import { mock, request, USE_MOCK } from "./api";
import { chargingStations, type Station } from "@/data/mockData";

/** Charging station discovery — future source: Flask + station availability API. */
export const stationService = {
  getStations: () => (USE_MOCK ? mock(chargingStations) : request<Station[]>("/stations")),
  getNearbyStations: (limit = 3) =>
    USE_MOCK
      ? mock([...chargingStations].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit))
      : request<Station[]>(`/stations/nearby?limit=${limit}`),
};
