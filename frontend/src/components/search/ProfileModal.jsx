import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { ChatState } from "@/Context/ChatProvider";
import { Button } from "../ui/button";

const ProfileModal = ({
  showProfileModal,
  setShowProfileModal,
  logOutHandler,
}) => {
  const { user } = ChatState();
  return (
    <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">My Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Your personal information
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="flex flex-col items-center py-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.pic || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
          <p className="text-gray-400">{user.email}</p>
        </div>

        <div className="flex justify-end mt-4">
          <Button className="bg-purple-600 hover:bg-purple-700 mr-2">
            Edit Profile
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={logOutHandler}
          >
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
