import { Skeleton } from "../ui/skeleton";

const SearchLoading = () => {
  return (
    <div className="mt-1 w-full bg-gray-700 rounded-md shadow-lg max-h-96 overflow-auto p-4 space-y-4">
      {[...Array(2)].map((_, index) => (
        <div
          className="flex items-center space-x-4"
          key={`chat-load-skeleton-${index}`}
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchLoading;
