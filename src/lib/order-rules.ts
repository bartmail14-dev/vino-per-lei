import type { Product } from "@/types";

function positiveInteger(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value) || value == null) return fallback;
  return Math.max(1, Math.floor(value));
}

export function getOrderMinimum(product: Product): number {
  return positiveInteger(product.orderMinimum, 1);
}

export function getOrderIncrement(product: Product): number {
  return positiveInteger(product.orderIncrement, 1);
}

export function normalizeOrderQuantity(product: Product, quantity: number): number {
  const minimum = getOrderMinimum(product);
  const increment = getOrderIncrement(product);
  const requested = positiveInteger(quantity, minimum);

  if (requested <= minimum) return minimum;
  if (increment <= 1) return requested;

  return minimum + Math.ceil((requested - minimum) / increment) * increment;
}

export function getOrderMaximum(product: Product, fallback = 99): number {
  const maximum = positiveInteger(product.stockQuantity, fallback);
  const minimum = getOrderMinimum(product);
  const increment = getOrderIncrement(product);

  if (maximum <= minimum || increment <= 1) return maximum;
  return minimum + Math.floor((maximum - minimum) / increment) * increment;
}

export function clampOrderQuantity(product: Product, quantity: number, fallbackMax = 99): number {
  const minimum = getOrderMinimum(product);
  const maximum = getOrderMaximum(product, fallbackMax);
  const normalized = normalizeOrderQuantity(product, quantity);

  return Math.max(minimum, Math.min(maximum, normalized));
}

export function getOrderUnitText(product: Product): string | undefined {
  const unitLabel = product.orderUnitLabel?.trim();
  const unitSize = positiveInteger(product.orderUnitSize, 0);

  if (unitLabel && unitSize > 1) return `${unitLabel} van ${unitSize}`;
  if (unitLabel) return unitLabel;
  return undefined;
}

export function getPriceUnitText(product: Product): string | undefined {
  const unit = product.priceUnitLabel?.trim();
  return unit ? `per ${unit}` : undefined;
}
