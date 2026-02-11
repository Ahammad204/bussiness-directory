import { View, Text, FlatList } from "react-native";
import React, { use, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { axiosClient } from "@/services/GlobalApi";
import { BusinessType } from "@/components/HomeScreen/PopularBusinessList";
import Colors from "@/services/Colors";
import BusinessListCard from "@/components/BusinessListScreen/BusinessListCard";

export default function Favorite() {
  const { user } = useUser();
  const [businessList, setBusinessList] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      GetUserFavouriteBusinessList();
    }
  }, [user]);

  const GetUserFavouriteBusinessList = async () => {
    setLoading(true);
    const result = await axiosClient.get(
      "/user-favourites?filters[userEmail][$eq]=" +
        user?.primaryEmailAddress?.emailAddress +
        "&populate=*",
    );
    let businessIds: any = [];
    const favList = result?.data?.data;
    favList.forEach((item: any) => {
      businessIds.push(item?.businessId);
    });
    await GetBusinessList(businessIds);
    setLoading(false);
  };

  const GetBusinessList = async (businessId: []) => {
    const result = await axiosClient.get("/business-lists", {
      params: {
        "filters[id][$in]": businessId,
        populate: "*",
      },
    });
    setBusinessList(result?.data?.data);
    setLoading(false);
  };

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 30,
      }}
    >
      <View
        style={{
          height: 300,
          width: "200%",
          backgroundColor: Colors.PRIMARY,
          position: "absolute",
        }}
      ></View>
      <Text
        style={{
          fontSize: 25,
          fontFamily: "mont-bold",
          color: Colors.WHITE,
        }}
      >
        {user?.firstName} Favorite
      </Text>
      <FlatList
        data={businessList}
        showsVerticalScrollIndicator={false}
        onRefresh={() => GetUserFavouriteBusinessList()}
        refreshing={loading}
        renderItem={({ item, index }) => (
          <BusinessListCard business={item} key={index}></BusinessListCard>
        )}
      ></FlatList>
    </View>
  );
}
