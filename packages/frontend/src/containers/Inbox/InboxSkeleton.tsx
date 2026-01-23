import Skeleton from "@/components/Common/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const InboxSkeleton = () => {
  return (
    <div className="overflow-x-auto rounded-md border w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">From</TableHead>
            <TableHead>Snippet</TableHead>
            <TableHead className="w-[180px]">Received On</TableHead>
            <TableHead className="w-[180px]">Last Synced On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 15 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-[160px]" />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full max-w-xl" />
                  <Skeleton className="h-3 w-full max-w-sm opacity-60" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[140px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[140px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InboxSkeleton;
