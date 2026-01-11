import { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { StorageService } from "../services/storage";

export function useSecurity() {
  const [isProtected, setIsProtected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const enabled = await StorageService.loadSecurity();
      setIsProtected(enabled);
      if (!enabled) {
        setIsAuthenticated(true);
      } else {
        authenticate();
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setIsAuthenticated(true);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock Checker",
      fallbackLabel: "Use Passcode",
    });

    if (result.success) {
      setIsAuthenticated(true);
    }
  };

  const toggleProtection = async () => {
    const newStatus = !isProtected;
    if (newStatus) {
      // Try to authenticate before enabling
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm Biometrics to Enable",
      });
      if (!result.success) return;
    }

    setIsProtected(newStatus);
    await StorageService.saveSecurity(newStatus);
  };

  return {
    isProtected,
    isAuthenticated,
    isLoading,
    authenticate,
    toggleProtection,
  };
}
