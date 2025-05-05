"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Eye, EyeOff, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    setLoading(true);
    if (!file) {
      toast.error("Please Select an Image!");
      setLoading(false);
      return;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Only JPEG/PNG allowed!");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mern-chat-app"); // your unsigned upload preset
    data.append("cloud_name", "dio9its82"); // your cloud name

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dio9its82/image/upload",
        data
      );

      const imageUrl = res.data.url;
      setProfileImage(imageUrl);
      setSignUpFormData({
        ...signUpFormData,
        profileImage: imageUrl,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error uploading image");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (
      !signUpFormData.name ||
      !signUpFormData.email ||
      !signUpFormData.password ||
      !signUpFormData.confirmPassword
    ) {
      toast.error("Please Fill all the Fields");
      setLoading(false);
      return;
    }

    if (signUpFormData.password !== signUpFormData.confirmPassword) {
      toast.error("Passwords Do Not Match");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        {
          name: signUpFormData.name,
          email: signUpFormData.email,
          password: signUpFormData.password,
          pic: signUpFormData.profileImage,
        },
        config
      );

      toast.success("Registration Successful");

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to register user");
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-medium text-white">
          Create an Account
        </CardTitle>
        <CardDescription className="text-gray-400">
          Fill in your details to create a new account
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
          // Add your signup logic here
        }}
      >
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              onChange={(e) => {
                setSignUpFormData({
                  ...signUpFormData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-gray-300">
              Email Address
            </Label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              onChange={(e) => {
                setSignUpFormData({
                  ...signUpFormData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Input
                id="signup-password"
                name="password"
                type={showSignupPassword ? "text" : "password"}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                onChange={(e) => {
                  setSignUpFormData({
                    ...signUpFormData,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                aria-label={
                  showSignupPassword ? "Hide password" : "Show password"
                }
              >
                {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-gray-300">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                onChange={(e) => {
                  setSignUpFormData({
                    ...signUpFormData,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-gray-700">
                <AvatarImage
                  src={profileImage || ""}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-700 text-gray-300">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label
                  htmlFor="picture-upload"
                  className="flex items-center gap-2 cursor-pointer p-2 border border-gray-600 rounded-md hover:bg-gray-700 text-gray-300"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Picture</span>
                </Label>
                <Input
                  id="picture-upload"
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "" : "Sign Up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUp;
