"use client";

import { usePriceStore } from "@/store/priceStore";
import { useMarketStore } from "@/store/marketStore";
import { getMarketParts } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const { selectedMarket } = useMarketStore();
  const { latestPrice } = usePriceStore();
  const { base } = getMarketParts(selectedMarket);

  return (
    <header className="border-b border-border/10 backdrop-blur-xl bg-background/80 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold">Mini Trade App</h1>
          <div className="text-lg">
            <span className="font-medium">{base}</span>
            {latestPrice && (
              <span className="ml-2 text-muted-foreground">
                ${parseFloat(latestPrice).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
