"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Eye, EyeOff } from "lucide-react";

const Homepage = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  });

  const [activeTab, setActiveTab] = useState("login");
  const [profileImage, setProfileImage] = useState(null);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setSignUpFormData({
          ...signUpFormData,
          profileImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuestLogin = () => {
    // Implement guest login logic here
    console.log("Logging in as guest");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-medium">Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Login form submitted", loginFormData);
                  // Add your login logic here
                }}
              >
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      onChange={(e) => {
                        setLoginFormData({
                          ...loginFormData,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showLoginPassword ? "text" : "password"}
                        required
                        onChange={(e) => {
                          setLoginFormData({
                            ...loginFormData,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label={
                          showLoginPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showLoginPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGuestLogin}
                  >
                    Continue as Guest
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-medium">
                  Create an Account
                </CardTitle>
                <CardDescription>
                  Fill in your details to create a new account
                </CardDescription>
              </CardHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Signup form submitted", signUpFormData);
                  // Add your signup logic here
                }}
              >
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      onChange={(e) => {
                        setSignUpFormData({
                          ...signUpFormData,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      onChange={(e) => {
                        setSignUpFormData({
                          ...signUpFormData,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showSignupPassword ? "text" : "password"}
                        required
                        onChange={(e) => {
                          setSignUpFormData({
                            ...signUpFormData,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setShowSignupPassword(!showSignupPassword)
                        }
                        aria-label={
                          showSignupPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showSignupPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        onChange={(e) => {
                          setSignUpFormData({
                            ...signUpFormData,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profileImage || ""} alt="Profile" />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Label
                          htmlFor="picture-upload"
                          className="flex items-center gap-2 cursor-pointer p-2 border rounded-md hover:bg-gray-50"
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
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Homepage;
