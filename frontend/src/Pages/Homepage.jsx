"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/login";
import SignUp from "@/components/signup";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gray-700 text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-gray-700 text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Login />
            </TabsContent>

            <TabsContent value="signup">
              <SignUp />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
