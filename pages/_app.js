// node_modules
import Head from "next/head";
import Script from "next/script";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
// lib
import { BRAND_COLOR, SITE_TITLE } from "../lib/constants";
import DarkModeManager from "../lib/dark-mode-manager";
// components
import Error from "../components/error";
import GlobalContext from "../components/global-context";
import NavigationSection from "../components/navigation";
import ScrollToTop from "../components/scroll-to-top";
import ViewportOverlay from "../components/viewport-overlay";
// CSS
import "../styles/globals.css";

function Site({ Component, pageProps }) {
  // Flag to indicate if <Link> components should cause page reload
  const [isLinkReloadEnabled, setIsLinkReloadEnabled] = useState(false);
  const isLoading = false;
  // Keep track of current dark mode settings
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Install the dark-mode event listener to react to dark-mode changes.
    const darkModeManager = new DarkModeManager(setIsDarkMode);
    darkModeManager.installDarkModeListener();
    darkModeManager.setCurrentDarkMode();

    return () => {
      darkModeManager.removeDarkModeListener();
    };
  }, []);

  console.log(pageProps);
  console.log(pageProps.breadcrumbs);

  const globalContext = useMemo(() => {
    return {
      site: {
        title: SITE_TITLE,
      },
      page: {
        title: pageProps.pageContext?.title || "",
        type: pageProps.pageContext?.type || "",
      },
      breadcrumbs: pageProps.breadcrumbs || [],
      linkReload: {
        isEnabled: isLinkReloadEnabled,
        setIsEnabled: setIsLinkReloadEnabled,
      },
      darkMode: {
        enabled: isDarkMode,
      },
    };
  }, [
    pageProps.breadcrumbs,
    pageProps.pageContext?.title,
    pageProps.pageContext?.type,
    isLinkReloadEnabled,
    isDarkMode,
  ]);

  return (
    <ViewportOverlay isEnabled={isLoading}>
      <Head>
        <title>{SITE_TITLE}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Portal for the Impact of Genomic Variation on Function consortium"
        />
        <meta name="theme-color" content={BRAND_COLOR} />
      </Head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-Q7NV8NWM99"
      ></Script>
      <Script id="google-analytics-4-script">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-Q7NV8NWM99');
        `}
      </Script>
      <div className="md:container">
        <ScrollToTop />
        <GlobalContext.Provider value={globalContext}>
          <div className="md:flex">
            <NavigationSection />
            <div className="min-w-0 shrink grow px-3 py-2 text-black dark:text-white md:px-8">
              {pageProps.serverSideError ? (
                <Error
                  statusCode={pageProps.serverSideError.code}
                  title={pageProps.serverSideError.description}
                />
              ) : (
                <Component {...pageProps} />
              )}
            </div>
          </div>
        </GlobalContext.Provider>
      </div>
    </ViewportOverlay>
  );
}

Site.propTypes = {
  // Component to render for the page, as determined by nextjs router
  Component: PropTypes.elementType.isRequired,
  // Properties associated with the page to pass to `Component`
  pageProps: PropTypes.object.isRequired,
};

export default function App(props) {
  return <Site {...props} />;
}
