import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const BUCKET_SIZES = [0.01, 0.1, 1];

interface DepthBucketSelectorProps {
  value: number;
  onChange: (size: number) => void;
}

export const DepthBucketSelector = ({
  value,
  onChange,
}: DepthBucketSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {value}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {BUCKET_SIZES.map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() => onChange(size)}
            className="font-mono"
          >
            {size}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
