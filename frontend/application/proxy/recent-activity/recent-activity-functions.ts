import { fetchFromClient } from "../api";
import { fetchFromServer } from "../serverApi";

export async function createRecentActivity(userIds: number[], description: string) {
  const response = await fetchFromClient("/api/recent-activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userIds, description })
  });

  return response;
}

export async function getRecentActivities() {
  const response = await fetchFromClient("/api/recent-activity", {
    method: "GET",
  });

  return response;
}

export async function getRecentActivitiesServerSide() {
  const response = await fetchFromServer("/api/recent-activity", {
    method: "GET",
  });

  return response;
}