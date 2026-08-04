import { fetchFromClient } from "../api";
import { fetchFromServer } from "../serverApi";

export async function getMyStats(){
  const response = await fetchFromClient("/api/stats/my-stats", {
    method: "GET"
  });
  return response;
}


export async function getMyStatsServerSide(){
  const response = await fetchFromServer("/api/stats/my-stats", {
    method: "GET"
  });
  return response;
}

export async function getThreeLastOpenedPlans(){
  const response = await fetchFromServer("/api/stats/three-last-opened-plans", {
    method: "GET"
  });
  return response;
}

export async function getAdminStats() {
  return fetchFromClient('/api/stats/admin', { method: 'GET' });
}
