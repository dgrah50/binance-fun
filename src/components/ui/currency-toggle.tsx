import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export type CurrencyMode = "base" | "quote";

interface CurrencyToggleProps {
  mode: CurrencyMode;
  onModeChange: (mode: CurrencyMode) => void;
  base: string;
  quote: string;
}

export const CurrencyToggle = ({
  mode,
  onModeChange,
  base,
  quote,
}: CurrencyToggleProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {mode === "base" ? base : quote}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onModeChange("base")}>
          {base}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onModeChange("quote")}>
          {quote}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
