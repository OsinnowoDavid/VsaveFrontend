import Animated, { FadeInUp } from "react-native-reanimated";
import { Text , View} from "react-native";
import GradientText from "./GradientText";

export default function SloganText() {
    return (
        <Animated.View
            entering={FadeInUp
                .duration(700)
                .delay(200)}
            className="absolute top-56 flex flex-row items-baseline"
        >
<View>
                <Text className="text-4xl font-extrabold text-white">
                Save now, 
            </Text>
    
</View>


            <GradientText>
                {/* <Text className="text-4xl font-extrabold"> */}
                    Enjoy later
                {/* </Text> */}
            </GradientText>
        </Animated.View>
    );
}
