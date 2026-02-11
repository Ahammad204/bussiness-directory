import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";
import { ClerkProvider } from "@clerk/clerk-expo";

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    mont: require("../assets/fonts/Montserrat-Regular.ttf"),
    "mont-bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "mont-semibold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });

  if (!fontLoaded) {
    return <ActivityIndicator />;
  }
  return (
    <ClerkProvider>
      <Stack
        screenOptions={{
          headerShown : false,
        }}
      />
    </ClerkProvider>
  );
}
