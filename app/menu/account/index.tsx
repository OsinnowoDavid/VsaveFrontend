import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ArrowLeft, Camera } from "lucide-react-native";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import EditableField from "../../../components/EditableField";
import HomeScreenWrapper from "../../../components/HomeScreenWrapper";
import useProfileStore from "../../../store/useProfileStore";

export default function AccountScreen() {
    const { profile, updateProfile } = useProfileStore();

    // This function would call your backend API to persist the changes.
    const handleSave = async (
        field: "firstName" | "lastName" | "email" | "phoneNumber",
        value: string
    ) => {
        try {
            // --- API Call Placeholder ---
            // const updatedProfile = await api.updateUserProfile({ [field]: value });
            // On success, update the local store state.
            console.log(`Simulating save for ${field}: ${value}`);
            updateProfile({ [field]: value });
            Alert.alert("Success", `${field} updated successfully.`);
        } catch (error) {
            console.error("Failed to update profile:", error);
            Alert.alert(
                "Error",
                "Failed to update your profile. Please try again."
            );
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const newImageUri = result.assets[0].uri;
            // --- API Call Placeholder for Image Upload ---
            // const formData = new FormData();
            // formData.append('profilePicture', { uri: newImageUri, name: 'photo.jpg', type: 'image/jpeg' });
            // const response = await api.uploadProfilePicture(formData);
            // On success, update the store with the new URL from the backend
            console.log(`Simulating image upload for URI: ${newImageUri}`);
            updateProfile({ profilePicture: newImageUri });
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
                                    profile?.profilePicture
                                        ? { uri: profile.profilePicture }
                                        : require("../../../assets/images/favicon-96x96.png")
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
                            label="First Name"
                            initialValue={profile?.firstName ?? ""}
                            onSave={(value) => handleSave("firstName", value)}
                        />
                        <EditableField
                            label="Last Name"
                            initialValue={profile?.lastName ?? ""}
                            onSave={(value) => handleSave("lastName", value)}
                        />
                        <EditableField
                            label="Email Address"
                            initialValue={profile?.email ?? ""}
                            onSave={(value) => handleSave("email", value)}
                        />
                        <EditableField
                            label="Phone Number"
                            initialValue={profile?.phoneNumber ?? ""}
                            onSave={(value) => handleSave("phoneNumber", value)}
                        />
                    </View>
                </View>
            </ScrollView>
        </HomeScreenWrapper>
    );
}
