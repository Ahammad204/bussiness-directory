import BusinessListCard from "@/components/BusinessListScreen/BusinessListCard";
import { BusinessType } from "@/components/HomeScreen/PopularBusinessList";
import Colors from "@/services/Colors";
import { axiosClient } from "@/services/GlobalApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
export default function BusinessList() {
  const { categoryName } = useLocalSearchParams();
  const [businessList, setBusinessList] = useState<BusinessType[]>([]);
  const [OriginalBusinessList, setOriginalBusinessList] = useState<
    BusinessType[]
  >([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetBusinessListByCategory();
  }, [categoryName]);

  const GetBusinessListByCategory = async () => {
    setLoading(true);
    setBusinessList([]);
    try {
      const result = await axiosClient.get(
        // "/business-lists?filters[category][name][$eq]" +
        // categoryName +
        // "&populate=*",
        `/business-lists?filters[category][name][$eq]=${categoryName}&populate=*`
      );
      setBusinessList(result?.data?.data);
      setOriginalBusinessList(result?.data?.data);
    } catch (error) {
      console.error("Error fetching business list:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSearchfilter = (searchInput: string) => {
    if (!searchInput) {
      setBusinessList(OriginalBusinessList);
      return;
    }
    const filterList = OriginalBusinessList.filter((item) =>
      item?.name.toLowerCase().includes(searchInput?.toLowerCase()),
    );
    setBusinessList(filterList);
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
          gap: 5,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "mont-bold",
            fontSize: 25,
            color: Colors.WHITE,
          }}
        >
          {categoryName} Business List
        </Text>
      </View>
      <View>
        <TextInput
          placeholder="Search Business"
          style={{
            backgroundColor: Colors.WHITE,
            padding: 15,
            borderRadius: 99,
            paddingHorizontal: 20,
            fontSize: 18,
            marginTop: 6,
          }}
          onChangeText={(value) => onSearchfilter(value)}
        ></TextInput>
      </View>
      <FlatList
        data={businessList}
        onRefresh={() => GetBusinessListByCategory()}
        refreshing={loading}
        renderItem={({ item, index }) => (
          <BusinessListCard business={item} key={index}></BusinessListCard>
        )}
      ></FlatList>
    </View>
  );
}
