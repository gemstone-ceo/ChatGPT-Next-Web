import { Analytics } from "@vercel/analytics/react";
import Home from "./components/home"; // ✅ Correct import
import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

export default function Page() {
  return (
    <>
      <Home />
      {serverConfig?.isVercel && <Analytics />}
    </>
  );
}
