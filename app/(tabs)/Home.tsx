import Category from "@/components/HomeScreen/Category";
import Header from "@/components/HomeScreen/Header";
import PopularBusinessList from "@/components/HomeScreen/PopularBusinessList";
import Slider from "@/components/HomeScreen/Slider";
import Colors from "@/services/Colors";
import React from "react";
import { FlatList, View } from "react-native";

export default function Home() {
  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={
        <View
          style={{
            paddingTop: 25,
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
          {/* Header */}
          <Header></Header>
          {/* Slider */}
          <Slider></Slider>
          {/* Category  */}
          <Category></Category>
          {/* Popular Business  */}
          <PopularBusinessList></PopularBusinessList>
          <View
            style={{
              height: 100,
            }}
          ></View>
        </View>
      }
    ></FlatList>
  );
}
