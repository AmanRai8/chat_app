import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useStreamChat } from "../hooks/useStreamChat";
import PageLoader from "../components/PageLoader";

import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";

import "../styles/stream-chat-theme.css";
import { HashIcon, PlusIcon, UsersIcon, ArrowLeftIcon } from "lucide-react";
import CreateChannelModal from "../components/CreateChannelModel";

import CustomChannelHeader from "../components/CustomChannelHeader";
import CustomChannelPreview from "../components/CustomChannelPreview";
import UsersList from "../components/UserList";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  const { chatClient, error, isLoading } = useStreamChat();

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // set active channel from URL params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel");
      if (channelId) {
        const channel = chatClient.channel("messaging", channelId);
        setActiveChannel(channel);
      } else {
        setActiveChannel(null);
      }
    }
  }, [chatClient, searchParams]);

  const handleChannelSelect = (channel) => {
    setSearchParams({ channel: channel.id });
    setActiveChannel(channel);
  };

  const handleBackToChannels = () => {
    setSearchParams({});
    setActiveChannel(null);
  };

  if (error) return <p>Something went wrong...</p>;
  if (isLoading || !chatClient) return <PageLoader />;

  // Mobile view logic
  const showChannelList = !isMobile || (isMobile && !activeChannel);
  const showChatArea = !isMobile || (isMobile && activeChannel);

  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <div className="chat-container flex h-screen">
          {/* LEFT SIDEBAR - Channel List */}
          {showChannelList && (
            <div
              className={`str-chat__channel-list border-r border-gray-200 ${
                isMobile ? "w-full" : "w-1/4"
              }`}
            >
              <div className="team-channel-list h-full flex flex-col">
                {/* HEADER */}
                <div className="team-channel-list__header gap-4 p-3 flex items-center justify-between border-b border-gray-200">
                  <div className="brand-container flex items-center gap-2">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="brand-logo w-8 h-8"
                    />
                    <span className="brand-name font-bold text-lg text-indigo-600">
                      Slap
                    </span>
                  </div>
                  <div className="user-button-wrapper">
                    <UserButton />
                  </div>
                </div>

                {/* CHANNELS LIST */}
                <div className="team-channel-list__content flex-1 overflow-y-auto">
                  <div className="create-channel-section p-3">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="create-channel-btn flex items-center gap-2 text-sm bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition w-full justify-center"
                    >
                      <PlusIcon className="size-4" />
                      <span>Create Channel</span>
                    </button>
                  </div>
                  <ChannelList
                    filters={{ members: { $in: [chatClient?.user?.id] } }}
                    options={{ state: true, watch: true }}
                    Preview={({ channel }) => (
                      <CustomChannelPreview
                        channel={channel}
                        activeChannel={activeChannel}
                        setActiveChannel={handleChannelSelect}
                      />
                    )}
                    List={({ children, loading, error }) => (
                      <div className="channel-sections">
                        <div className="section-header px-3 py-2 flex items-center gap-2 text-white font-semibold">
                          <HashIcon className="size-4" />
                          <span>Channels</span>
                        </div>
                        {loading && (
                          <div className="loading-message px-3 text-sm text-gray-400">
                            Loading channels...
                          </div>
                        )}
                        {error && (
                          <div className="error-message px-3 text-sm text-red-500">
                            Error loading channels
                          </div>
                        )}
                        <div className="channels-list">{children}</div>
                        <div className="section-header direct-messages px-3 py-2 flex items-center gap-2 text-white font-semibold mt-3">
                          <UsersIcon className="size-4" />
                          <span>Direct Messages</span>
                        </div>
                        <UsersList activeChannel={activeChannel} />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* RIGHT CONTAINER - Chat Area */}
          {showChatArea && (
            <div
              className={`chat-main flex-1 flex flex-col  ${
                isMobile ? "w-full" : "flex-1"
              }`}
            >
              {activeChannel ? (
                <Channel channel={activeChannel}>
                  <Window>
                    {/* Mobile back button */}
                    {isMobile && (
                      <button
                        className="mobile-back-btn p-3 text-sm w-full text-left flex items-center gap-2 border-b border-gray-200"
                        onClick={handleBackToChannels}
                      >
                        <ArrowLeftIcon className="size-4" />
                        <span>Back to channels</span>
                      </button>
                    )}
                    <CustomChannelHeader />
                    <MessageList />
                    <MessageInput />
                  </Window>
                  <Thread />
                </Channel>
              ) : (
                // Welcome screen - only show on desktop when no channel selected
                !isMobile && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <img
                      src="/logo.png"
                      alt="Chat Illustration"
                      className="w-40 mb-4 opacity-80"
                    />
                    <h2 className="text-2xl font-bold text-indigo-600">
                      Welcome to Slap 🎉
                    </h2>
                    <p className="text-gray-500 mt-2 max-w-sm">
                      Select a channel from the sidebar or start a new
                      conversation to begin chatting.
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
        {isCreateModalOpen && (
          <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </Chat>
    </div>
  );
};

export default HomePage;
