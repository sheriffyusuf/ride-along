import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TripProvider } from "@/context/TripContext";

export default function RootLayout() {
  return (
    <TripProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#F8FBFF" },
        }}
      />
    </TripProvider>
  );
}
