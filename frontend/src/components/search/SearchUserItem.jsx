import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SearchUserItem = ({ user, handleClick }) => {
  return (
    <div
      className="p-2 hover:bg-gray-600 cursor-pointer flex items-center text-white"
      onClick={handleClick}
    >
      <Avatar className="h-12 w-12 mr-2">
        <AvatarImage src={user.pic || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-gray-300">{user.email}</div>
      </div>
    </div>
  );
};

export default SearchUserItem;
