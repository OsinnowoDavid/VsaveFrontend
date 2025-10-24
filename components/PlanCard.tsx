import { Text, View } from "react-native";

// ---------------- PlanCard ----------------
export type PlanCardProps = {
    title: string;
    amount: string;
    startDate: string;
    maturityDate: string;
    progress: number; // 0–100
};

export const PlanCard: React.FC<PlanCardProps> = ({
    title,
    amount,
    startDate,
    maturityDate,
    progress,
}) => {
    return (
        <View className="bg-white rounded border border-green-800 mb-2 px-2 py-3">
            {/* Top row */}
            <View className="flex-row justify-between items-center px-2">
                <Text className="text-lg font-medium text-[#212121]">
                    {title}
                </Text>
                <Text className="text-base font-medium text-[#212121]">
                    {amount}
                </Text>
            </View>

            {/* Progress bar */}
            <View className="w-[300px] h-[5px] bg-[#EFEFEFA3] rounded mt-1 mx-auto">
                <View
                    className="h-[5px] bg-[#1B8A52] rounded"
                    style={{ width: `${progress}%` }}
                />
            </View>

            {/* Bottom row */}
            <View className="flex-row justify-between items-center px-2 mt-2">
                <Text className="text-sm text-[#5C5A5A]">
                    Start Date: {startDate}
                </Text>
                <Text className="text-sm text-[#5C5A5A]">
                    Maturity Date: {maturityDate}
                </Text>
            </View>
        </View>
    );
};
