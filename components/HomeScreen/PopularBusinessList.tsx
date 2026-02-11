import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import React, { use, useEffect, useState } from "react";
import Colors from "@/services/Colors";
import { axiosClient } from "@/services/GlobalApi";
import { CategoryType } from "./Category";

export type BusinessType = {
  name: string;
  premium: boolean;
  description: string;
  address: string;
  category: CategoryType;
  images: ImagesType[];
  id: number;
  phone: string;
  website: string;
};

type ImagesType = {
  url: string;
};

export default function PopularBusinessList() {
  const [businessList, setBusinessList] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPopularBusinessList();
  }, []);

  const getPopularBusinessList = async () => {
    setLoading(true);
    const result = await axiosClient.get(
      "/business-lists?filters[premium][$eq]=true&populate=*",
    );
    console.log(result.data.data);
    setBusinessList(result?.data?.data);
    setLoading(false);
  };

  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontFamily: "mont-bold",
          }}
        >
          Popular Business
        </Text>
        <Text
          style={{
            fontFamily: "mont",
            color: Colors.PRIMARY,
          }}
        >
          View All
        </Text>
      </View>
      {loading && (
        <ActivityIndicator
          size={"large"}
          color={Colors.PRIMARY}
        ></ActivityIndicator>
      )}

      <FlatList
        data={businessList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{
              width: 230,
              backgroundColor: Colors.WHITE,
              borderRadius: 15,
              marginRight: 10,
            }}
          >
            <Image
              source={{ uri: item.images[0]?.url }}
              style={{
                width: "100%",
                height: 120,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}
            ></Image>
            <View
              style={{
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "mont-bold",
                }}
              >
                {item?.name}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  color: Colors.GRAY,
                  fontFamily: "mont",
                }}
              >
                {item?.address}
              </Text>
              <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginTop: 5,
              }}>
                <Image
                  source={require("../../assets/images/star.png")}
                  style={{
                    width: 15,
                    height: 15,
                    marginTop: 5,
                  }}
                ></Image>
                <Text>4.3/5</Text>
              </View>
            </View>
          </View>
        )}
      ></FlatList>
    </View>
  );
}
