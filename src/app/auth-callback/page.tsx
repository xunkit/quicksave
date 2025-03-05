"use client";

import React from "react";

export default function AuthCallback() {
  const [message, setMessage] = React.useState<string>(
    "Processing authentication..."
  );

  React.useEffect(() => {
    const sendSessionToExtension = async () => {
      try {
        const response = await fetch("/api/auth/get-session", {
          credentials: "include",
        });

        if (response.ok) {
          const session = await response.json();

          // Send session to the extension
          chrome.runtime.sendMessage("pgjfpcpipbjodinoflgioknniofecmcp", {
            action: "SET_SESSION",
            session,
          });

          // Close tab after sending data
          setMessage("Success! You can now close this page.");
        }
      } catch (error) {
        console.error("Error sending session to extension:", error);
        setMessage("Something went wrong.");
      }
    };

    sendSessionToExtension();
  }, []);

  return (
    <div className="flex items-center justify-center w-[100%] h-[100svh]">
      <p>{message}</p>
    </div>
  );
}
