import { View, Text } from "react-native";
import React from "react";
import { BusinessType } from "../HomeScreen/PopularBusinessList";
import Colors from "@/services/Colors";

type Props = {
  business: BusinessType;
};

export default function BusinessDescription({ business }: Props) {
  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <Text
        style={{
          fontFamily: "mont-bold",
          fontSize: 20,
        }}
      >
        Description
      </Text>
      <Text
        style={{
          fontFamily: "mont",
          fontSize: 18,
          color: Colors.GRAY,
          marginTop: 5,
        }}
      >
        {business?.description}
      </Text>
    </View>
  );
}
