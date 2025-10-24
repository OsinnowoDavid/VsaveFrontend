import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ArrowLeft, Camera } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import EditableField from "../../../components/EditableField";
import HomeScreenWrapper from "../../../components/HomeScreenWrapper";
export default function AccountScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [user, setUser] = useState({
        fullName: "David",
        email: "david@example.com",
        phone: "+1 234 567 890",
    });

    const handleSave = (field: keyof typeof user, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }));
        // Here you would typically call an API to save the data
        console.log(`Saving ${field}: ${value}`);
    };

    const pickImage = async () => {
        // No permissions request is needed for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <HomeScreenWrapper bgColor="bg-gray-50">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View className="flex-row items-center p-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2"
                    >
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800 ml-4">
                        Account
                    </Text>
                </View>

                <View className="p-4 flex-1">
                    {/* Profile Image */}
                    <View className="items-center z-10">
                        <View className="relative">
                            <Image
                                source={
                                    image
                                        ? { uri: image }
                                        : require("../../../assets/images/apple-touch-icon.png")
                                }
                                className="w-32 h-32 rounded-full border-4 border-gray-50"
                            />
                            <TouchableOpacity
                                onPress={pickImage}
                                className="absolute bottom-1 right-1 bg-green-700 p-2 rounded-full border-2 border-white"
                            >
                                <Camera size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Details Container */}
                    <View className="bg-white rounded-lg shadow-sm p-6 -mt-16 pt-20">
                        {/* Editable Fields */}
                        <EditableField
                            label="Full Name"
                            initialValue={user.fullName}
                            onSave={(value) => handleSave("fullName", value)}
                        />
                        <EditableField
                            label="Email Address"
                            initialValue={user.email}
                            onSave={(value) => handleSave("email", value)}
                        />
                        <EditableField
                            label="Phone Number"
                            initialValue={user.phone}
                            onSave={(value) => handleSave("phone", value)}
                        />
                    </View>
                </View>
            </ScrollView>
        </HomeScreenWrapper>
    );
}
