import { StreamChat } from "stream-chat";
import { ENV } from "../config/env.js";

const streamClient = StreamChat.getInstance(
  ENV.STREAM_API_KEY,
  ENV.STREAM_API_SECRET
);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    console.log("stream user upserted successfully:", userData.name);
    return userData;
  } catch (error) {
    console.log("Error upserting Stream user: ", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await streamClient.deleteUser(userId);
    console.log("user deleted successfully:", userId);
  } catch (error) {
    console.log("error deleting Stream user: ", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdString = userId.toString();
    return streamClient.createToken(userIdString);
  } catch (error) {
    console.log("Error generating Stream token:", error);
    return null;
  }
};

export const addUserToPublicChannels = async (newUserId) => {
  const publicChannels = await streamClient.queryChannels({
    discoverable: true,
  });
  for (const channels of publicChannels) {
    await channels.addMembers([newUserId]);
  }
};
