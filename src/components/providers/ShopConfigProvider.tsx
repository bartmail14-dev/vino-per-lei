"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface ShopConfig {
  freeShippingThreshold: number;
  shippingCost: number;
}

const DEFAULT_CONFIG: ShopConfig = {
  freeShippingThreshold: 100,
  shippingCost: 7.95,
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
