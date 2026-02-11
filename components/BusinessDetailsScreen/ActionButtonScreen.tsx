import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  Share,
} from "react-native";
import React from "react";
import { BusinessType } from "../HomeScreen/PopularBusinessList";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/services/Colors";

type Props = {
  business: BusinessType;
};

export default function ActionButtonScreen({ business }: Props) {
  const onNavigate = async() => {
    const nativeUrl =
      Platform.OS === "ios"
        ? `maps:0,0?q=${business?.address}`
        : `geo:0,0?q=${business?.address}`;

     await Linking.openURL(nativeUrl);
  };

  const onCall = async() => {
    const phoneNumber = business?.phone;
    const url = `tel:${phoneNumber}`;
    await Linking.openURL(url);
    };

    const onWebsite = async() => {
        const url = business?.website.startsWith("http") ? business?.website : `https://${business?.website}`;
        await Linking.openURL(url);
    }

    const onShare = async() => {
        const result = await Share.share({
            message: `Check out ${business?.name} located at ${business?.address}. Contact: ${business?.phone}, Website: ${business?.website}`,
            
        })
    }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: 15,
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity onPress={() => onNavigate()}>
        <View style={styles.container}>
          <Ionicons name="navigate-sharp" size={30} color={Colors.WHITE} />
        </View>
        <Text style={styles.actionText}>Navigate</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onCall()}>
        <View style={styles.container}>
          <Ionicons name="call" size={30} color={Colors.WHITE} />
        </View>
        <Text style={styles.actionText}>Call</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onWebsite()}>
        <View style={styles.container}>
          <Ionicons name="globe" size={30} color={Colors.WHITE} />
        </View>
        <Text style={styles.actionText}>Website</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onShare()}>
        <View style={styles.container}>
          <Ionicons name="share" size={30} color={Colors.WHITE} />
        </View>
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
  },
  actionText: {
    fontFamily: "mont",
    textAlign: "center",
    marginTop: 2,
  },
});
