import { Country, State } from "country-state-city";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import { getBankList, resolveBankAccount } from "../../../services/bankService";

interface Bank {
    id: number;
    code: string;
    name: string;
}

const countries = Country.getAllCountries();
const countryIndexToCodeMap = {};
const countryOptions = countries.map((Icountry, index) => {
    countryIndexToCodeMap[Icountry.isoCode] = index;
    return { label: Icountry.name, value: Icountry.isoCode };
});

function stateOptionsAndIndexing(countryIsoCode: string) {
    const stateIndexToCodeMap = {};
    const states = State.getStatesOfCountry(countryIsoCode);
    const stateOptions = states.map((Istate, index) => {
        stateIndexToCodeMap[Istate.isoCode] = index;
        return { label: Istate.name, value: Istate.isoCode };
    });
    return [stateOptions, stateIndexToCodeMap];
}

const initialCountryIsoCode = "NG";
const initialCountry =
    countryOptions[countryIndexToCodeMap[initialCountryIsoCode]];

export default function KYCScreen() {
    const [selectedCountry, setSelectedCountry] = useState(initialCountry);
    const [stateOptions, setStateOptions] = useState(
        stateOptionsAndIndexing(initialCountry.value)[0]
    );
    const [banks, setBanks] = useState<Bank[]>([]);
    const [resolvedAccountName, setResolvedAccountName] = useState<
        string | null
    >(null);
    const [isResolving, setIsResolving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        profession: "",
        accountNumber: "",
        bankCode: "",
        country: initialCountry.value,
        state: "",
        bvn: "",
        address: "",
    });

    const router = useRouter();

    // Fetch bank list on component mount
    useEffect(() => {
        const fetchBanks = async () => {
            const response = await getBankList();
            if (response.success) {
                setBanks(response.data);
            } else {
                Alert.alert("Error", "Could not load bank list.");
            }
        };
        fetchBanks();
    }, []);

    // Update state options when country changes
    useEffect(() => {
        const [newStates] = stateOptionsAndIndexing(form.country);
        setStateOptions(newStates);
        // Reset state if country changes
        if (form.country !== selectedCountry.value) {
            handleFormChange("state", "");
            setSelectedCountry(
                countryOptions[countryIndexToCodeMap[form.country]]
            );
        }
    }, [form.country]);

    // Debounce account resolution
    useEffect(() => {
        if (form.accountNumber.length === 10 && form.bankCode) {
            const handler = setTimeout(() => {
                handleResolveAccount();
            }, 1000);

            return () => clearTimeout(handler);
        } else {
            setResolvedAccountName(null);
        }
    }, [form.accountNumber, form.bankCode]);

    const handleFormChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleResolveAccount = async () => {
        setIsResolving(true);
        setResolvedAccountName(null);
        const response = await resolveBankAccount({
            accountNumber: form.accountNumber,
            bankCode: form.bankCode,
        });
        setIsResolving(false);
        if (response.success && response.data.account_name) {
            setResolvedAccountName(response.data.account_name);
        } else {
            Alert.alert("Verification Failed", response.message);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        console.log("Submitting KYC Data:", { ...form, resolvedAccountName });
        // TODO: Call backend API with form data
        // const response = await submitKYCStage1(form);
        setIsLoading(false);
        router.push("/auth/fingerprint-setup");
    };

    return (
        <ScreenWrapper>
            <FormWrapper heading="KYC">
                <FormField
                    label="Profession"
                    onChangeText={(value) =>
                        handleFormChange("profession", value)
                    }
                    type="select"
                    value={form.profession}
                    options={[
                        { label: "Lottery Agent", value: "lottery-agent" },
                        { label: "Student", value: "student" },
                        { label: "Self Employed", value: "self-employed" },
                        { label: "Unemployed", value: "unemployed" },
                        { label: "Others", value: "other" },
                    ]}
                />
                <FormField
                    label="Bank"
                    type="select"
                    value={form.bankCode}
                    onChangeText={(value) =>
                        handleFormChange("bankCode", value)
                    }
                    options={banks.map((b) => ({
                        label: b.name,
                        value: b.code,
                    }))}
                />
                <FormField
                    label="Account Number"
                    placeholder="0123456789"
                    onChangeText={(value) =>
                        handleFormChange("accountNumber", value)
                    }
                    value={form.accountNumber}
                    keyboardType="number-pad"
                    maxLength={10}
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
                    onChangeText={(value) => handleFormChange("country", value)}
                    type="select"
                    value={form.country}
                    options={countryOptions}
                />
                <FormField
                    label="State"
                    type="select"
                    placeholder=""
                    options={stateOptions as { label: string; value: string }[]}
                    onChangeText={(value) => handleFormChange("state", value)}
                    value={form.state}
                />
                <FormField
                    label="Address"
                    placeholder="123 Techie Lane, Ikeja"
                    onChangeText={(value) => handleFormChange("address", value)}
                    value={form.address}
                />
                <FormField
                    label="BVN"
                    placeholder="11-digit Bank Verification Number"
                    onChangeText={(value) => handleFormChange("bvn", value)}
                    value={form.bvn}
                    keyboardType="number-pad"
                    maxLength={11}
                />
                <Button
                    onPress={handleSubmit}
                    input="Verify"
                    isLoading={isLoading}
                    disabled={!resolvedAccountName || isLoading}
                />
            </FormWrapper>
        </ScreenWrapper>
    );
}
