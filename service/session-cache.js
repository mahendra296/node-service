// In-memory cache for active sessions
// Using a Set for O(1) lookup performance

const activeSessions = new Set();

export const addSession = (sessionId) => {
  activeSessions.add(sessionId);
};

export const removeSession = (sessionId) => {
  activeSessions.delete(sessionId);
};

export const removeSessions = (sessionIds) => {
  sessionIds.forEach((id) => activeSessions.delete(id));
};

export const isSessionActive = (sessionId) => {
  return activeSessions.has(sessionId);
};

export const clearAllSessions = () => {
  activeSessions.clear();
};

// For debugging
export const getActiveSessionCount = () => {
  return activeSessions.size;
};
