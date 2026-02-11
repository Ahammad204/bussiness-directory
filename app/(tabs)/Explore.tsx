import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "@/services/Colors";
import { BusinessType } from "@/components/HomeScreen/PopularBusinessList";
import { axiosClient } from "@/services/GlobalApi";
import { useRouter } from "expo-router";

export default function Explore() {
  const [businessList, setBusinessList] = useState<BusinessType[]>([]);
  const searchTimer = useRef<any>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    GetBusinessList();
  });

  const GetBusinessList = async () => {
    setLoading(true);
    const result = await axiosClient.get(
      "/business-lists?filters[premium][$eq]=true&populate=*",
    );
    setBusinessList(result?.data?.data);
    setLoading(false);
  };

  const onChangeSearchInput = (value: string) => {
    setSearchText(value);
    if (searchTimer?.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => {
      if (value.trim() == "") {
        GetBusinessList();
      } else {
        searchBusiness(value);
      }
    }, 500);
  };

  const searchBusiness = async (value: string) => {
    setLoading(true);
    const result = await axiosClient.get(
      `/business-lists?filters[name][$containsi]=${value}&populate=*`,
    );

    setBusinessList(result?.data?.data);
    setLoading(false);
  };

  return (
    <View
      style={{
        paddingTop: 30,
        padding: 20,
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
      {/* Search bar */}
      <Text
        style={{
          fontSize: 25,
          fontFamily: "mont-bold",
          color: Colors.WHITE,
        }}
      >
        Explore More Business
      </Text>
      <TextInput
        placeholder="Search Business"
        style={{
          backgroundColor: Colors.WHITE,
          padding: 15,
          paddingHorizontal: 20,
          borderRadius: 99,
          marginTop: 10,
          fontSize: 18,
        }}
        onChangeText={(value) => onChangeSearchInput(value)}
      ></TextInput>

      {/* Business List */}
      <FlatList
        data={businessList}
        onRefresh={() =>
          searchText ? searchBusiness(searchText) : GetBusinessList()
        }
        refreshing={loading}
        style={{
          marginBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            style={{
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.GRAY,
              marginTop: 15,
            }}
            onPress={() =>
              router.push({
                pathname: "/business-detail",
                params: {
                  business: JSON.stringify(item),
                },
              })
            }
          >
            <Image
              source={{ uri: item?.images[0]?.url }}
              style={{
                width: "100%",
                height: 170,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
            ></Image>
            <View
              style={{
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "mont-bold",
                }}
              >
                {item?.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "mont",
                  color: Colors.GRAY,
                }}
              >
                {item?.address}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Image
                  source={require("../../assets/images/star.png")}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                ></Image>
                <Text>4.3/5</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      ></FlatList>
    </View>
  );
}
