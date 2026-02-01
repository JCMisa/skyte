/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface IAuthStore {
  authUser: {
    _id: any;
    fullName: string;
    email: string;
    password: string;
    profilePic?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  isSigningUp: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signin: (data: { email: string; password: string }) => Promise<void>;
  signout: () => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isSigningOut: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Auth check failed:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
    } catch (error) {
      console.log("Signup failed:", error);
      toast.error("Signup failed!");
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data) => {
    set({ isSigningIn: true });

    try {
      const res = await axiosInstance.post("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Signed in successfully!");
    } catch (error) {
      console.log("Signin failed:", error);
      toast.error("Signin failed!");
    } finally {
      set({ isSigningIn: false });
    }
  },

  signout: async () => {
    set({ isSigningOut: true });
    try {
      await axiosInstance.post("/auth/signout");
      set({ authUser: null });
      toast.success("Signed out successfully!");
    } catch (error) {
      console.log("Sign out failed:", error);
      toast.error("Sign out failed!");
    } finally {
      set({ isSigningOut: false });
    }
  },

  updateProfile: async (formData: FormData) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", formData);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Update Profile failed:", error);
      toast.error("Update Profile failed!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
