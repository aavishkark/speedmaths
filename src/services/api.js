const TOKEN_KEY = "speedmaths_auth_token";

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token) => {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
};

async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(path, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || `API Error: ${response.statusText}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // Network or offline error
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      const offlineError = new Error("Backend server is offline or unreachable.");
      offlineError.isOffline = true;
      throw offlineError;
    }
    throw err;
  }
}

export const authAPI = {
  register: (payload) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMe: () =>
    apiRequest("/api/auth/me", {
      method: "GET",
    }),

  updateProfile: (payload) =>
    apiRequest("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

export const statsAPI = {
  getStats: () =>
    apiRequest("/api/stats", {
      method: "GET",
    }),

  recordAttempt: (payload) =>
    apiRequest("/api/stats/attempt", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  syncProgress: (payload) =>
    apiRequest("/api/stats/sync", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resetTopic: (topicId) =>
    apiRequest(`/api/stats/${topicId}`, {
      method: "DELETE",
    }),
};

export const sprintAPI = {
  submitSprint: (payload) =>
    apiRequest("/api/sprint/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getLeaderboard: (topicId = "multiplication", duration = 60) =>
    apiRequest(`/api/sprint/leaderboard?topicId=${topicId}&duration=${duration}`, {
      method: "GET",
    }),

  getXpLeaderboard: (targetExam = "") => {
    const query = targetExam ? `?targetExam=${encodeURIComponent(targetExam)}` : "";
    return apiRequest(`/api/sprint/leaderboard/xp${query}`, {
      method: "GET",
    });
  },
};
