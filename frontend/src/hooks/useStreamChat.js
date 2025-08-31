import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import * as Sentry from "@sentry/react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_KEY;

export const userStreamChat = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);

  //fetching stream token using react-query/tanstack query

  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!user?.id, //this will take the object and convert it to a boolean value
  });

  //init stream chat client
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || user) return;

      try {
        const client = StreamChat.getInstrance(STREAM_API_KEY);
        await client.connectUser({
          id: user.id,
          name: user.fullName,
          image: user.imageUrl,
        });
        setChatClient(client);
      } catch (error) {
        console.log("error connecting to stream", error);
        Sentry.captureException(error, {
          tags: { component: "useStreamChat" },
          extra: {
            context: "stream_chat_connection",
            userId: user?.id,
            streamApiKey: STREAM_API_KEY ? "present" : "missing",
          },
        });
      }
    };
    initChat();

    //cleanup
    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [tokenData, user, chatClient]);

  return { chatClient, isLoading: tokenLoading, error: tokenError };
};
