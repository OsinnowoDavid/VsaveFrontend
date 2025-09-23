import { Country, State } from "country-state-city";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";

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
  const [selectedStateList, setSelectedStateList] = useState(
    stateOptionsAndIndexing(initialCountryIsoCode)[0]
  );
  useEffect(() => {
    setSelectedStateList(stateOptionsAndIndexing(selectedCountry.value)[0]);
  }, [selectedCountry]);
  const router = useRouter();
  return (
    <ScreenWrapper>
      <FormWrapper heading="KYC">
        <FormField
          label="Profession"
          onChangeText={() => {}}
          type="select"
          value=""
          options={[
            { label: "Lottery Agent", value: "lottery-agent" },
            { label: "Student", value: "student" },
            { label: "Self Employed", value: "self-employed" },
            { label: "Unemployed", value: "unemployed" },
            { label: "Others", value: "other" },
          ]}
        />
        <FormField
          label="Account Name"
          placeholder=""
          onChangeText={() => {}}
          value=""
        />
        <FormField
          label="Account Details"
          placeholder=""
          onChangeText={() => {}}
          value=""
        />
        <FormField
          label="Country"
          onChangeText={(value) => {
            setSelectedCountry(countryOptions[countryIndexToCodeMap[value]]);
          }}
          type="select"
          value={selectedCountry.value}
          options={countryOptions}
        />
        <FormField
          label="State"
          type="select"
          placeholder=""
          options={selectedStateList as { label: string; value: string }[]}
          onChangeText={() => {}}
          value=""
        />
        <FormField
          label="NIN"
          placeholder=""
          onChangeText={() => {}}
          value=""
        />
        <Button
          onPress={() => {
            router.push("/auth/fingerprint-setup");
          }}
          input="Verify"
        />
      </FormWrapper>
    </ScreenWrapper>
  );
}
