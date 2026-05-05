"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface ShopConfig {
  freeShippingThreshold: number;
  shippingCost: number;
  shippingCostTemperature: number;
}

const DEFAULT_CONFIG: ShopConfig = {
  freeShippingThreshold: 0,
  shippingCost: 0,
  shippingCostTemperature: 0,
};

const ShopConfigContext = createContext<ShopConfig>(DEFAULT_CONFIG);

export function ShopConfigProvider({
  config,
  children,
}: {
  config: ShopConfig;
  children: ReactNode;
}) {
  return (
    <ShopConfigContext.Provider value={config}>
      {children}
    </ShopConfigContext.Provider>
  );
}

export function useShopConfig(): ShopConfig {
  return useContext(ShopConfigContext);
}
