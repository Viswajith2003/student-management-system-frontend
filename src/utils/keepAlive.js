// Keep backend alive by pinging it periodically
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://student-management-system-backend-nine.vercel.app/api";

export const wakeUpServer = async () => {
  try {
    const baseURL = API_URL.replace("/api", "");
    await fetch(baseURL, { method: "GET" });
    console.log("✅ Server wake-up ping sent");
  } catch (error) {
    console.log("❌ Server wake-up failed:", error.message);
  }
};

// Call this on app load or login page mount
export const initKeepAlive = () => {
  // Ping server immediately
  wakeUpServer();

  // Ping every 10 minutes to keep server awake
  const interval = setInterval(wakeUpServer, 10 * 60 * 1000);

  // Return cleanup function
  return () => clearInterval(interval);
};
