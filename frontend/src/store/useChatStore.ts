/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

interface IChatStore {
  messages: {
    _id: any;
    senderId: any;
    receiverId: any;
    text?: string | null;
    image?: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
  users: {
    _id: any;
    email: string;
    fullName: string;
    password: string;
    profilePic?: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
  selectedUser?: {
    _id: any;
    email: string;
    fullName: string;
    password: string;
    profilePic?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: any) => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  deleteMessage: (messageId: any) => Promise<void>;
  setSelectedUser: (
    selectedUser: {
      _id: any;
      email: string;
      fullName: string;
      password: string;
      profilePic?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null,
  ) => void;
}

export const useChatStore = create<IChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error fetching users:", error);
      toast.error("Failed to load users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: any) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error fetching messages:", error);
      toast.error("Failed to load messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: FormData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage: any) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return; // only add the new message to the list if it's from the currently selected user
      set({ messages: [...get().messages, newMessage] });
    });

    // Listen for deleted messages and remove them from state
    socket.on("messageDeleted", (deletedMessageId: any) => {
      set({
        messages: get().messages.filter((m) => m._id !== deletedMessageId),
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
  },

  deleteMessage: async (messageId: any) => {
    try {
      await axiosInstance.post(`/messages/delete/${messageId}`);
      set({
        messages: get().messages.filter((message) => message._id !== messageId),
      });
      toast.success("Message deleted successfully!");
    } catch (error) {
      console.log("Error deleting message:", error);
      toast.error("Failed to delete message.");
    }
  },

  setSelectedUser: (
    selectedUser: {
      _id: any;
      email: string;
      fullName: string;
      password: string;
      profilePic?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null,
  ) => set({ selectedUser }),
}));
