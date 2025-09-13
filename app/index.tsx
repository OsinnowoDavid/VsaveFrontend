import { Redirect } from "expo-router";
import "../src/global.css";

export default function Index() {
  return <Redirect href={"/login"} />;
}
