"use client";

require("../polyfill");

import { useEffect, useState } from "react";
import styles from "./home.module.scss";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";

import { getCSSVar, useMobileScreen } from "../utils";

import dynamic from "next/dynamic";
import { Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

import { getISOLang, getLang } from "../locales";

import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { useAppConfig } from "../store/config";
import { AuthPage } from "./auth";
import { getClientConfig } from "../config/client";
import { type ClientApi, getClientApi } from "../client/api";
import { useAccessStore } from "../store";
import clsx from "clsx";
import { initializeMcpSystem, isMcpEnabled } from "../mcp/actions";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={clsx("no-dark", styles["loading-content"])}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

// Dynamic imports
const Artifacts = dynamic(() => import("./artifacts").then(m => m.Artifacts), { loading: () => <Loading noLogo /> });
const Settings = dynamic(() => import("./settings").then(m => m.Settings), { loading: () => <Loading noLogo /> });
const Chat = dynamic(() => import("./chat").then(m => m.Chat), { loading: () => <Loading noLogo /> });
const NewChat = dynamic(() => import("./new-chat").then(m => m.NewChat), { loading: () => <Loading noLogo /> });
const MaskPage = dynamic(() => import("./mask").then(m => m.MaskPage), { loading: () => <Loading noLogo /> });
const PluginPage = dynamic(() => import("./plugin").then(m => m.PluginPage), { loading: () => <Loading noLogo /> });
const SearchChat = dynamic(() => import("./search-chat").then(m => m.SearchChatPage), { loading: () => <Loading noLogo /> });
const Sd = dynamic(() => import("./sd").then(m => m.Sd), { loading: () => <Loading noLogo /> });
const McpMarketPage = dynamic(() => import("./mcp-market").then(m => m.McpMarketPage), { loading: () => <Loading noLogo /> });

export function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light", "dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector('meta[name="theme-color"][media*="dark"]');
    const metaDescriptionLight = document.querySelector('meta[name="theme-color"][media*="light"]');

    const themeColor = getCSSVar("--theme-color");

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

function useHtmlLang() {
  useEffect(() => {
    const lang = getISOLang();
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
  }, []);
}

function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => setHasHydrated(true), []);
  return hasHydrated;
}

function loadAsyncGoogleFont() {
  const linkEl = document.createElement("link");
  const proxyFontUrl = "/google-fonts";
  const remoteFontUrl = "https://fonts.googleapis.com";
  const googleFontUrl = getClientConfig()?.buildMode === "export" ? remoteFontUrl : proxyFontUrl;
  linkEl.rel = "stylesheet";
  linkEl.href = `${googleFontUrl}/css2?family=${encodeURIComponent("Noto Sans:wght@300;400;700;900")}&display=swap`;
  document.head.appendChild(linkEl);
}

export function WindowContent(props: { children: React.ReactNode }) {
  return (
    <div className={styles["window-content"]} id={SlotID.AppBody}>
      {props.children}
    </div>
  );
}

function Screen() {
  const config = useAppConfig();
  const location = useLocation();
  const isArtifact = location.pathname.includes(Path.Artifacts);
  const isHome = location.pathname === Path.Home;
  const isAuth = location.pathname === Path.Auth;
  const isSd = location.pathname === Path.Sd;
  const isSdNew = location.pathname === Path.SdNew;
  const isMobileScreen = useMobileScreen();
  const shouldTightBorder = getClientConfig()?.isApp || (config.tightBorder && !isMobileScreen);

  useEffect(() => {
    loadAsyncGoogleFont();
  }, []);

  if (isArtifact) {
    return (
      <Routes>
        <Route path="/artifacts/:id" element={<Artifacts />} />
      </Routes>
    );
  }

  const renderContent = () => {
    if (isAuth) return <AuthPage />;
    if (isSd || isSdNew) return <Sd />;
    return (
      <>
        <SideBar className={clsx({ [styles["sidebar-show"]]: isHome })} />
        <WindowContent>
          <Routes>
            <Route path={Path.Home} element={<HomeContent />} />
            <Route path={Path.NewChat} element={<NewChat />} />
            <Route path={Path.Masks} element={<MaskPage />} />
            <Route path={Path.Plugins} element={<PluginPage />} />
            <Route path={Path.SearchChat} element={<SearchChat />} />
            <Route path={Path.Chat} element={<Chat />} />
            <Route path={Path.Settings} element={<Settings />} />
            <Route path={Path.McpMarket} element={<McpMarketPage />} />
          </Routes>
        </WindowContent>
      </>
    );
  };

  return (
    <div className={clsx(styles.container, {
      [styles["tight-container"]]: shouldTightBorder,
      [styles["rtl-screen"]]: getLang() === "ar",
    })}>
      {renderContent()}
    </div>
  );
}

export function useLoadData() {
  const config = useAppConfig();
  const api: ClientApi = getClientApi(config.modelConfig.providerName);
  useEffect(() => {
    (async () => {
      const models = await api.llm.models();
      config.mergeModels(models);
    })();
  }, []);
}

export function HomeContent() {
  return (
    <main className="home-container">
      <h1 className="text-3xl font-bold mb-2">AI Workforce Assistant</h1>
      <p className="text-lg text-gray-600 mb-6">
        Your nonprofit’s AI-powered resource for workforce training and digital skills.
      </p>
    </main>
  );
}

export default function AppWrapper() {
  useEffect(() => {
    initializeMcpSystem();
  }, []);

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  );
}
