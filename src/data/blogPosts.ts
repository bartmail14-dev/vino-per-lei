export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "regio" | "wijn" | "tips";
  categoryLabel: string;
  region?: string;
  readTime: number;
  date: string;
  gradient: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "barolo-koning",
    slug: "barolo-de-koning-der-italiaanse-wijnen",
    title: "Barolo: De Koning der Italiaanse Wijnen",
    excerpt:
      "Ontdek waarom Barolo uit Piemonte al eeuwenlang de kroon draagt. Van de Nebbiolo-druif tot de kenmerkende tannines — alles over deze iconische wijn.",
    category: "wijn",
    categoryLabel: "Wijnkennis",
    region: "Piemonte",
    readTime: 5,
    date: "2025-01-15",
    gradient: "from-wine/80 to-wine-dark/90",
  },
  {
    id: "toscana-gids",
    slug: "toscana-de-ultieme-wijngids",
    title: "Toscana: De Ultieme Wijngids",
    excerpt:
      "Van Chianti Classico tot Brunello di Montalcino — een reis door de wijnheuvels van Toscane. Leer welke wijnen je moet proeven en waarom.",
    category: "regio",
    categoryLabel: "Regiogids",
    region: "Toscana",
    readTime: 7,
    date: "2025-01-08",
    gradient: "from-gold/70 to-wine/80",
  },
  {
    id: "amarone-geheim",
    slug: "het-geheim-van-amarone",
    title: "Het Geheim van Amarone",
    excerpt:
      "Hoe gedroogde druiven de meest intense wijn van de Veneto creëren. De appassimento-methode uitgelegd voor liefhebbers.",
    category: "wijn",
    categoryLabel: "Wijnkennis",
    region: "Veneto",
    readTime: 4,
    date: "2024-12-20",
    gradient: "from-wine-light/80 to-charcoal/70",
  },
  {
    id: "prosecco-vs-champagne",
    slug: "prosecco-vs-champagne-de-verschillen",
    title: "Prosecco vs. Champagne: De Verschillen",
    excerpt:
      "Twee bubbels, twee werelden. Waarom Prosecco uit Valdobbiadene een eigen karakter heeft en wanneer je welke kiest.",
    category: "tips",
    categoryLabel: "Wist je dat",
    readTime: 3,
    date: "2024-12-12",
    gradient: "from-gold/60 to-champagne/40",
  },
  {
    id: "piemonte-ontdek",
    slug: "piemonte-meer-dan-barolo",
    title: "Piemonte: Meer dan Alleen Barolo",
    excerpt:
      "Barbera, Nebbiolo, Dolcetto — de andere schatten van Piemonte. Een gids voor de veelzijdigste wijnregio van Noord-Italië.",
    category: "regio",
    categoryLabel: "Regiogids",
    region: "Piemonte",
    readTime: 6,
    date: "2024-12-05",
    gradient: "from-wine/70 to-wine-light/60",
  },
  {
    id: "food-pairing",
    slug: "italiaanse-wijn-en-spijs-combinaties",
    title: "Wijn & Spijs: De Perfecte Italiaanse Match",
    excerpt:
      "Van Amarone bij ossobuco tot Vermentino bij zeevruchten. De gouden regels van Italiaans combineren.",
    category: "tips",
    categoryLabel: "Tips & Tricks",
    readTime: 5,
    date: "2024-11-28",
    gradient: "from-coral/50 to-wine/70",
  },
];

export const featuredBlogPosts = blogPosts.slice(0, 3);
