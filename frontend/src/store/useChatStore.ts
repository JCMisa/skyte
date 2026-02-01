/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

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

export const useChatStore = create<IChatStore>((set) => ({
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

  // todo: optomize later
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
