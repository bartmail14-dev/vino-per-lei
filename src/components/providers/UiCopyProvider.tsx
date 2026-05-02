"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { formatUiCopy, type UiCopyMap } from "@/lib/ui-copy";

type Translate = (
  key: string,
  variables?: Record<string, string | number | boolean | null | undefined>
) => string;

const UiCopyContext = createContext<UiCopyMap>({});

export function UiCopyProvider({
  copy,
  children,
}: {
  copy: UiCopyMap;
  children: ReactNode;
}) {
  return <UiCopyContext.Provider value={copy}>{children}</UiCopyContext.Provider>;
}

export function useUiCopy(): Translate {
  const copy = useContext(UiCopyContext);

  return useCallback<Translate>(
    (key, variables) => formatUiCopy(copy, key, variables),
    [copy]
  );
}

export function useUiCopyValue(
  key: string,
  variables?: Record<string, string | number | boolean | null | undefined>
): string {
  const translate = useUiCopy();
  return translate(key, variables);
}
