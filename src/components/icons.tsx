// Centralized icon library for Vino per Lei
// Uses Lucide React for consistent, professional icons
// Brand icons (social media) remain custom since Lucide doesn't include them
// Wine-specific icons remain custom for unique visual identity

import { Heart, Star } from "lucide-react";

// ─── Lucide Re-exports ───────────────────────────────
export {
  Menu as MenuIcon,
  X as CloseIcon,
  Search as SearchIcon,
  User as UserIcon,
  ShoppingBag as CartIcon,
  ShoppingBag as ShoppingBagIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronUp as ChevronUpIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  ShieldCheck as ShieldIcon,
  Truck as TruckIcon,
  RotateCcw as ReturnIcon,
  RotateCcw as RefreshIcon,
  SlidersHorizontal as FilterIcon,
  Award as AwardIcon,
  Clock as ClockIcon,
  ArrowRight as ArrowRightIcon,
  ArrowLeft as ArrowLeftIcon,
  ThumbsUp as ThumbUpIcon,
  Pen as PenIcon,
  MapPin as MapPinIcon,
  Tag as TagIcon,
  Trash2 as TrashIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Thermometer as ThermometerIcon,
  Package as PackageIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  BookOpen as BookOpenIcon,
  Gift as GiftIcon,
  Calendar as CalendarIcon,
  CreditCard as CreditCardIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Printer as PrintIcon,
  Link as LinkIcon,
  Copy as CopyIcon,
  Share2 as ShareIcon,
  ExternalLink as ExternalLinkIcon,
  ArrowUpDown as SortIcon,
  LayoutGrid as GridIcon,
  List as ListIcon,
  AlertCircle as AlertIcon,
  Info as InfoIcon,
  AlertTriangle as WarningIcon,
  Wine as WineIcon,
  Grape as GrapeIcon,
  Loader2 as LoaderIcon,
} from "lucide-react";

// ─── HeartIcon (wrapper with `filled` prop support) ──
export function HeartIcon({ className, filled, "aria-hidden": ariaHidden }: { className?: string; filled?: boolean; "aria-hidden"?: boolean | "true" | "false" }) {
  return <Heart className={className} fill={filled ? "currentColor" : "none"} strokeWidth={1.5} aria-hidden={ariaHidden} />;
}

// ─── StarIcon (filled by default for ratings) ────────
export function StarIcon({ className }: { className?: string }) {
  return <Star className={className} fill="currentColor" strokeWidth={0} />;
}

// ─── Loading Spinner (animated) ──────────────────────
// Kept as custom because of the specific animate-spin + opacity pattern
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className || "h-4 w-4"}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ─── Wine Bottle Icon (custom, not in Lucide) ────────
export function WineBottleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 2h4v4l2 3v11a2 2 0 01-2 2h-4a2 2 0 01-2-2V9l2-3V2z" />
      <path d="M10 13h4" strokeLinecap="round" />
    </svg>
  );
}
