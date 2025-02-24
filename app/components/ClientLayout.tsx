"use client";

import { ConfigProvider, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Add event listener for window closing
    const handleBeforeUnload = () => {
      localStorage.clear(); // Clear all local storage
      // OR: localStorage.removeItem("token"); // Clear only the token
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#22426b",
          borderRadius: 8,
          colorText: "#fff",
          fontSize: 16,
          colorBgContainer: "#16181D",
        },
        components: {
          Button: {
            colorPrimary: "#75bd9d",
            algorithm: true,
            controlHeight: 38,
          },
          Input: {
            colorBorder: "gray",
            colorTextPlaceholder: "#888888",
            algorithm: false,
          },
          Form: {
            labelColor: "#fff",
            algorithm: theme.defaultAlgorithm,
          },
          Card: {},
        },
      }}
    >
      <AntdRegistry>{children}</AntdRegistry>
    </ConfigProvider>
  );
}