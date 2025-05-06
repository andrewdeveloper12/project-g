// History service for tracking health checkups

// Define history item types for type safety
export interface HistoryItem {
    id: string;
    type: 'blood-pressure' | 'heart' | 'diabetes' | 'anemia';
    date: string;
    readings: Record<string, any>;
    results?: string;
  }
  
  // Save a new health checkup to history
  export const saveCheckup = (userId: string, checkupData: Omit<HistoryItem, 'id' | 'date'>) => {
    try {
      // Get existing history
      const history = getHistory(userId);
      
      // Create new entry with unique ID and current date
      const newEntry: HistoryItem = {
        ...checkupData,
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36),
        date: new Date().toISOString()
      };
      
      // Add to history and save
      const updatedHistory = [newEntry, ...history];
      localStorage.setItem(`history_${userId}`, JSON.stringify(updatedHistory));
      
      return newEntry;
    } catch (error) {
      console.error('Error saving checkup:', error);
      return null;
    }
  };
  
  // Get all history for a user
  export const getHistory = (userId: string): HistoryItem[] => {
    try {
      const storedHistory = localStorage.getItem(`history_${userId}`);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Error retrieving history:', error);
      return [];
    }
  };
  
  // Get history filtered by type
  export const getHistoryByType = (userId: string, type: HistoryItem['type']): HistoryItem[] => {
    const history = getHistory(userId);
    return history.filter(item => item.type === type);
  };
  
  // Delete a history entry
  export const deleteHistoryEntry = (userId: string, entryId: string): boolean => {
    try {
      const history = getHistory(userId);
      const updatedHistory = history.filter(item => item.id !== entryId);
      localStorage.setItem(`history_${userId}`, JSON.stringify(updatedHistory));
      return true;
    } catch (error) {
      console.error('Error deleting history entry:', error);
      return false;
    }
  };
  
  // Clear all history for a user
  export const clearHistory = (userId: string): boolean => {
    try {
      localStorage.removeItem(`history_${userId}`);
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  };