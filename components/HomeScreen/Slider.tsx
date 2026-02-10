import { View, Text, FlatList, Image, Dimensions } from "react-native";
import React, { use, useEffect, useState } from "react";
import { axiosClient } from "@/services/GlobalApi";

type SliderType = {
  name: string;
  image: { url: string };
};

export default function Slider() {
  const [sliders, setSliders] = useState<SliderType[]>([]);

  useEffect(() => {
    GetSlider();
  }, []);

  // Fetch slider from  Admin panel and show here
  const GetSlider = async () => {
    const result = await axiosClient.get("/sliders?populate=*");
    console.log(result.data);
    setSliders(result?.data?.data);
  };
  return (
    <View  style={{
        marginTop: 20,
    }}>
      <FlatList
        data={sliders}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item, index }) => (
          <View key={index}>
            <Image
              source={{ uri: item?.image?.url }}
              style={{
                width: Dimensions.get("screen").width * 0.9,
                height: 200,
                borderRadius: 18,
                marginRight: 15,
              }}
            ></Image>
          </View>
        )}
      ></FlatList>
    </View>
  );
}
