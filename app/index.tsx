import Colors from "@/services/Colors";
import { useNavigation, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO, useUser } from "@clerk/clerk-expo";
import { axiosClient } from "@/services/GlobalApi";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  useWarmUpBrowser();
  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();
  const navigation = useNavigation();
  const router = useRouter();

  const { user } = useUser();

  console.log(user?.fullName);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);
  const CreateNewUser = async () => {
    try {
      const result = await axiosClient.post("/user-lists", {
        data: {
          FullName: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        },
      });
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          // redirectUrl: AuthSession.makeRedirectUri({
          //   scheme: "bussinessdirectory",
          //   path: "sso-callback",
          // }),
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          // Check for session tasks and navigate to custom UI to help users resolve them
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }

            router.push("/");
          },
        });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, [router, startSSOFlow]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/welcome.png")}
        style={{
          width: "100%",
          height: 270,
          marginTop: 130,
          marginBottom: 25,
        }}
      ></Image>

      <Text style={styles.heading}>Welcome to</Text>
      <Text style={styles.heading}>Business Directory </Text>

      <View
        style={{
          padding: 20,
          backgroundColor: Colors.WHITE,
          margin: 20,
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "mont",
            color: Colors.PRIMARY,
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Discover Thousand of local business all in one place
        </Text>
        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.button,
            {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            },
          ]}
        >
          <Image
            source={require("../assets/images/google.png")}
            style={{
              width: 20,
              height: 20,
            }}
          ></Image>
          <Text
            style={{
              fontFamily: "mont",
              textAlign: "center",
              fontSize: 18,
            }}
          >
            {" "}
            Sign In With Google
          </Text>
        </TouchableOpacity>
        <View
          style={[
            styles.button,
            {
              backgroundColor: Colors.PRIMARY,
              borderColor: Colors.PRIMARY,
            },
          ]}
        >
          <Text
            style={{
              fontFamily: "mont",
              color: Colors.WHITE,
              textAlign: "center",
              fontSize: 18,
            }}
          >
            {" "}
            Skip
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY,
    height: "100%",
  },
  heading: {
    fontFamily: "mont-bold",
    fontSize: 30,
    color: Colors.WHITE,
    textAlign: "center",
  },
  button: {
    borderWidth: 1,
    borderRadius: 99,
    padding: 15,
    marginTop: 15,
  },
});
