import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const messages = useChatStore((s) => s.messages);
  const getMessages = useChatStore((s) => s.getMessages);
  const isMessagesLoading = useChatStore((s) => s.isMessagesLoading);
  const selectedUser = useChatStore((s) => s.selectedUser);
  // const subscribeToMessages = useChatStore((s) => s.subscribeToMessages);
  // const unsubscribeFromMessages = useChatStore((s) => s.unsubscribeFromMessages);

  const authUser = useAuthStore((s) => s.authUser);

  useEffect(() => {
    getMessages(selectedUser?._id);
  }, [selectedUser?._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        {/* <MessageInput /> */}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <p>messages...</p>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
