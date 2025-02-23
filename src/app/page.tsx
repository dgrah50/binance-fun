import { Suspense } from "react";
import Header from "@/components/Header";
import MarketSelector from "@/components/MarketSelector";
import OrderBook from "@/components/OrderBook";
import TradeFeed from "@/components/TradeFeed";

export const metadata = {
  title: "Mini Trade App",
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-screen-xl mx-auto">
            <div className="rounded-lg p-6 mb-8 backdrop-blur-xl bg-background/80">
              <h2 className="text-2xl font-semibold mb-6">Market Overview</h2>
              <MarketSelector />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
