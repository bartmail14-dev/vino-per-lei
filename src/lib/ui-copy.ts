export type UiCopyMap = Record<string, string>;

export function formatUiCopy(
  copy: UiCopyMap,
  key: string,
  variables?: Record<string, string | number | boolean | null | undefined>
): string {
  let value = copy[key] ?? "";

  if (!variables) return value;

  for (const [name, replacement] of Object.entries(variables)) {
    value = value.replaceAll(`{${name}}`, String(replacement ?? ""));
  }

  return value;
}
