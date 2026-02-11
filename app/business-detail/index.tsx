import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { use, useEffect, useState } from "react";
import Colors from "@/services/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import BusinessInfo from "@/components/BusinessDetailsScreen/BusinessInfo";
import ActionButtonScreen from "@/components/BusinessDetailsScreen/ActionButtonScreen";
import BusinessDescription from "@/components/BusinessDetailsScreen/BusinessDescription";
import { axiosClient } from "@/services/GlobalApi";
import { useUser } from "@clerk/clerk-expo";

export default function BusinessDetail() {
  const router = useRouter();
  const { business } = useLocalSearchParams();
  const businessDetail = JSON.parse(business.toString());
  const { user } = useUser();
  const [isFavourite, setIsFavourite] = useState(false);
  const [favDetails, setFavDetails] = useState<{ documentId: string }>();

  useEffect(() => {
    user && checkIsFavourite();
  }, [user]);

  const MarkAsFavourite = async () => {
    if (isFavourite) {
        await axiosClient.delete("/user-favourites/" + favDetails?.documentId);
        ToastAndroid.show("Removed from favourites", ToastAndroid.BOTTOM);
        checkIsFavourite();
    } else {
      const result = await axiosClient.post("/user-favourites", {
        data: {
          businessId: businessDetail?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        },
      });
      ToastAndroid.show("Added to favourites", ToastAndroid.BOTTOM);
        checkIsFavourite();
    }
  };

  const checkIsFavourite = async () => {
    const result = await axiosClient.get(
      "/user-favourites?filters[userEmail][$eq]=" +
        user?.primaryEmailAddress?.emailAddress +
        "&filters[businessId][$eq]" +
        businessDetail?.id,
    );
    const data = result?.data?.data;
    setFavDetails(data[0]);
    if (data?.length > 0) {
      setIsFavourite(true);
    } else {
      setIsFavourite(false);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 25,
      }}
    >
      <View
        style={{
          height: 200,
          backgroundColor: Colors.PRIMARY,
          position: "absolute",
          width: "200%",
        }}
      ></View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        {!isFavourite ? (
          <TouchableOpacity onPress={() => MarkAsFavourite()}>
            <Ionicons name="bookmark-outline" size={30} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => MarkAsFavourite()}>
            <Ionicons name="bookmark" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <BusinessInfo business={businessDetail}></BusinessInfo>
      {/* Action Button */}
      <ActionButtonScreen business={businessDetail}></ActionButtonScreen>
      {/* Description */}
      <BusinessDescription business={businessDetail}></BusinessDescription>
    </View>
  );
}
