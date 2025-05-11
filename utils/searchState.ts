// Custom event for search reset
export const SEARCH_RESET_EVENT = "search-reset";

// Function to trigger search reset
export const triggerSearchReset = () => {
  window.dispatchEvent(new Event(SEARCH_RESET_EVENT));
};

// Function to subscribe to search reset events
export const subscribeToSearchReset = (callback: () => void) => {
  window.addEventListener(SEARCH_RESET_EVENT, callback);
  return () => window.removeEventListener(SEARCH_RESET_EVENT, callback);
};
