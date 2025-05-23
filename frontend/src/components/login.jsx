"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGuestLogin, setIsGuestLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isGuestLogin) {
      handleSubmit();
      setIsGuestLogin(false); // Reset flag
    }
  }, [loginFormData]);

  const handleGuestLogin = () => {
    setLoginFormData({
      email: "guest@example.com",
      password: "password",
    });
    toast.success("Login Successful");
    setIsGuestLogin(true);
    // Implement guest login logic here
    console.log("Logging in as guest");
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!loginFormData.email || !loginFormData.password) {
      toast.error("Please fill all the fields");
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
        "/api/user/login",
        {
          email: loginFormData.email,
          password: loginFormData.password,
        },
        config
      );

      toast.success("Login Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to log in");
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-medium text-white">Login</CardTitle>
        <CardDescription className="text-gray-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              onChange={(e) => {
                setLoginFormData({
                  ...loginFormData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showLoginPassword ? "text" : "password"}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                onChange={(e) => {
                  setLoginFormData({
                    ...loginFormData,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                aria-label={
                  showLoginPassword ? "Hide password" : "Show password"
                }
              >
                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "" : "Login"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full bg-teal-600 hover:bg-teal-700"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "" : "Continue as Guest"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
