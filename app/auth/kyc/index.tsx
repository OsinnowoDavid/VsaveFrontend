import { Country, State } from "country-state-city";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidWrapper";
import PinField from "../../../components/PinField";

import { getBankList, resolveBankAccount } from "../../../services/bankService";
import {
    getSubRegions,
    submitKYCStage1,
    SubRegion,
} from "../../../services/kycService";

import useAuthStore from "../../../store/useAuthStore";
import useProfileStore from "../../../store/useProfileStore";

interface Bank {
    id: number;
    code: string;
    name: string;
}

/* ------------------------ COUNTRY HELPERS ------------------------ */

const countries = Country.getAllCountries();

const countryIndexToCodeMap: Record<string, number> = {};
const countryOptions = countries.map((c, index) => {
    countryIndexToCodeMap[c.isoCode] = index;
    return { label: c.name, value: c.isoCode };
});

const getStateOptions = (countryCode: string) =>
    State.getStatesOfCountry(countryCode).map((s) => ({
        label: s.name,
        value: s.isoCode,
    }));

const initialCountryCode = "NG";
const initialCountry =
    countryOptions[countryIndexToCodeMap[initialCountryCode]];

/* ----------------------------- SCREEN ----------------------------- */

export default function KYCScreen() {
    const router = useRouter();
    const { fetchProfile } = useProfileStore();

    const [banks, setBanks] = useState<Bank[]>([]);
    const [subRegions, setSubRegions] = useState<SubRegion[]>([]);
    const [stateOptions, setStateOptions] = useState(
        getStateOptions(initialCountryCode)
    );

    const [resolvedAccountName, setResolvedAccountName] =
        useState<string | null>(null);

    const [isResolving, setIsResolving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showPin, setShowPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);
    const [pinError, setPinError] = useState<string | null>(null);

    const [form, setForm] = useState({
        profession: "",
        accountNumber: "",
        bankCode: "",
        accountDetails:"",
        country: initialCountry.value,
        state: "",
        address: "",
        bvn: "",
        subRegion: "",
        transactionPin: "",
        confirmTransactionPin: "",
    });

    const updateForm = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    /* ----------------------- INITIAL FETCH ----------------------- */

    useEffect(() => {
        (async () => {
            const banksRes = await getBankList();
            if (banksRes.success) setBanks(banksRes.data);

            const regionsRes = await getSubRegions();
            if (regionsRes.success && regionsRes.data) {
                setSubRegions(regionsRes.data);
            }
        })();
    }, []);

    /* ----------------------- COUNTRY CHANGE ----------------------- */

    useEffect(() => {
        setStateOptions(getStateOptions(form.country));
        updateForm("state", "");
    }, [form.country]);

    /* ----------------------- ACCOUNT RESOLVE ---------------------- */

    useEffect(() => {
        if (form.accountNumber.length === 10 && form.bankCode) {
            const timer = setTimeout(resolveAccount, 800);
            return () => clearTimeout(timer);
        }
        setResolvedAccountName(null);
    }, [form.accountNumber, form.bankCode]);

    const resolveAccount = async () => {
        setIsResolving(true);
        setResolvedAccountName(null);

        const res = await resolveBankAccount({
            accountNumber: form.accountNumber,
            bankCode: form.bankCode,
        });

        setIsResolving(false);

        if (res.success && res.data.account_name) {
            setResolvedAccountName(res.data.account_name);
        } else {
            Alert.alert("Verification Failed", res.message);
        }
    };

    /* ---------------------------- SUBMIT ---------------------------- */


 interface KYCStage1Data {
    profession: string;
    accountNumber: string;
    bankCode: string;  // This is what it expects
    country: string;
    state: string;
    address: string;
    bvn: string;
    accountDetails: string;
    subRegion: string;
    transactionPin: string;
}

    const handleSubmit = async () => {
        if (!resolvedAccountName) {
            Alert.alert("Error", "Please resolve bank account.");
            return;
        }

        if (
            form.transactionPin.length !== 4 ||
            form.confirmTransactionPin.length !== 4
        ) {
            Alert.alert("Invalid PIN", "PIN must be 4 digits.");
            return;
        }

        if (form.transactionPin !== form.confirmTransactionPin) {
            setPinError("PINs do not match.");
            return;
        }

        setPinError(null);
        setIsLoading(true);

        const payload = {
            profession: form.profession,
            accountNumber: form.accountNumber,
            bank: form.bankCode,
            country: form.country,
            state: form.state,
            address: form.address,
            bvn: form.bvn,
           accountDetails: resolvedAccountName,
            subRegion: form.subRegion,
            transactionPin: form.transactionPin,
        };

        const res = await submitKYCStage1(payload);
        setIsLoading(false);

        if (res.success) {
            const token = useAuthStore.getState().token;
            if (token) await fetchProfile(token);
            router.replace("/home");
        } else {
            Alert.alert("Submission Failed", res.message);
        }
    };

    /* ----------------------------- UI ----------------------------- */

    return (
        <ScreenWrapper>
            <TouchableOpacity onPress={()=> router.back()}>

<View className="  mt-10">
    <Text className="text-white">
        Go home
    </Text>
</View>
            </TouchableOpacity>

            <FormWrapper heading="KYC Verification">
                <KeyboardAvoidingWrapper>

                    <FormField
                        label="Profession"
                        type="select"
                        value={form.profession}
                        onChangeText={(v) =>
                            updateForm("profession", v)
                        }
                        options={[
                            { label: "Lottery Agent", value: "Lottery Agent", },
                            { label: "Student", value: "Student" },
                            { label: "Self Employed", value: "self-employed" },
                            { label: "Unemployed", value: "unemployed" },
                            { label: "Others", value: "others" },
                        ]}
                    />

                    <FormField
                        label="Bank"
                        type="select"
                        value={form.bankCode}
                        onChangeText={(v) =>
                            updateForm("bankCode", v)
                        }
                        options={banks.map((b) => ({
                            label: b.name,
                            value: b.code,
                        }))}
                    />

                    <FormField
                        label="Account Number"
                        keyboardType="number-pad"
                        maxLength={10}
                        value={form.accountNumber}
                        onChangeText={(v) =>
                            updateForm("accountNumber", v)
                        }
                    />

                    {isResolving && <ActivityIndicator className="my-2" />}

                    {resolvedAccountName && (
                        <View className="bg-green-50 p-3 rounded-lg mb-4">
                            <Text className="text-green-800 font-semibold">
                                {resolvedAccountName}
                            </Text>
                        </View>
                    )}

                    <FormField
                        label="Country"
                        type="select"
                        value={form.country}
                        onChangeText={(v) =>
                            updateForm("country", v)
                        }
                        options={countryOptions}
                    />

                    <FormField
                        label="State"
                        type="select"
                        value={form.state}
                        onChangeText={(v) =>
                            updateForm("state", v)
                        }
                        options={stateOptions}
                    />

                    <FormField
                        label="Address"
                        value={form.address}
                        onChangeText={(v) =>
                            updateForm("address", v)
                        }
                    />

                    <FormField
                        label="Sub Region"
                        type="select"
                        value={form.subRegion}
                        onChangeText={(v) =>
                            updateForm("subRegion", v)
                        }
                        options={subRegions.map((r) => ({
                            label: r.subRegionName,
                            value: r._id,
                        }))}
                    />

                    <FormField
                        label="BVN"
                        keyboardType="number-pad"
                        maxLength={11}
                        value={form.bvn}
                        onChangeText={(v) =>
                            updateForm("bvn", v)
                        }
                    />

                    <View className="mt-6">
                        <Text className="text-lg font-semibold mb-4">
                            Transaction PIN
                        </Text>

                        <PinField
                            label="Create PIN"
                            value={form.transactionPin}
                            onChangeText={(v) =>
                                updateForm("transactionPin", v)
                            }
                            show={showPin}
                            onToggleShow={() =>
                                setShowPin((p) => !p)
                            }
                        />

                        <PinField
                            label="Confirm PIN"
                            value={form.confirmTransactionPin}
                            onChangeText={(v) =>
                                updateForm("confirmTransactionPin", v)
                            }
                            show={showConfirmPin}
                            onToggleShow={() =>
                                setShowConfirmPin((p) => !p)
                            }
                        />

                        {pinError && (
                            <Text className="text-red-500 text-sm">
                                {pinError}
                            </Text>
                        )}
                    </View>

                    <Button
                        input="Verify"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                        disabled={isLoading || !resolvedAccountName}
                    />
                </KeyboardAvoidingWrapper>
            </FormWrapper>
        </ScreenWrapper>
    );
}
