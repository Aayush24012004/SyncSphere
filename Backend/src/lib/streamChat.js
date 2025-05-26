import { StreamChat } from "stream-chat";
import "dotenv/config";
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const streamClient = StreamChat.getInstance(apiKey, apiSecret);
if (!apiKey || !apiSecret) {
  console.log("api key or api secret misiing");
}
export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
  } catch (error) {
    console.log("Error upserting Stream user", error);
  }
};
export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.log("Error in generateStreamToken", error);
  }
};
