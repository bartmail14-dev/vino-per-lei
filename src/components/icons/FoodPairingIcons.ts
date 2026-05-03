import {
  Avocado,
  Bird,
  BowlSteam,
  Bread,
  Cake,
  Carrot,
  Cheese,
  CookingPot,
  Cow,
  Fish,
  ForkKnife,
  Grains,
  Hamburger,
  Leaf,
  Pizza,
  Shrimp,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";

export type FoodPairingIcon = ComponentType<IconProps>;

type PairingIconRule = {
  icon: FoodPairingIcon;
  keywords: string[];
};

const PAIRING_ICON_RULES: PairingIconRule[] = [
  {
    icon: Fish,
    keywords: ["vis", "witvis", "zalm", "tonijn", "kabeljauw", "zeebaars", "forel", "ansjovis", "sardine"],
  },
  {
    icon: Shrimp,
    keywords: ["schaaldier", "schelpdier", "garnalen", "garnaal", "scampi", "oester", "mossel", "vongole", "kreeft"],
  },
  {
    icon: Bird,
    keywords: ["witvlees", "wit vlees", "kip", "gevogelte", "kalkoen", "parelhoen", "hoen"],
  },
  {
    icon: Cow,
    keywords: ["roodvlees", "rood vlees", "rund", "biefstuk", "steak", "entrecote", "ossenhaas", "wild", "stoofvlees"],
  },
  {
    icon: Hamburger,
    keywords: ["burger", "barbecue", "bbq", "grill", "gegrild vlees", "vlees"],
  },
  {
    icon: BowlSteam,
    keywords: ["pasta", "romige pasta", "risotto", "gnocchi", "lasagne", "ragout", "ragu", "roomsaus"],
  },
  {
    icon: Pizza,
    keywords: ["pizza", "tomaat", "tomatensaus", "bruschetta", "antipasti"],
  },
  {
    icon: Cheese,
    keywords: ["kaas", "kazen", "parmezaan", "pecorino", "gorgonzola", "burrata", "mozzarella"],
  },
  {
    icon: Carrot,
    keywords: ["groente", "groenten", "asperge", "asperges", "wortel", "pompoen", "vegetarisch"],
  },
  {
    icon: Leaf,
    keywords: ["salade", "bladgroente", "groene kruiden", "kruiden", "pesto", "caprese"],
  },
  {
    icon: Avocado,
    keywords: ["avocado", "tartaar", "ceviche"],
  },
  {
    icon: Bread,
    keywords: ["brood", "focaccia", "crostini", "toast", "bruschette"],
  },
  {
    icon: Grains,
    keywords: ["rijst", "polenta", "granen", "couscous"],
  },
  {
    icon: CookingPot,
    keywords: ["stoof", "stoofpot", "soep", "bouillon", "ovenschotel"],
  },
  {
    icon: Cake,
    keywords: ["dessert", "zoet", "taart", "chocolade", "tiramisu", "gebak", "fruitdessert"],
  },
];

function normalizePairingName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getIconForFoodPairing(name: string): FoodPairingIcon {
  const normalizedName = normalizePairingName(name);
  const matchingRule = PAIRING_ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalizedName.includes(normalizePairingName(keyword)))
  );

  return matchingRule?.icon ?? ForkKnife;
}
