import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkData, WorkDataJSON } from "../models/WorkData";

const STORAGE_KEY = "work_hours_data";
const LANGUAGE_KEY = "preferred_language";

export const StorageService = {
  async saveData(data: WorkData): Promise<void> {
    try {
      const jsonString = JSON.stringify(data.toJson());
      await AsyncStorage.setItem(STORAGE_KEY, jsonString);
    } catch (e) {
      console.error("Error saving data", e);
    }
  },

  async loadData(): Promise<WorkData> {
    try {
      const jsonString = await AsyncStorage.getItem(STORAGE_KEY);
      if (!jsonString) return new WorkData();

      const json = JSON.parse(jsonString) as WorkDataJSON;
      return WorkData.fromJson(json);
    } catch (e) {
      console.error("Error loading data", e);
      return new WorkData();
    }
  },

  async saveLanguage(languageCode: string): Promise<void> {
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
  },

  async loadLanguage(): Promise<string | null> {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  },

  async saveSecurity(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem("security_enabled", enabled ? "true" : "false");
  },

  async loadSecurity(): Promise<boolean> {
    const val = await AsyncStorage.getItem("security_enabled");
    return val === "true";
  },

  async clearData(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(LANGUAGE_KEY);
    await AsyncStorage.removeItem("security_enabled");
  },
};
