import { Suspense } from "react";
import Header from "@/components/shared/Header";
import MarketSelector from "@/components/shared/MarketSelector";
import OrderBook from "@/components/orderbook/OrderBook";
import TradeFeed from "@/components/tradefeed/TradeFeed";

export const metadata = {
  title: "Mini Trade App",
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto">
          <div>
            <MarketSelector />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Suspense fallback={<div>Loading order book...</div>}>
                <OrderBook />
              </Suspense>
              <Suspense fallback={<div>Loading trades...</div>}>
                <TradeFeed />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
