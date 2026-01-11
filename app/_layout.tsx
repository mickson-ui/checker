import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import '../src/services/i18n';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
