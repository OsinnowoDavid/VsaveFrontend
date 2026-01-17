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
import { updateProfile } from "../../../services/authService";

export default function AccountScreen() {
    const { profile, updateProfile: updateLocalProfile } = useProfileStore();

    // Rename to avoid conflict with imported function
    const handleSave = async (
        field: "firstName" | "lastName" | "email" | "phoneNumber",
        value: string
    ) => {
        try {
            // Create update data object
            const updateData = { [field]: value };
            
            // Call the API with the object
            const response = await updateProfile(updateData);
            
            // On success, update the local store state.
            updateLocalProfile(updateData);
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
            
            // Create FormData for image upload
            const formData = new FormData();
            const fileName = newImageUri.split('/').pop();
            const fileType = fileName?.split('.').pop();
            
            formData.append('profilePicture', {
                uri: newImageUri,
                type: `image/${fileType || 'jpeg'}`,
                name: fileName || 'profile.jpg',
            } as any);

            // Call the API for image upload
            // Note: You need to create an uploadProfilePicture API function
            try {
                const response = await updateProfile({ profilePicture: newImageUri });
                // Assuming your API can handle profile picture updates
                // If not, you'll need a separate upload function
                
                console.log(`Image uploaded: ${newImageUri}`);
                updateLocalProfile({ profilePicture: newImageUri });
            } catch (error) {
                console.error("Failed to upload image:", error);
                Alert.alert("Error", "Failed to update profile picture.");
            }
        }
    };

    return (
        <HomeScreenWrapper>
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
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
                                    profile?.profile?.profilePicture
                                        ? {
                                              uri: profile.profile
                                                  .profilePicture,
                                          }
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
                            initialValue={profile?.profile?.firstName ?? ""}
                            onSave={(value) => handleSave("firstName", value)}
                        />
                        <EditableField
                            label="Last Name"
                            initialValue={profile?.profile?.lastName ?? ""}
                            onSave={(value) => handleSave("lastName", value)}
                        />
                        <EditableField
                            label="Email Address"
                            initialValue={profile?.profile?.email ?? ""}
                            onSave={(value) => handleSave("email", value)}
                        />
                        <EditableField
                            label="Phone Number"
                            initialValue={profile?.profile?.phoneNumber ?? ""}
                            onSave={(value) => handleSave("phoneNumber", value)}
                        />
                    </View>
                </View>
            </ScrollView>
        </HomeScreenWrapper>
    );
}