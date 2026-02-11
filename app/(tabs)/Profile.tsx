import Colors from "@/services/Colors";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Share, Text, TouchableOpacity, View } from "react-native";

interface MenuItemProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  isLogout?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onPress,
  isLogout = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
      }}
    >
      <Ionicons name={icon} size={24} color={isLogout ? "#EE7B7B" : "#666"} />
      <Text
        style={{
          fontSize: 16,
          marginLeft: 16,
          color: isLogout ? "#EE7B7B" : "#333",
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={24}
        color="#ccc"
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );
};

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleExplore = () => {
    router.push("/(tabs)/Explore");
  };

  const handleFavorite = () => {
    router.push("/(tabs)/Favorite");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out this amazing Business Directory app! Download now.",
        title: "Business Directory",
        url: "https://yourapp.com",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await signOut();
            router.replace("/");
          },
          style: "destructive",
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <View
        style={{
          padding: 20,
          paddingTop: 30,
        }}
      >
        <View
          style={{
            height: 250,
            width: "200%",
            backgroundColor: Colors.PRIMARY,
            position: "absolute",
            top: 0,
            left: -50,
          }}
        />

        {/* Profile Card */}
        <View
          style={{
            backgroundColor: Colors.WHITE,
            borderRadius: 16,
            padding: 20,
            marginBottom: 30,
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          {/* Avatar */}
          <View
            style={{
              height: 70,
              width: 70,
              borderRadius: 35,
              backgroundColor: Colors.PRIMARY,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: Colors.WHITE,
              }}
            >
              {user?.firstName?.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* User Info */}
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {user?.firstName} {user?.lastName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: Colors.GRAY,
                marginTop: 4,
              }}
            >
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View
          style={{
            backgroundColor: Colors.WHITE,
            borderRadius: 12,
            overflow: "hidden",
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
          }}
        >
          <MenuItem
            icon="compass-outline"
            label="Explore"
            onPress={handleExplore}
          />
          <MenuItem
            icon="heart-outline"
            label="Favorite"
            onPress={handleFavorite}
          />
          <MenuItem icon="share-social" label="Share" onPress={handleShare} />
          <MenuItem
            icon="mail-outline"
            label="Contact us"
            onPress={() => console.log("Contact us pressed")}
          />
          <MenuItem
            icon="log-out"
            label="Logout"
            isLogout={true}
            onPress={handleLogout}
          />
        </View>
      </View>
    </ScrollView>
  );
}
