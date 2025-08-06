import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPageNumbers } from "@/lib/admin/missions/missionTableUtils";

interface UserDataPaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface UserDataPaginationProps {
  pagination: UserDataPaginationState;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserDataPagination: React.FC<UserDataPaginationProps> = ({
  pagination,
  totalPages,
  onPageChange,
}) => {
  const { page: currentPage, total } = pagination;

  // แสดง pagination เฉพาะเมื่อมีมากกว่า 1 หน้า
  if (total === 0 || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 p-4 border-t border-border">
      {/* First Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {getPageNumbers(currentPage, totalPages).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className="h-8 w-8 p-0"
        >
          {page}
        </Button>
      ))}

      {/* Next Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserDataPagination;