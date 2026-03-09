"use client";

import Script from "next/script";

const CANNY_APP_ID = "69aec1cdeeb67ab6278f2eee";

export interface CannyUser {
  id: string;
  email: string;
  name: string;
  created?: string; // ISO 8601
  hash?: string;    // HMAC-SHA256 of user.id — required when Secure Identify is enabled
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Canny?: (action: string, options?: any, callback?: () => void) => string | undefined;
  }
}

export default function CannyIdentify({ user }: { user: CannyUser }) {
  function identify() {
    if (typeof window === "undefined" || !window.Canny) return;

    window.Canny("identify", {
      appID: CANNY_APP_ID,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        ...(user.created ? { created: user.created } : {}),
      },
      ...(user.hash ? { hash: user.hash } : {}),
    });
  }

  return (
    <Script
      src="https://sdk.canny.io/sdk.js"
      id="canny-jssdk"
      strategy="afterInteractive"
      onLoad={identify}
    />
  );
}
