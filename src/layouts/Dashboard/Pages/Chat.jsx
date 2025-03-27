import { Box } from "@mui/material";
import { useEffect } from "react";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
// import { EmojiPicker } from "stream-chat-react/emojis";
import "stream-chat-react/dist/css/v2/index.css";



// import { init, SearchIndex } from "emoji-mart";
// import data from "@emoji-mart/data";


const apiKey = "7mysjzzq32k2";
const userId = "admin";
const userName = "Admin";
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.gejCHiYZLlIA1BgXMGMY2Dvvm_8qN3y-4bv24VQoyls";

const user = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?name=${userName}`,
};

const sort = { last_message_at: -1 };
const filters = {
  type: "messaging",
  members: { $in: [userId] },
};
const options = {
  limit: 10,
};

// init({ data });

const ChatPage = () => {
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <Box sx={{display:'flex'}}>
    <Chat client={client} theme="str-chat__theme-custom">
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel  >
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
    </Box>
  );
};

export default ChatPage;