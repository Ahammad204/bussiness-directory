import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { axiosClient } from "@/services/GlobalApi";
import Colors from "@/services/Colors";
import { useRouter } from "expo-router";

export type CategoryType = {
  name: string;
  premium: boolean;
  icon: { url: string };
};

export default function Category() {
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const router = useRouter();

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const result = await axiosClient.get(
      "/categories?filters[premium][$eq]=true&populate=*",
    );
    console.log(result.data.data);
    setCategoryList(result?.data?.data);
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
          Category
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
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            style={{
              flex: 1,
              alignItems: "center",
              padding: 3,
              backgroundColor: Colors.WHITE,
              margin: 3,
              borderRadius: 10,
              height: 85,
              justifyContent: "center",
            }}
            onPress={() =>
              router.push({
                pathname: "/business-list",
                params: { categoryName: item?.name },
              })
            }
          >
            <Image
              source={{ uri: item?.icon?.url }}
              style={{
                width: 40,
                height: 40,
                marginTop: 5,
              }}
            ></Image>
            <Text
              style={{
                textAlign: "center",
                marginTop: 5,

                fontFamily: "mont",
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      ></FlatList>
    </View>
  );
}
