import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { BusinessType } from "../HomeScreen/PopularBusinessList";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/services/Colors";

type Props = {
  business: BusinessType;
};

export default function BusinessInfo({ business }: Props) {
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Image
        source={{ uri: business?.images[0].url }}
        style={{
          width: "100%",
          height: 230,
          borderRadius: 15,
        }}
      ></Image>
      <View
        style={{
          marginTop: 15,
        }}
      >
        <Text
          style={{
            fontFamily: "mont-bold",
            fontSize: 25,
          }}
        >
          {business?.name}
        </Text>
        <View style={style.infoIconText}>
          <Ionicons name="location-outline" size={30} color={Colors.PRIMARY} />
          <Text style={style.infoText}>{business?.address}</Text>
        </View>
        <View style={style.infoIconText}>
          <Ionicons name="globe-outline" size={30} color={Colors.PRIMARY} />
          <Text style={style.infoText}>{business?.address}</Text>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  infoIconText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  infoText: {
    fontFamily: "mont",
    fontSize: 18,
    color: Colors.GRAY,
  },
});
