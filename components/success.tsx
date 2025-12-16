// Minimal Success Overlay
import { Modal,View,Text,Button  } from "react-native";
const SimpleSuccessOverlay = ({ isVisible, onClose, message }) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-5">
        <View className="bg-white rounded-xl p-6 w-full max-w-sm items-center">
          {/* <CheckCircle size={60} color="#10B981" className="mb-4" /> */}
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Success!
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            {message || "Your transaction was successful"}
          </Text>
          <Button
            input="Continue"
            onPress={onClose}
            variant="primary"
            className="w-full"
          />
        </View>
      </View>
    </Modal>
  );
};