"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import {
  Package,
  MapPin,
  User,
  LogOut,
  Loader2,
  Wine,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { ShopifyOrder, ShopifyAddress } from "@/lib/shopify-customer";
import { useUiCopy } from "@/components/providers";

type Tab = "orders" | "addresses" | "profile";

interface CustomerData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  defaultAddress: ShopifyAddress | null;
  addresses: ShopifyAddress[];
  orders: ShopifyOrder[];
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function formatPrice(amount: string, currency: string): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency,
  }).format(parseFloat(amount));
}

const STATUS_KEYS: Record<string, { key: string; color: string }> = {
  PAID: { key: "account.status_paid", color: "bg-green-100 text-green-800" },
  PENDING: { key: "account.status_pending", color: "bg-yellow-100 text-yellow-800" },
  REFUNDED: { key: "account.status_refunded", color: "bg-grey-100 text-grey-800" },
  FULFILLED: { key: "account.status_fulfilled", color: "bg-green-100 text-green-800" },
  UNFULFILLED: { key: "account.status_unfulfilled", color: "bg-blue-100 text-blue-800" },
  PARTIALLY_FULFILLED: { key: "account.status_partially_fulfilled", color: "bg-yellow-100 text-yellow-800" },
};

function OrdersTab({ orders }: { orders: ShopifyOrder[] }) {
  const t = useUiCopy();

  function statusLabel(status: string): { text: string; color: string } {
    const entry = STATUS_KEYS[status];
    if (entry) return { text: t(entry.key), color: entry.color };
    return { text: status, color: "bg-gray-100 text-gray-800" };
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Wine className="w-12 h-12 text-sand mx-auto mb-4" strokeWidth={1} />
        <p className="text-grey text-sm mb-4">{t("account.no_orders")}</p>
        <Link
          href="/wijnen"
          className="inline-flex items-center gap-2 px-6 py-3 bg-wine text-white rounded-lg text-sm font-medium uppercase tracking-wide hover:bg-wine-dark transition-colors"
        >
          {t("account.browse_wines")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const financial = statusLabel(order.financialStatus);
        const fulfillment = statusLabel(order.fulfillmentStatus);

        return (
          <div
            key={order.id}
            className="border border-sand rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-charcoal">
                  {t("account.order_prefix")} #{order.orderNumber}
                </p>
                <p className="text-sm text-grey">{formatDate(order.processedAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-charcoal">
                  {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${financial.color}`}>
                    {financial.text}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${fulfillment.color}`}>
                    {fulfillment.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2 mb-3">
              {order.lineItems.edges.map(({ node: item }, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.variant?.image?.url ? (
                    <Image
                      src={item.variant.image.url}
                      alt={item.variant.image.altText ?? item.title}
                      className="w-12 h-12 object-cover rounded-lg bg-cream"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center">
                      <Wine className="w-5 h-5 text-sand" strokeWidth={1} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-charcoal truncate">{item.title}</p>
                    <p className="text-xs text-grey">
                      {item.quantity}x{" "}
                      {item.variant
                        ? formatPrice(item.variant.price.amount, item.variant.price.currencyCode)
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order.statusUrl && (
              <a
                href={order.statusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-wine hover:text-wine-dark transition-colors"
              >
                {t("account.view_status")}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AddressesTab({ addresses, defaultAddress }: { addresses: ShopifyAddress[]; defaultAddress: ShopifyAddress | null }) {
  const t = useUiCopy();

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-sand mx-auto mb-4" strokeWidth={1} />
        <p className="text-grey text-sm">{t("account.no_addresses")}</p>
        <p className="text-grey text-xs mt-2">
          {t("account.addresses_hint")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addresses.map((addr) => {
        const isDefault = defaultAddress?.id === addr.id;
        return (
          <div
            key={addr.id}
            className={`border rounded-xl p-5 ${isDefault ? "border-wine/30 bg-wine/[0.02]" : "border-sand"}`}
          >
            {isDefault && (
              <span className="text-xs font-medium text-wine uppercase tracking-wide mb-2 block">
                {t("account.default_address")}
              </span>
            )}
            <p className="text-sm text-charcoal font-medium">
              {[addr.firstName, addr.lastName].filter(Boolean).join(" ")}
            </p>
            <p className="text-sm text-grey mt-1">{addr.address1}</p>
            {addr.address2 && <p className="text-sm text-grey">{addr.address2}</p>}
            <p className="text-sm text-grey">
              {[addr.zip, addr.city].filter(Boolean).join(" ")}
            </p>
            {addr.country && <p className="text-sm text-grey">{addr.country}</p>}
          </div>
        );
      })}
    </div>
  );
}

function ProfileTab({ customer, onLogout }: { customer: CustomerData; onLogout: () => void }) {
  const t = useUiCopy();

  return (
    <div className="space-y-6">
      <div className="border border-sand rounded-xl p-5">
        <h3 className="font-medium text-charcoal mb-3">{t("account.profile_title")}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-grey">{t("account.profile_name")}</span>
            <span className="text-charcoal">
              {[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-grey">{t("account.profile_email")}</span>
            <span className="text-charcoal">{customer.email}</span>
          </div>
        </div>
      </div>

      <div className="border border-sand rounded-xl p-5">
        <h3 className="font-medium text-charcoal mb-3">{t("account.change_password_title")}</h3>
        <p className="text-sm text-grey mb-3">
          {t("account.change_password_desc")}
        </p>
        <a
          href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/account/reset`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-wine hover:text-wine-dark transition-colors"
        >
          {t("account.reset_password")}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        {t("account.logout")}
      </button>
    </div>
  );
}

const TAB_KEYS: { id: Tab; key: string; icon: typeof Package }[] = [
  { id: "orders", key: "account.tab_orders", icon: Package },
  { id: "addresses", key: "account.tab_addresses", icon: MapPin },
  { id: "profile", key: "account.tab_profile", icon: User },
];

export default function AccountPage() {
  const t = useUiCopy();
  const { user, isAuthenticated, isHydrated, logout, openLoginModal } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        setCustomerData(null);
        return;
      }
      const data = await res.json();
      setCustomerData(data.customer);
    } catch {
      setCustomerData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      openLoginModal(() => router.refresh());
      router.push("/");
      return;
    }

    fetchData();
  }, [isHydrated, isAuthenticated, fetchData, openLoginModal, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-wine" />
      </div>
    );
  }

  if (!isAuthenticated || !customerData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-grey mb-4">{t("account.login_required")}</p>
          <button
            onClick={() => openLoginModal()}
            className="px-6 py-3 bg-wine text-white rounded-lg text-sm font-medium uppercase tracking-wide hover:bg-wine-dark transition-colors"
          >
            {t("account.login_button")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal mb-2">
            {t("account.welcome")}{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-grey">{user?.email}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-sand overflow-x-auto">
          {TAB_KEYS.map(({ id, key, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === id
                  ? "border-wine text-wine"
                  : "border-transparent text-grey hover:text-charcoal"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {t(key)}
              {id === "orders" && customerData.orders.length > 0 && (
                <span className="bg-wine/10 text-wine text-xs px-1.5 py-0.5 rounded-full">
                  {customerData.orders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "orders" && <OrdersTab orders={customerData.orders} />}
          {activeTab === "addresses" && (
            <AddressesTab
              addresses={customerData.addresses}
              defaultAddress={customerData.defaultAddress}
            />
          )}
          {activeTab === "profile" && (
            <ProfileTab customer={customerData} onLogout={handleLogout} />
          )}
        </motion.div>

        {/* Quick link */}
        <div className="mt-12 border border-sand rounded-xl p-5">
          <Link
            href="/wijnen"
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Wine className="w-5 h-5 text-wine" strokeWidth={1.5} />
              <span className="text-sm font-medium text-charcoal group-hover:text-wine transition-colors">
                {t("account.browse_collection")}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-grey group-hover:text-wine transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  );
}
