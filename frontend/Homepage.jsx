import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User } from "lucide-react"

export default function Homepage() {
  const [activeTab, setActiveTab] = useState("login")
  const [profileImage, setProfileImage] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGuestLogin = () => {
    // Implement guest login logic here
    console.log("Logging in as guest")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full">Login</Button>
                <Button variant="outline" className="w-full" onClick={handleGuestLogin}>
                  Continue as Guest
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Fill in your details to create a new account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input id="signup-email" type="email" placeholder="your.email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
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
                        className="flex items-center gap-2 cursor-pointer p-2 border rounded-md hover:bg-gray-50">
                        <Upload className="h-4 w-4" />
                        <span>Upload Picture</span>
                      </Label>
                      <Input
                        id="picture-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Sign Up</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
