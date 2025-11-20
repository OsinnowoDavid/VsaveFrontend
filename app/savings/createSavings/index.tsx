import React, { useCallback, useEffect, useMemo } from "react";
import {
    ScrollView,
    Text,
    View,
} from "react-native";
import HomeScreenWrapper from "../../../components/HomeScreenWrapper";
import CreateSaving from "../../../components/CreateSaving";

export default function ActivePlansScreen() {

    return (
        <HomeScreenWrapper showFooter={false}>
            <ScrollView
> 
<View>
<CreateSaving/>
  </View>             


            </ScrollView>
        </HomeScreenWrapper>
    );
}
