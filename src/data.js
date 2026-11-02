// Matcha dataset + pure helpers (no UI).

export const SAN_SENKE_SCHOOLS = ["Omotesenke", "Urasenke", "Mushakojisenke"];
export const SCHOOL_FILTERS = ["All", "San-Senke Favored", ...SAN_SENKE_SCHOOLS];
export const SCHOOL_CHIP_STYLES = {
  Omotesenke: { background: "#d8cab0", color: "#49381e" },
  Urasenke: { background: "#c7d8c1", color: "#24402a" },
  Mushakojisenke: { background: "#ced4e8", color: "#273552" },
};
export const PRODUCER_META = {
  "Yamamasa Koyamaen": {
    short: "山政 Yamamasa",
    compact: "Yamamasa",
    full: "山政 Yamamasa Koyamaen",
    chipBg: "#2d4a2d",
    chipColor: "#f5eed8",
  },
  "Marukyu Koyamaen": {
    short: "丸久 Marukyu",
    compact: "Marukyu",
    full: "丸久 Marukyu Koyamaen",
    chipBg: "#4a2d2d",
    chipColor: "#f5eed8",
  },
  "Ippodo Tea": {
    short: "一保堂 Ippodo",
    compact: "Ippodo",
    full: "一保堂 Ippodo Tea",
    chipBg: "#2f4058",
    chipColor: "#f5eed8",
  },
};
export const SCHOOL_FAVORITES = {
  "Shoka no Mukashi": { favoredSchool: "Urasenke", favoredBy: "Zabosai iemoto", favoredBranch: "Konnichian" },
  "Keichi no Mukashi": { favoredSchool: "Urasenke", favoredBy: "Hounsai sosho", favoredBranch: "Konnichian" },
  Kiun: { favoredSchool: "Urasenke", favoredBy: "Hounsai sosho", favoredBranch: "Konnichian" },
  "Shoun no Mukashi": { favoredSchool: "Urasenke", favoredBy: "Hounsai sosho", favoredBranch: "Konnichian" },
  "Tama no Shiro": { favoredSchool: "Urasenke", favoredBy: "Hounsai sosho", favoredBranch: "Konnichian" },
  Shohaku: { favoredSchool: "Urasenke", favoredBy: "Hounsai sosho", favoredBranch: "Konnichian" },
  "Myofu no Mukashi": { favoredSchool: "Omotesenke", favoredBy: "Jimyosai sosho", favoredBranch: "Fushin'an" },
  "Sanyu no Shiro": { favoredSchool: "Omotesenke", favoredBy: "Jimyosai sosho", favoredBranch: "Fushin'an" },
  "Suisho no Mukashi": { favoredSchool: "Mushakojisenke", favoredBy: "Futetsusai iemoto", favoredBranch: "Kankyuan" },
};

export function hyphenateTeaName(name = "") {
  return name.replace(/\s+/g, "-");
}

export function inferSchoolSub(name = "") {
  if (name.includes("no Mukashi")) return "Koicha";
  if (name.includes("no Shiro")) return "Usucha";
  return "Matcha";
}

export function buildSchoolLabel({ favoredSchool, favoredBy, favoredBranch }) {
  return [favoredSchool, favoredBy, favoredBranch].filter(Boolean).join(" · ");
}

export function createSchoolFavoredTea({
  id,
  name,
  kanji,
  producer,
  favoredSchool,
  favoredBy,
  favoredBranch,
  sub,
  grade,
  price,
  sizes,
  status = "limited",
  rating,
  notes,
  tags,
  desc,
  src,
  aliases = [],
}) {
  return {
    id,
    name,
    kanji,
    aliases: [...new Set([hyphenateTeaName(name), ...aliases])],
    producer,
    category: "Tea School",
    sub: sub ?? inferSchoolSub(name),
    school: buildSchoolLabel({ favoredSchool, favoredBy, favoredBranch }),
    favoredSchool,
    favoredBy,
    favoredBranch,
    sanSenkeFavored: SAN_SENKE_SCHOOLS.includes(favoredSchool),
    grade: grade ?? inferSchoolSub(name),
    price,
    sizes,
    status,
    rating,
    notes,
    tags,
    desc,
    src,
  };
}

export function enrichTea(tea) {
  const favorite = tea.favoredSchool ? tea : SCHOOL_FAVORITES[tea.name];
  if (!favorite) return tea;

  const nextSchool = tea.school ?? buildSchoolLabel(favorite);
  return {
    ...tea,
    school: nextSchool,
    favoredSchool: favorite.favoredSchool,
    favoredBy: favorite.favoredBy,
    favoredBranch: favorite.favoredBranch,
    sanSenkeFavored: SAN_SENKE_SCHOOLS.includes(favorite.favoredSchool),
  };
}

export const EXTRA_SCHOOL_FAVORED_TEAS = [
  createSchoolFavoredTea({
    id: "yk20",
    name: "Suimei no Mukashi",
    kanji: "翠明の昔",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Yuyusai iemoto",
    favoredBranch: "Fushinan",
    price: "~$42/30g",
    sizes: ["30g", "100g"],
    rating: 4.5,
    notes: { umami: 4, sweet: 4, bitter: 1, astringent: 0, body: 4 },
    tags: ["refined", "calm sweetness", "koicha", "school favored"],
    desc: "Omotesenke-favored Yamamasa koicha with a polished, composed profile and steady sweetness.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk21",
    name: "Otowa no Shiro",
    kanji: "音羽の白",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Yuyusai iemoto",
    favoredBranch: "Fushinan",
    price: "~$25/30g",
    sizes: ["30g", "100g"],
    rating: 4.2,
    notes: { umami: 3, sweet: 3, bitter: 1, astringent: 1, body: 3 },
    tags: ["soft", "bright", "usucha", "school favored"],
    desc: "A lighter Omotesenke usucha counterpart with soft sweetness and a clean, lifted finish.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk22",
    name: "Hagami no Mukashi",
    kanji: "葉上の昔",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Jimyosai iemoto",
    favoredBranch: "Fushinan",
    price: "~$40/30g",
    sizes: ["30g", "100g"],
    rating: 4.4,
    notes: { umami: 4, sweet: 4, bitter: 1, astringent: 0, body: 4 },
    tags: ["smooth", "deep green", "koicha", "school favored"],
    desc: "Favored by Jimyosai, this Yamamasa koicha leans smooth, dense, and classically formal.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk23",
    name: "Toga no Shiro",
    kanji: "栂の白",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Jimyosai iemoto",
    favoredBranch: "Fushinan",
    price: "~$24/30g",
    sizes: ["30g", "100g"],
    rating: 4.1,
    notes: { umami: 3, sweet: 3, bitter: 1, astringent: 1, body: 3 },
    tags: ["balanced", "gentle", "usucha", "school favored"],
    desc: "Balanced and approachable Omotesenke usucha with a gentle, polished body.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk24",
    name: "Fukase no Mukashi",
    kanji: "深瀬の昔",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Sokuchusai sosho",
    favoredBranch: "Fushinan",
    price: "~$38/30g",
    sizes: ["30g", "100g"],
    rating: 4.3,
    notes: { umami: 4, sweet: 3, bitter: 1, astringent: 1, body: 4 },
    tags: ["rich", "layered", "koicha", "school favored"],
    desc: "A deeper, more structured Omotesenke koicha with layered umami and a grounded finish.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk25",
    name: "Toganoo",
    kanji: "栂尾",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Sokuchusai sosho",
    favoredBranch: "Fushinan",
    sub: "Usucha",
    grade: "Usucha",
    price: "~$22/30g",
    sizes: ["30g", "100g"],
    rating: 4.1,
    notes: { umami: 3, sweet: 3, bitter: 2, astringent: 1, body: 3 },
    tags: ["toasty", "dry finish", "usucha", "school favored"],
    desc: "A more brisk Omotesenke usucha with a dry, traditional finish suited to practice bowls.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk26",
    name: "Senri no Mukashi",
    kanji: "千里の昔",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Urasenke",
    favoredBy: "Zabosai iemoto",
    favoredBranch: "Konnichian",
    price: "~$42/30g",
    sizes: ["30g", "100g"],
    rating: 4.5,
    notes: { umami: 4, sweet: 4, bitter: 1, astringent: 0, body: 4 },
    tags: ["silky", "long finish", "koicha", "school favored"],
    desc: "Zabosai-favored Yamamasa koicha with a silky body and restrained, long-echoing sweetness.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk27",
    name: "Yuuwa no Shiro",
    kanji: "幽和の白",
    aliases: ["Yuwa no Shiro"],
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Urasenke",
    favoredBy: "Zabosai iemoto",
    favoredBranch: "Konnichian",
    price: "~$24/30g",
    sizes: ["30g", "100g"],
    rating: 4.2,
    notes: { umami: 3, sweet: 3, bitter: 1, astringent: 1, body: 3 },
    tags: ["clean", "springy", "usucha", "school favored"],
    desc: "A neat, balanced Urasenke usucha with clean sweetness and a composed finish.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk28",
    name: "Hamuro no Mukashi",
    kanji: "葉室の昔",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Urasenke",
    favoredBy: "Hounsai daisosho",
    favoredBranch: "Konnichian",
    price: "~$38/30g",
    sizes: ["30g", "100g"],
    rating: 4.4,
    notes: { umami: 4, sweet: 4, bitter: 1, astringent: 0, body: 4 },
    tags: ["creamy", "elegant", "koicha", "school favored"],
    desc: "A creamy, elegant Urasenke koicha with soft power and a very composed structure.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk29",
    name: "Kamio no Shiro",
    kanji: "上尾の白",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Urasenke",
    favoredBy: "Hounsai daisosho",
    favoredBranch: "Konnichian",
    price: "~$25/30g",
    sizes: ["30g", "100g"],
    rating: 4.1,
    notes: { umami: 3, sweet: 3, bitter: 1, astringent: 1, body: 3 },
    tags: ["mellow", "refined", "usucha", "school favored"],
    desc: "Hounsai-favored usucha with a mellow middle and restrained bitterness.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk30",
    name: "Koke no Shiro",
    kanji: "苔の白",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Urasenke",
    favoredBy: "Hounsai daisosho",
    favoredBranch: "Konnichian",
    price: "~$23/30g",
    sizes: ["30g", "100g"],
    rating: 4.0,
    notes: { umami: 3, sweet: 2, bitter: 1, astringent: 1, body: 2 },
    tags: ["quiet", "dry", "usucha", "school favored"],
    desc: "A quieter Urasenke-style usucha with a drier finish and restrained sweetness.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk31",
    name: "Ujikami no Mukashi",
    kanji: "宇治上の昔",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Mushakojisenke",
    favoredBy: "Futetsusai iemoto",
    favoredBranch: "Kankyuan",
    price: "~$36/30g",
    sizes: ["30g", "100g"],
    rating: 4.4,
    notes: { umami: 4, sweet: 3, bitter: 1, astringent: 0, body: 4 },
    tags: ["direct", "pure", "koicha", "school favored"],
    desc: "Austere and pure in profile, this Mushakojisenke-favored koicha emphasizes clarity over opulence.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "yk32",
    name: "Kanade no Shiro",
    kanji: "奏の白",
    producer: "Yamamasa Koyamaen",
    favoredSchool: "Mushakojisenke",
    favoredBy: "Futetsusai iemoto",
    favoredBranch: "Kankyuan",
    price: "~$22/30g",
    sizes: ["30g", "100g"],
    rating: 4.1,
    notes: { umami: 3, sweet: 2, bitter: 1, astringent: 1, body: 3 },
    tags: ["clean", "austere", "usucha", "school favored"],
    desc: "A cleaner, more austere Mushakojisenke usucha with a focused traditional feel.",
    src: "User-provided Yamamasa favored tea list",
  }),
  createSchoolFavoredTea({
    id: "mk47",
    name: "Seijo no Shiro",
    kanji: "清浄の白",
    producer: "Marukyu Koyamaen",
    favoredSchool: "Urasenke",
    favoredBy: "Zabosai iemoto",
    favoredBranch: "Konnichian",
    price: "~$24/20g",
    sizes: ["20g", "40g"],
    rating: 4.2,
    notes: { umami: 3, sweet: 3, bitter: 1, astringent: 1, body: 3 },
    tags: ["clear", "bright", "usucha", "school favored"],
    desc: "A clear, bright Urasenke usucha favored by Zabosai with an easy ceremonial balance.",
    src: "User-provided Marukyu favored tea list",
  }),
  createSchoolFavoredTea({
    id: "mk48",
    name: "Saiho no Mukashi",
    kanji: "彩鳳の昔",
    producer: "Marukyu Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Yuyusai iemoto",
    favoredBranch: "Fushin'an",
    price: "~$42/20g",
    sizes: ["20g", "40g"],
    rating: 4.5,
    notes: { umami: 4, sweet: 4, bitter: 1, astringent: 0, body: 4 },
    tags: ["refined", "soft richness", "koicha", "school favored"],
    desc: "A refined Omotesenke koicha favored by Yuyusai with soft richness and a poised finish.",
    src: "User-provided Marukyu favored tea list",
  }),
  createSchoolFavoredTea({
    id: "mk49",
    name: "Yukyu no Shiro",
    kanji: "幽久の白",
    producer: "Marukyu Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Yuyusai iemoto",
    favoredBranch: "Fushin'an",
    price: "~$24/20g",
    sizes: ["20g", "40g"],
    rating: 4.2,
    notes: { umami: 3, sweet: 3, bitter: 1, astringent: 1, body: 3 },
    tags: ["gentle", "light sweetness", "usucha", "school favored"],
    desc: "A gentle Omotesenke usucha with light sweetness and a clean ceremonial profile.",
    src: "User-provided Marukyu favored tea list",
  }),
  createSchoolFavoredTea({
    id: "mk50",
    name: "Saiun",
    kanji: "彩雲",
    producer: "Marukyu Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Jimyosai sosho",
    favoredBranch: "Fushin'an",
    sub: "Usucha",
    grade: "Usucha",
    price: "~$37/20g",
    sizes: ["20g", "40g"],
    rating: 4.3,
    notes: { umami: 3, sweet: 3, bitter: 1, astringent: 1, body: 3 },
    tags: ["rounded", "balanced", "usucha", "school favored"],
    desc: "A rounded Omotesenke usucha favored by Jimyosai, built around balance rather than force.",
    src: "User-provided Marukyu favored tea list",
  }),
  createSchoolFavoredTea({
    id: "mk51",
    name: "Kissho",
    kanji: "吉祥",
    producer: "Marukyu Koyamaen",
    favoredSchool: "Omotesenke",
    favoredBy: "Jimyosai sosho",
    favoredBranch: "Fushin'an",
    sub: "Usucha",
    grade: "Usucha (Entry)",
    price: "~$20/20g",
    sizes: ["20g", "40g"],
    rating: 4.0,
    notes: { umami: 2, sweet: 2, bitter: 1, astringent: 1, body: 2 },
    tags: ["entry", "clean", "usucha", "school favored"],
    desc: "An approachable Omotesenke-favored usucha that stays clean and easy to prepare.",
    src: "User-provided Marukyu favored tea list",
  }),
  createSchoolFavoredTea({
    id: "mk52",
    name: "Shofu",
    kanji: "松風",
    producer: "Marukyu Koyamaen",
    favoredSchool: "Mushakojisenke",
    favoredBy: "Futetsusai iemoto",
    favoredBranch: "Kankyuan",
    sub: "Usucha",
    grade: "Usucha",
    price: "~$24/20g",
    sizes: ["20g", "40g"],
    rating: 4.1,
    notes: { umami: 3, sweet: 2, bitter: 1, astringent: 1, body: 3 },
    tags: ["clean", "piney", "usucha", "school favored"],
    desc: "A Mushakojisenke-favored usucha with a clean, quietly piney profile and moderate body.",
    src: "User-provided Marukyu favored tea list",
  }),
];

export const BASE_TEAS = [
  // ===== YAMAMASA KOYAMAEN — CEREMONIAL =====
  { id:"yk01", name:"Chajyu no Mukashi", kanji:"茶寿の昔", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"Top Grade", price:"$162/30g", sizes:["30g","100g","150g"], status:"active", rating:4.3, notes:{umami:5,sweet:5,bitter:1,astringent:0,body:5}, tags:["toasted seeds","roasted coffee","cocoa","pumpkin seed"], desc:"The pinnacle. Intensely mild yet powerful with a magically light body. Fresh tender green flavors with aromas of toasted seeds and roasted coffee beans. Creamy, full-bodied aftertaste lingers exceptionally long. As koicha, an explosive experience.", src:"Sazen Tea; Ujicha Matcha" },
  { id:"yk02", name:"Kasuga no Mukashi", kanji:"香寿賀の昔", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Grade", price:"$108/30g", sizes:["30g","100g","150g"], status:"active", rating:4.5, notes:{umami:5,sweet:4,bitter:1,astringent:0,body:5}, tags:["cream","explosive fullness","mild sweetness"], desc:"Intense creaminess and uniquely delicious mildness transform into an explosive, majestic full-bodied sensation that lingers on the palate. Less sweet than Chajyu, yet far more so than Kaguraden.", src:"Misora UK; Sazen Tea" },
  { id:"yk03", name:"Kaguraden", kanji:"神楽殿", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Grade", price:"$82/30g", sizes:["30g","100g","150g"], status:"active", rating:4.7, notes:{umami:5,sweet:4,bitter:2,astringent:1,body:5}, tags:["dark chocolate","toasted nuts","coffee","floral"], desc:"Incredible intensity and velvety texture. Dark chocolate and toasted nuts emerge first, followed by coffee aromas, sweet creaminess, and light floral undertones. Exceptionally long, multi-dimensional aftertaste. Often limited to 1 per customer.", src:"The Steeping Room; Kanso Tea" },
  { id:"yk04", name:"Seiun", kanji:"星雲", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Grade", price:"$55/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.4, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:4}, tags:["gentle sweetness","deep umami","smooth finish"], desc:"\"Nebula.\" Harmonious balance of deep umami, gentle sweetness, and a smooth lingering finish. Vibrant green with velvety texture. Composed complexity rather than boldness.", src:"Ujicha Matcha; Sazen Tea" },
  { id:"yk05", name:"Tennouzan", kanji:"天王山", aliases:["Tennozan"], producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"Standard Koicha", price:"$39/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.5, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:4}, tags:["dark chocolate","cream","lingering sweetness"], desc:"Exceptionally smooth texture with rich umami and deep green hue. Lingering sweetness — a true connoisseur's choice. Rich, creamy dark chocolate character. Recommended for important guests and gifting.", src:"Wakokoro Tea; Matchajp" },
  { id:"yk06", name:"Senjin no Mukashi", kanji:"先陣の昔", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha/Usucha", school:null, grade:"Dual-Purpose", price:"$33/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.3, notes:{umami:4,sweet:3,bitter:2,astringent:1,body:4}, tags:["layered umami","subtle bitterness","depth"], desc:"Complex and robust with exquisite depth. Lingering umami with subtle bitterness creates a sophisticated, layered experience. Bridges koicha and usucha elegantly.", src:"Wakokoro Tea" },
  { id:"yk07", name:"Shikibu no Mukashi", kanji:"式部の昔", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Premium Usucha", price:"$28/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.6, notes:{umami:4,sweet:4,bitter:1,astringent:1,body:3}, tags:["gentle sweetness","floral","delicate aroma","lightly nutty"], desc:"Gentle sweetness and delicate aroma with smooth mouthfeel. Umami is noticeable from the first sip. Most retailer-style notes lean floral rather than nutty, though recent Reddit comparisons sometimes place it as nuttier than Samidori in usucha. A devoted community favorite in the Yamamasa lineup.", src:"Wakokoro Tea; Community; Reddit MatchaEverything" },
  { id:"yk08", name:"Ogurayama", kanji:"小倉山", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Signature Best-Seller", price:"$23/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.4, notes:{umami:4,sweet:3,bitter:2,astringent:2,body:3}, tags:["marine","seaweed","umami","balanced"], desc:"The flagship. Perfectly balances umami and astringency. Marine and seaweed notes dominate, with a bolder and toastier feel than Samidori. Bright, full-flavored, and vividly green. Bitterness is noticeable but manageable as the umami rises.", src:"Wakokoro Tea; The Steeping Room; Reddit community" },
  { id:"yk09", name:"Yomo no Kaori", kanji:"四方の薫", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"General Usucha", price:"$17/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.0, notes:{umami:3,sweet:2,bitter:2,astringent:1,body:2}, tags:["earthy","grassy","nutty","mild","aromatic"], desc:"Earthy, grassy, slightly nutty, and more fragrance-led than the richer Yamamasa bowls. Light-to-medium body with milder umami than Ogurayama. A dependable everyday matcha on the gentler side.", src:"Community reviews; Reddit community" },
  { id:"yk10", name:"Samidori", kanji:"さみどり", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Daily Usucha", price:"$14/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.3, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["creamy","roasted","nutty","fragrant","slightly floral"], desc:"Single-origin Samidori cultivar. Creamy texture, pronounced umami, and roasted nutty character. Community comparisons often describe it as a touch more floral than Shikibu and less marine than Ogurayama.", src:"Matchajp; Wakokoro Tea; Reddit MatchaEverything" },
  { id:"yk11", name:"Matsukaze", kanji:"松風", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Entry Ceremonial", price:"$12/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.1, notes:{umami:2,sweet:2,bitter:2,astringent:2,body:3}, tags:["dark chocolate","coffee","citrus peel","toasty bread"], desc:"Bold with dark chocolate, coffee, citrus peel, and a distinctly toasty profile. A detailed Reddit review described bread-like dry aroma, strong body, and nutty bitterness that stayed enjoyable rather than harsh. Incredible value for an entry ceremonial bowl.", src:"The Steeping Room; Wakokoro; Reddit Matcha review" },
  // ===== YAMAMASA KOYAMAEN — CULINARY =====
  { id:"yk12", name:"Maki no Shiro", kanji:"牧の白", producer:"Yamamasa Koyamaen", category:"Culinary", sub:"Premium Culinary", school:null, grade:"Top Culinary", price:"Wholesale", sizes:["100g","300g","1kg"], status:"active", rating:4.0, notes:{umami:2,sweet:2,bitter:2,astringent:2,body:2}, tags:["malty","milky","nori","toasty"], desc:"Mild, malty, milky. Lively nori-green with soft yellow undertones. Creamy oceanic dry scent transforms into toasty, nutty warmth. Pairs beautifully with kuromitsu.", src:"TikTok community" },
  { id:"yk13", name:"Special A", kanji:"特A", producer:"Yamamasa Koyamaen", category:"Culinary", sub:"Food Grade", school:null, grade:"Special A", price:"Wholesale", sizes:["100g","300g","1kg"], status:"active", rating:3.8, notes:{umami:2,sweet:2,bitter:3,astringent:2,body:3}, tags:["robust green","balanced bitterness"], desc:"High-quality culinary for drinks, ice cream, cream fillings, fresh chocolates. Rich flavor and color that differentiates finished products.", src:"YK Official Catalog" },
  { id:"yk14", name:"Special B", kanji:"特B", producer:"Yamamasa Koyamaen", category:"Culinary", sub:"Food Grade", school:null, grade:"Special B", price:"Wholesale", sizes:["100g","300g","1kg"], status:"active", rating:3.6, notes:{umami:2,sweet:1,bitter:3,astringent:2,body:3}, tags:["bitter","robust","vivid green"], desc:"For culinary cooking and matcha drinks (lattes, soda). Good robust matcha presence. Vivid green color holds well in recipes.", src:"Matchajp; Tsukimix" },
  { id:"yk15", name:"No. 1", kanji:"1号", producer:"Yamamasa Koyamaen", category:"Culinary", sub:"Food Grade", school:null, grade:"#1", price:"Wholesale", sizes:["300g","1kg"], status:"active", rating:3.4, notes:{umami:1,sweet:1,bitter:3,astringent:3,body:3}, tags:["strong bitterness","baking"], desc:"Designed for baked confectioneries: sponges, bread, cookies, rice crackers. Higher bitterness balances sugar and butter.", src:"YK Official Catalog" },
  { id:"yk16", name:"No. 2", kanji:"2号", producer:"Yamamasa Koyamaen", category:"Culinary", sub:"Food Grade", school:null, grade:"#2", price:"Wholesale", sizes:["300g","1kg"], status:"active", rating:3.2, notes:{umami:1,sweet:1,bitter:4,astringent:3,body:3}, tags:["bold bitterness","economy","industrial"], desc:"Most economical. For processed foods: noodles, boiled fish paste, seasoned powders. Pronounced bitterness for industrial food manufacturing.", src:"YK Official Catalog" },
  { id:"yk17", name:"No. 3", kanji:"3号", producer:"Yamamasa Koyamaen", category:"Culinary", sub:"Food Grade", school:null, grade:"#3", price:"Wholesale", sizes:["300g","1kg"], status:"active", rating:3.0, notes:{umami:1,sweet:1,bitter:4,astringent:3,body:2}, tags:["lowest grade","processed foods","economy","high bitterness"], desc:"The lowest official Yamamasa processing grade. Intended for industrial-style processed foods where matcha color and assertive bitterness matter more than drinkability.", src:"Yamamasa official processing page" },
  // ===== MARUKYU KOYAMAEN — PRINCIPAL =====
  { id:"mk01", name:"Tenju", kanji:"天授", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"Supreme / Apex", price:"$216/20g", sizes:["20g","40g"], status:"limited", rating:4.9, notes:{umami:5,sweet:5,bitter:0,astringent:0,body:5}, tags:["buttery","smooth","lingering sweetness","earthy"], desc:"The apex. Deep earthy aroma, rich full-bodied flavor, smooth lingering sweetness. Maximum amino-acid concentration, near-zero bitterness. All-Japan Tea Competition grade. Clarity, balance, composure.", src:"Teance; Senchoju; Steepster" },
  { id:"mk02", name:"Kiwami Choan", kanji:"極 長安", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"Grand Prix Supreme", price:"$135/20g", sizes:["20g","40g"], status:"limited", rating:4.8, notes:{umami:5,sweet:5,bitter:0,astringent:0,body:5}, tags:["round","sweet","structurally rich"], desc:"Grand Prix supreme. Noticeably rounder, sweeter, structurally richer than standard Choan. Bitterness nearly absent. Layered umami complexity.", src:"Sazen Tea; Senchoju" },
  { id:"mk03", name:"Choan", kanji:"長安", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Grade Koicha", price:"$76/20g", sizes:["20g","40g"], status:"limited", rating:4.7, notes:{umami:5,sweet:4,bitter:1,astringent:0,body:5}, tags:["fresh fragrance","intense umami","long finish"], desc:"\"Long Peace.\" Soft flavor, deep green, delicate fresh fragrance, intense umami, long-lasting finish. Greater body density and smoother finish than Unkaku.", src:"Teance; Senchoju" },
  { id:"mk04", name:"Eiju", kanji:"永寿", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Grade Koicha", price:"$50/20g", sizes:["20g","40g"], status:"active", rating:4.5, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:4}, tags:["refreshing aroma","mellow","rich"], desc:"Refreshing aroma, light yet rich full-bodied character. Dense layered umami, minimal bitterness. More concentrated than Kinrin. Brew strong to experience depth.", src:"Dragon Tea House; Senchoju" },
  { id:"mk05", name:"Unkaku", kanji:"雲鶴", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Ceremonial", price:"$39/20g", sizes:["20g","40g"], status:"active", rating:4.7, notes:{umami:5,sweet:4,bitter:0,astringent:0,body:4}, tags:["sweet fog","feathery","dense","creamy umami"], desc:"\"Crane in the Clouds.\" Passes like a sweet fog — at once feathery and dense. Rich mellow sweetness, deep creamy umami. Near-zero bitterness, extremely high umami density.", src:"Teance; Wakokoro; Steepster" },
  { id:"mk05b", name:"Koun", kanji:"香雲", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Ceremonial", price:"~$45/20g", sizes:["20g","40g"], status:"limited", rating:4.5, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:4}, tags:["fragrant","rounded","aromatic cloud"], desc:"\"Fragrant Cloud.\" High ceremonial koicha with distinctly rounded, fragrant character. Rich aromatic depth, gentle sweetness, minimal bitterness. Less common outside Japan.", src:"MK Catalog" },
  { id:"mk06", name:"Kinrin", kanji:"金輪", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Koicha/Usucha", school:null, grade:"Gateway Koicha", price:"$31/20g", sizes:["20g","40g"], status:"active", rating:4.4, notes:{umami:4,sweet:3,bitter:1,astringent:1,body:3}, tags:["creamy","gentle sweetness","refined"], desc:"The gateway to koicha. Creamy, rich green tea flavor, minimal bitterness, gentle sweetness. Named from Buddhist scriptures — deepest aspects of the earth. Requires skillful preparation.", src:"Wakokoro Tea; Serendipity AU" },
  { id:"mk07", name:"Wako", kanji:"和光", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Highest Usucha", price:"$25/20g", sizes:["20g","40g"], status:"active", rating:4.7, notes:{umami:4,sweet:4,bitter:1,astringent:1,body:4}, tags:["full-bodied","long sweetness","elegant","polished"], desc:"Pinnacle of usucha. Rich, full-bodied, mild bitterness, long-lasting pleasant sweetness. Fresh aroma, refreshing aftertaste. Featured in major tea ceremonies. \"Concealing the light of wisdom.\"", src:"Wakokoro; Serendipity AU; Senchoju" },
  { id:"mk08", name:"Yugen", kanji:"又玄", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Premium Usucha", price:"$21/20g", sizes:["20g","40g"], status:"active", rating:4.4, notes:{umami:3,sweet:3,bitter:2,astringent:1,body:3}, tags:["nutty","peanut","grassy","chocolate aroma"], desc:"\"Profound upon the profound.\" Peanut, grassy, mildly tart flavors with lingering sweetness. More full-bodied than Chigi no Shiro. Chocolate notes in dry powder. Creamier than Wako.", src:"Sazen Tea; Steepster" },
  { id:"mk08b", name:"Zuiun", kanji:"瑞雲", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Premium Usucha", price:"~$20/20g", sizes:["20g","40g"], status:"limited", rating:4.2, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["smooth","auspicious cloud","gentle"], desc:"\"Auspicious Cloud.\" Smooth, gently balanced usucha with calm, refined character. Low bitterness, pleasant umami sweetness.", src:"MK Catalog" },
  { id:"mk09", name:"Chigi no Shiro", kanji:"千木の白", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Standard Usucha", price:"$30/40g", sizes:["40g"], status:"active", rating:4.2, notes:{umami:3,sweet:2,bitter:1,astringent:1,body:2}, tags:["grassy","soft","creamy","velvety"], desc:"Grassy, soft flavor with hint of acidity. Creamy, velvety texture. Named for rebuilding of Ise Shrine — tradition and renewal. Between daily comfort and ceremonial sensibility.", src:"Wakokoro; Senchoju" },
  { id:"mk10", name:"Isuzu", kanji:"五十鈴", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Entry Ceremonial", price:"$26/40g", sizes:["40g","100g"], status:"active", rating:4.3, notes:{umami:3,sweet:2,bitter:2,astringent:2,body:3}, tags:["bell pepper","cut grass","lemon","spinach","floral"], desc:"Balanced refreshing aroma, mellow umami, subtle astringency. Most vegetal and spinach-forward. Light floral brightness. Cleansing feeling. Named after Isuzu River near Ise Shrine. Most approachable ceremonial.", src:"MK Shop; Steepster; Teance" },
  { id:"mk11", name:"Aoarashi", kanji:"青嵐", producer:"Marukyu Koyamaen", category:"Ceremonial", sub:"Usucha", school:null, grade:"Entry Ceremonial", price:"$22/40g", sizes:["40g","100g"], status:"active", rating:4.1, notes:{umami:2,sweet:2,bitter:2,astringent:2,body:3}, tags:["grassy","robust","refreshing","seaweed"], desc:"\"Early summer wind.\" Bold, robust, refreshing. Practice matcha for tea ceremony courses. Brisk edge holds in milk. Bridge from culinary to ceremonial. Sweeter than Wakatake.", src:"Teance; Serendipity AU; Dragon Tea House" },
  // ===== MARUKYU — URASENKE (full lineup) =====
  { id:"mk20", name:"Shoka no Mukashi", kanji:"松花の昔", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Koicha", school:"Urasenke · Zabosai (16th)", grade:"Koicha", price:"~$76/20g", sizes:["20g","40g"], status:"limited", rating:4.7, notes:{umami:5,sweet:4,bitter:1,astringent:0,body:5}, tags:["mild","light","sweet","refined","long finish"], desc:"Named after the 16th and current Grandmaster. Mild, light, sweet, gently dissipating. Masterfully refined, long-lasting finish. The thicker you brew it, the better.", src:"Sazen Tea" },
  { id:"mk21", name:"Keichi no Mukashi", kanji:"慶知の昔", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Koicha", school:"Urasenke · Hoensai / Kyouan", grade:"Koicha", price:"~$50/20g", sizes:["20g"], status:"limited", rating:4.6, notes:{umami:5,sweet:4,bitter:1,astringent:0,body:4}, tags:["sweeter umami","creamy finish","celebratory"], desc:"More body than Shoun no Mukashi and Kiun. Sweeter taste and more pronounced umami. Uniquely delicious with a lastingly mild, slightly creamy finish. Named for the 60th Shikinen Sengu.", src:"Sazen Tea; Japanese Select" },
  { id:"mk22", name:"Kiun", kanji:"喜雲", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Koicha", school:"Urasenke · Hounsai (15th)", grade:"Koicha", price:"~$40/20g", sizes:["20g","40g"], status:"limited", rating:4.5, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:4}, tags:["pumpkin seeds","thick","full-bodied","long finish"], desc:"\"Joyous Cloud.\" The very first name granted by Hounsai. Primarily koicha — pumpkin seed fragrance, thick full-bodied flavor, pronounced long-lasting finish. Also delicious as thin tea.", src:"Sazen Tea" },
  { id:"mk23", name:"Shoun no Mukashi", kanji:"松雲の昔", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Koicha", school:"Urasenke · Hounsai (15th)", grade:"Koicha", price:"~$40/20g", sizes:["20g","100g"], status:"limited", rating:4.6, notes:{umami:5,sweet:4,bitter:1,astringent:0,body:5}, tags:["pine cloud","exclusive","high ceremonial"], desc:"\"Remembrance of the Pine Cloud.\" High-grade koicha exclusively designated for Urasenke. Produced in very small quantities.", src:"Nara Tea Co; Sazen Tea" },
  { id:"mk23b", name:"Tama no Shiro", kanji:"玉の白", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Usucha", school:"Urasenke · Hounsai (15th)", grade:"Usucha", price:"~$25/20g", sizes:["20g","40g"], status:"limited", rating:4.2, notes:{umami:3,sweet:3,bitter:2,astringent:2,body:3}, tags:["acrid","full-bodied","tart","teasing"], desc:"A mixture of acrid, full-bodied, and tart flavors. Transition between Shohaku and Zuishen no Shiro. Teasing tartness with more pronounced flavor. Discreet background bitterness enhances character.", src:"Sazen Tea" },
  { id:"mk23c", name:"Shohaku", kanji:"松柏", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Usucha", school:"Urasenke · Hounsai (15th)", grade:"Usucha (Entry)", price:"~$18/20g", sizes:["20g","40g"], status:"active", rating:4.1, notes:{umami:3,sweet:2,bitter:2,astringent:2,body:3}, tags:["slightly acrid","full-bodied","long sweet finish","vibrant"], desc:"Best entry-level Urasenke tea. Slightly acrid yet full-bodied with deeper tones, long-lasting slightly sweet finish. Superb price-quality ratio. Fresh, vibrant, bright and smooth.", src:"Sazen Tea; Nara Tea Co" },
  { id:"mk23d", name:"Kankyuan", kanji:"閑居庵", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Usucha", school:"Urasenke · Konnichian", grade:"Usucha", price:"~$20/40g", sizes:["40g"], status:"limited", rating:4.0, notes:{umami:3,sweet:2,bitter:2,astringent:1,body:2}, tags:["hermitage","quiet","balanced","daily practice"], desc:"\"Hermitage of Quiet Dwelling.\" Urasenke-designated usucha for daily practice at Konnichian. Balanced and approachable.", src:"MK Catalog" },
  { id:"mk23e", name:"Fudenan", kanji:"不伝庵", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Usucha", school:"Urasenke · Konnichian", grade:"Usucha", price:"~$18/40g", sizes:["40g"], status:"limited", rating:3.9, notes:{umami:2,sweet:2,bitter:2,astringent:2,body:2}, tags:["untransmitted","practice","daily","accessible"], desc:"\"Hall of the Untransmitted.\" Urasenke practice-level usucha. Named for the principle that true tea cannot be transmitted by words — only experienced.", src:"MK Catalog" },
  // ===== MARUKYU — OMOTESENKE =====
  { id:"mk24", name:"Myofu no Mukashi", kanji:"妙風の昔", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Koicha", school:"Omotesenke · Jimyosai / Fushinan", grade:"Koicha", price:"~$50/20g", sizes:["20g","40g"], status:"limited", rating:4.5, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:4}, tags:["elegant wind","refined","Fushinan"], desc:"\"Wondrous Wind.\" Favored by Grand Master Jimyōsai at Fushinan. Distinguished koicha with refined elegance.", src:"Japanese Select; MK Shop" },
  { id:"mk24b", name:"Sanyu no Shiro", kanji:"三友の白", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Usucha", school:"Omotesenke · Jimyosai / Fushinan", grade:"Usucha", price:"~$25/20g", sizes:["20g","40g"], status:"limited", rating:4.3, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["three friends","pine bamboo plum","balanced"], desc:"\"Three Friends.\" Embodies pine, bamboo, plum — the three friends of winter. Balanced, approachable Omotesenke usucha.", src:"Japanese Select" },
  { id:"mk24c", name:"Saito no Kaori", kanji:"彩陶の香", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Matcha", school:"Omotesenke line", grade:"Standard", price:"~$20/40g", sizes:["20g","40g"], status:"limited", rating:4.0, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["aromatic","colored pottery","Omotesenke"], desc:"\"Fragrance of Colored Pottery.\" Omotesenke-line matcha with aromatic character.", src:"MK Catalog" },
  { id:"mk24d", name:"Ogura no Sono", kanji:"小倉の園", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Matcha", school:"Omotesenke line", grade:"Standard", price:"~$18/40g", sizes:["20g","40g"], status:"active", rating:4.0, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["garden","balanced","approachable"], desc:"\"Garden of Ogura.\" Balanced speciality from the Omotesenke product line.", src:"MK Catalog" },
  { id:"mk24e", name:"Miyabi no In", kanji:"雅の印", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Matcha", school:"Omotesenke line", grade:"Premium", price:"~$30/20g", sizes:["20g"], status:"limited", rating:4.2, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["elegance","seal","refined grace"], desc:"\"Seal of Elegance.\" Premium Omotesenke-line matcha embodying refined grace.", src:"MK Catalog" },
  // ===== MARUKYU — MUSHAKOJISENKE =====
  { id:"mk25", name:"Suisho no Mukashi", kanji:"翠松の昔", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Koicha", school:"Mushakojisenke · Futessai (14th)", grade:"Koicha", price:"~$40/20g", sizes:["20g","40g"], status:"limited", rating:4.5, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:4}, tags:["emerald pine","austere","pure"], desc:"Favored by Futessai, 14th generation. Reflects the austere yet refined Mushakojisenke aesthetic.", src:"Sazen Tea; MK Shop" },
  // ===== MARUKYU — YABUNOUCHIRYU =====
  { id:"mk26", name:"Hekiun no Mukashi", kanji:"碧雲の昔", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Koicha", school:"Yabunouchiryu · Inyusai", grade:"Koicha", price:"~$40/20g", sizes:["20g"], status:"limited", rating:4.4, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:4}, tags:["blue-green cloud","quiet refinement"], desc:"\"Blue-Green Cloud.\" Embodies the quiet refinement of the Yabunouchi school.", src:"Sazen Tea" },
  { id:"mk27", name:"Yoyo no Shiro", kanji:"楊々の白", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Usucha", school:"Yabunouchiryu · Inyusai", grade:"Usucha", price:"~$20/20g", sizes:["20g"], status:"limited", rating:4.2, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["willow","gentle","graceful"], desc:"Graceful and gentle like the willow — a ceremonial Yabunouchi usucha.", src:"Sazen Tea" },
  // ===== MARUKYU — ENSHURYU =====
  { id:"mk28", name:"Ichigen no Shiro", kanji:"一元の白", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Usucha", school:"Enshuryu · Kobori Sojitsu (13th)", grade:"Usucha", price:"~$20/20g", sizes:["20g","200g"], status:"limited", rating:4.3, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["origin","contemplative","scholarly"], desc:"\"One Origin.\" Contemplative usucha suited to the scholarly Enshu tradition.", src:"Sazen Tea; MK Shop" },
  // ===== MARUKYU — SOHENRYU =====
  { id:"mk29", name:"Kokonoe no Mukashi", kanji:"九重の昔", producer:"Marukyu Koyamaen", category:"Tea School", sub:"Koicha", school:"Sohenryu · Yuyusai", grade:"Koicha", price:"~$35/20g", sizes:["20g"], status:"limited", rating:4.4, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:4}, tags:["nine-fold","layered","imperial"], desc:"\"Nine-fold.\" Evokes the layered imperial palace — depth and ceremonial gravitas.", src:"Sazen Tea" },
  // ===== MARUKYU — SPECIALITY =====
  { id:"mk30", name:"Suzukumo", kanji:"涼雲", producer:"Marukyu Koyamaen", category:"Speciality", sub:"Cold Brew", school:null, grade:"Cold Preparation", price:"$58/40g", sizes:["40g"], status:"limited", rating:4.0, notes:{umami:3,sweet:2,bitter:2,astringent:1,body:3}, tags:["refreshing","cool","freeze-dried","summer"], desc:"Freeze-dried for cold water. No sifting — dissolves without lumping. Slightly more bitter but refreshingly perfect for summer.", src:"Sazen Tea; Steepster" },
  { id:"mk31", name:"Awaraku", kanji:"淡楽", producer:"Marukyu Koyamaen", category:"Speciality", sub:"Cold Brew", school:null, grade:"Cold Preparation", price:"$41/40g", sizes:["40g"], status:"limited", rating:3.9, notes:{umami:3,sweet:2,bitter:2,astringent:1,body:2}, tags:["light","refreshing","cold smooth"], desc:"Balanced ceremonial quality in cold format — smooth and refreshing.", src:"Sazen Tea; Steepster" },
  { id:"mk32", name:"Gabaron Matcha", kanji:"ギャバロン", producer:"Marukyu Koyamaen", category:"Speciality", sub:"Functional", school:null, grade:"Functional", price:"~$30/40g", sizes:["40g"], status:"active", rating:3.7, notes:{umami:2,sweet:2,bitter:2,astringent:2,body:2}, tags:["GABA-rich","relaxing","stress support"], desc:"Elevated GABA levels for relaxation and stress support. Functional matcha for wellness.", src:"Teance; MK Shop" },
  { id:"mk33", name:"Organic JAS Gold", kanji:"有機ゴールド", producer:"Marukyu Koyamaen", category:"Speciality", sub:"Organic", school:null, grade:"Organic Ceremonial", price:"~$35/40g", sizes:["40g"], status:"active", rating:4.0, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["organic","clean","smooth","sustainable"], desc:"JAS-certified organic ceremonial from Uji. Quality meets sustainability.", src:"Teance; MK Shop" },
  { id:"mk34", name:"Organic JAS Silver", kanji:"有機シルバー", producer:"Marukyu Koyamaen", category:"Speciality", sub:"Organic", school:null, grade:"Organic Standard", price:"~$25/40g", sizes:["40g","100g"], status:"active", rating:3.8, notes:{umami:2,sweet:2,bitter:2,astringent:2,body:2}, tags:["organic","versatile","entry organic"], desc:"JAS-certified organic. Versatile for drinking and baking.", src:"MK Shop" },
  { id:"mk35", name:"Low Caffeine Matcha", kanji:"低カフェイン", producer:"Marukyu Koyamaen", category:"Speciality", sub:"Functional", school:null, grade:"Low Caffeine", price:"~$25/40g", sizes:["40g"], status:"active", rating:3.6, notes:{umami:2,sweet:2,bitter:2,astringent:1,body:2}, tags:["gentle","evening-friendly","low caffeine"], desc:"Reduced caffeine for gentle evening cups while maintaining quality.", src:"MK Shop; MatchaEasy" },
  { id:"mk36", name:"Benifuki", kanji:"べにふうき", producer:"Marukyu Koyamaen", category:"Speciality", sub:"Functional", school:null, grade:"Powdered Green Tea", price:"~$20/40g", sizes:["40g"], status:"active", rating:3.5, notes:{umami:1,sweet:1,bitter:3,astringent:3,body:2}, tags:["methylated catechins","allergy relief","seasonal"], desc:"Benifuki cultivar. High in methylated catechins for pollen allergy relief. Bitter, astringent — functional rather than ceremonial.", src:"MK Catalog" },
  { id:"mk37", name:"Heian no Kaori", kanji:"平安の薫", producer:"Marukyu Koyamaen", category:"Speciality", sub:"Named Blend", school:"Nishinotoin Shop", grade:"Speciality", price:"~$25/20g", sizes:["20g","40g"], status:"active", rating:4.0, notes:{umami:3,sweet:3,bitter:1,astringent:1,body:3}, tags:["Heian elegance","aromatic","Kyoto"], desc:"Classical elegance and refined fragrance of ancient Kyoto. Associated with Nishinotoin tea shop.", src:"MK Catalog" },
  // ===== MARUKYU — CULINARY =====
  { id:"mk40", name:"Wakatake", kanji:"若竹", producer:"Marukyu Koyamaen", category:"Culinary", sub:"Professional Latte", school:null, grade:"Latte Standard", price:"~$30/100g", sizes:["100g","500g"], status:"active", rating:4.2, notes:{umami:2,sweet:2,bitter:3,astringent:2,body:3}, tags:["balanced","bright green","milk-stable","café standard"], desc:"The professional café standard. Perfect balance of richness and sweetness with bright green. Engineered to cut through milk. Most popular and widely used MK culinary product.", src:"MK Shop; Dragon Tea House; Senchoju" },
  { id:"mk41", name:"Rindou", kanji:"龍膽", producer:"Marukyu Koyamaen", category:"Culinary", sub:"Baking Grade", school:null, grade:"Beginner Baking", price:"~$20/100g", sizes:["100g","500g","1kg"], status:"active", rating:3.5, notes:{umami:1,sweet:1,bitter:4,astringent:3,body:3}, tags:["strong bitterness","industrial","economy baking"], desc:"Higher bitterness, low umami. For confectionery and large-scale use. Mixed with other green teas. Beginner baking grade.", src:"MatchaEasy; Dragon Tea House" },
  { id:"mk42", name:"Suisen", kanji:"翠仙", producer:"Marukyu Koyamaen", category:"Culinary", sub:"Pastry Grade", school:null, grade:"Mid-tier Culinary", price:"~$25/100g", sizes:["100g","500g"], status:"active", rating:3.7, notes:{umami:2,sweet:2,bitter:3,astringent:2,body:3}, tags:["color retention","mid-tier","hybrid culinary"], desc:"Mid-tier structural grade. Balances color retention and moderate smoothness. Hybrid culinary-ceremonial flexibility.", src:"Sazen Tea; Senchoju" },
  { id:"mk43", name:"Byakuren", kanji:"白蓮", producer:"Marukyu Koyamaen", category:"Culinary", sub:"Latte / Pastry", school:null, grade:"Food-Processing", price:"~$25/100g", sizes:["100g","200g"], status:"active", rating:3.8, notes:{umami:2,sweet:2,bitter:2,astringent:2,body:3}, tags:["soft","smooth","grassy","vegetal","latte-worthy"], desc:"\"White Lotus.\" Food-processing matcha for confectionery and beverages. Vibrant green, well-balanced. Soft and smooth with deep grassy and vegetal notes. Assertive for lattes, smooth enough to drink alone.", src:"Nara Tea Co; MEM Tea; Japanese Select" },
  { id:"mk44", name:"Non-bleed Sprinkling", kanji:"飾り抹茶", producer:"Marukyu Koyamaen", category:"Culinary", sub:"Decorative", school:null, grade:"Decorative", price:"~$15/40g", sizes:["40g"], status:"active", rating:3.3, notes:{umami:1,sweet:1,bitter:2,astringent:2,body:1}, tags:["decorative","non-bleed","garnish","pastry dusting"], desc:"Specially processed to resist moisture bleeding. For visual garnish — maintains bright green on pastries without dissolving into wet surfaces.", src:"MK Catalog" },
  { id:"mk45", name:"Sweetened (Excellent)", kanji:"特撰グリーンティー", producer:"Marukyu Koyamaen", category:"Culinary", sub:"Sweetened", school:null, grade:"Sweetened Blend", price:"~$12/100g", sizes:["100g","500g"], status:"active", rating:3.5, notes:{umami:1,sweet:4,bitter:1,astringent:0,body:2}, tags:["pre-sweetened","instant","convenient"], desc:"Premium sweetened matcha blend. Just add hot or cold water for instant preparation. Convenient for casual entertaining.", src:"MK Catalog" },
  { id:"mk46", name:"Sweetened (Milk Design)", kanji:"ミルク専用", producer:"Marukyu Koyamaen", category:"Culinary", sub:"Sweetened", school:null, grade:"Milk-Optimized", price:"~$12/100g", sizes:["100g","500g"], status:"active", rating:3.4, notes:{umami:1,sweet:4,bitter:1,astringent:0,body:2}, tags:["milk-designed","sweet","instant latte"], desc:"Sweetened matcha specifically for milk-based drinks. Dissolves smoothly in cold or hot milk for instant matcha lattes.", src:"MK Catalog" },
];

export const IPPODO_TEAS = [
  { id:"ip01", name:"Kuon", kanji:"久遠", aliases:["Kuon Matcha"], producer:"Ippodo Tea", category:"Ceremonial", sub:"Koicha/Usucha", school:null, grade:"Special Class", price:"¥6480/20g", sizes:["20g"], status:"active", rating:4.9, notes:{umami:5,sweet:5,bitter:0,astringent:0,body:5}, tags:["special class","silky","refined sweetness","luxury"], desc:"One of Ippodo's rarest special-class matcha. Built around a smooth mouthfeel, polished sweetness, and a composed finish that reads truly ceremonial rather than showy.", src:"Ippodo Tea Japan Kuon page" },
  { id:"ip02", name:"Kanza", kanji:"閑坐", aliases:["Kanza Matcha"], producer:"Ippodo Tea", category:"Ceremonial", sub:"Koicha/Usucha", school:null, grade:"Special Class", price:"¥10800/20g", sizes:["20g"], status:"active", rating:4.9, notes:{umami:5,sweet:5,bitter:0,astringent:0,body:5}, tags:["rarest class","deep sweetness","elegant","handpicked"], desc:"Ippodo's top special-class offering. Exceptionally limited, deeply shaded, and tuned for serene sweetness, density, and an almost effortless koicha texture.", src:"Ippodo Tea Japan Kanza page; Ippodo Tea Japan Kuon/Kanza note" },
  { id:"ip03", name:"Ummon no Mukashi", kanji:"雲門の昔", aliases:["Ummon"], producer:"Ippodo Tea", category:"Ceremonial", sub:"Koicha/Usucha", school:"Urasenke · Konnichian line", grade:"Rich & Robust", price:"¥4320/20g", sizes:["20g"], status:"active", rating:4.8, notes:{umami:5,sweet:4,bitter:1,astringent:1,body:5}, tags:["rich","robust","bright fragrance","long finish","Urasenke line"], desc:"The richest standard Ippodo matcha. Full, fragrant, and unmistakably present, with strong umami and sweetness held in balance by a light, intentional astringent edge.", src:"Ippodo Tea US Ummon page; Ippodo Tea Japan Urasenke collection" },
  { id:"ip04", name:"Shoin no Mukashi", kanji:"松韻の昔", aliases:["Shoin"], producer:"Ippodo Tea", category:"Ceremonial", sub:"Koicha/Usucha", school:"Omotesenke · Fushinan line", grade:"Rich & Velvety", price:"¥3240/20g", sizes:["20g"], status:"active", rating:4.7, notes:{umami:4,sweet:4,bitter:1,astringent:0,body:5}, tags:["velvety","weighty sweetness","mature","formal","Omotesenke line"], desc:"Ippodo ceremonial matcha tagged to the Omotesenke Fushinan line, with a velvety texture and mature, weighty sweetness. It feels softer and rounder than the forceful Ummon style.", src:"Ippodo Tea Japan Shoin no Mukashi page" },
  { id:"ip05", name:"Sayaka no Mukashi", kanji:"明昔", aliases:["Sayaka"], producer:"Ippodo Tea", category:"Ceremonial", sub:"Koicha/Usucha", school:"Urasenke · Konnichian line", grade:"Rich & Smooth", price:"¥2376/20g", sizes:["20g"], status:"active", rating:4.5, notes:{umami:4,sweet:4,bitter:1,astringent:1,body:4}, tags:["smooth","beginner friendly","balanced richness","approachable","Urasenke line"], desc:"Ippodo's standard recommendation for a first premium matcha. Rich but easygoing, with smooth umami, gentle sweetness, and just enough bitterness to keep the cup lively.", src:"Ippodo Tea US Sayaka page; Ippodo Tea Japan Urasenke collection" },
  { id:"ip06", name:"Kan no Shiro", kanji:"関の白", aliases:["Kan"], producer:"Ippodo Tea", category:"Ceremonial", sub:"Usucha", school:"Urasenke · Konnichian line", grade:"Balanced & Rounded", price:"¥1728/20g", sizes:["20g"], status:"active", rating:4.2, notes:{umami:3,sweet:4,bitter:2,astringent:1,body:3}, tags:["rounded","balanced","full sweetness","daily ceremonial","Urasenke line"], desc:"A fuller, rounded Ippodo usucha with noticeable sweetness and umami, but less gravity than the richer koicha-capable blends above it.", src:"Ippodo Tea Japan Urasenke collection" },
  { id:"ip07", name:"Ikuyo no Mukashi", kanji:"幾世の昔", aliases:["Ikuyo"], producer:"Ippodo Tea", category:"Ceremonial", sub:"Usucha", school:"Urasenke · Konnichian line", grade:"Elegant & Calm", price:"¥1188/20g", sizes:["20g"], status:"active", rating:4.0, notes:{umami:3,sweet:2,bitter:2,astringent:2,body:3}, tags:["calm","clean","fresh aroma","measured","Urasenke line"], desc:"A quieter, more graceful bowl than Kan. The profile is balanced and refreshing, with a lighter body and a more visible astringent snap.", src:"Ippodo Tea Japan Urasenke collection" },
  { id:"ip08", name:"Wakaki no Shiro", kanji:"若き白", aliases:["Wakaki"], producer:"Ippodo Tea", category:"Ceremonial", sub:"Usucha", school:"Urasenke · Konnichian line", grade:"Light & Easy", price:"¥864/20g", sizes:["20g"], status:"active", rating:3.8, notes:{umami:2,sweet:1,bitter:3,astringent:3,body:2}, tags:["light","brisk","easy daily bowl","casual","Urasenke line"], desc:"A lighter Ippodo matcha designed for easy daily drinking. The finish is short and clean, closer in feel to a brisk sencha mindset than to heavy ceremonial sweetness.", src:"Ippodo Tea Japan Wakaki no Shiro page; Ippodo Tea Japan Urasenke collection" },
  { id:"ip09", name:"Hatsu no Mukashi", kanji:"初昔", aliases:["Hatsu"], producer:"Ippodo Tea", category:"Ceremonial", sub:"Usucha", school:null, grade:"Entry Matcha", price:"¥648/20g", sizes:["20g"], status:"active", rating:3.7, notes:{umami:2,sweet:1,bitter:4,astringent:3,body:2}, tags:["entry","sharp","refreshing","latte friendly"], desc:"The clearest entry point into Ippodo's matcha range. Sharper and more bitter than the richer ceremonial blends, but still clean enough to whisk straight or push into milk.", src:"Ippodo Tea Japan Hatsu no Mukashi page" },
  { id:"ip10", name:"Organic Matcha", kanji:"オーガニック抹茶", aliases:["Organic"], producer:"Ippodo Tea", category:"Speciality", sub:"Organic", school:null, grade:"Organic Ceremonial", price:"¥1620/20g", sizes:["20g"], status:"active", rating:3.8, notes:{umami:2,sweet:1,bitter:3,astringent:3,body:2}, tags:["organic","grassy","sharp finish","soy latte friendly"], desc:"Organic Ippodo matcha with a greener, grassier expression and a sharper finish than the classic blends. Best for drinkers who enjoy a cleaner, more energetic edge.", src:"Ippodo Tea Japan Organic Matcha page" },
];

export const TEAS = [...BASE_TEAS, ...EXTRA_SCHOOL_FAVORED_TEAS, ...IPPODO_TEAS].map(enrichTea);

export const CATS = ["All", "Ceremonial", "Tea School", "Culinary", "Speciality"];
export const PRODS = ["All", ...new Set(TEAS.map((tea) => tea.producer))];
export const PROFILE_ROWS = [
  ["Umami", "umami", "#5a8a3a"],
  ["Sweetness", "sweet", "#c4a040"],
  ["Bitterness", "bitter", "#8a5a3a"],
  ["Astringency", "astringent", "#7a6a8a"],
  ["Body", "body", "#4a6a6a"],
];
export const CULTIVAR_PROFILE_ROWS = [
  ["Umami", "umami", "#5a8a3a"],
  ["Sweetness", "sweet", "#c4a040"],
  ["Bitterness", "bitter", "#8a5a3a"],
  ["Aroma", "aroma", "#7a6a8a"],
  ["Body", "body", "#4a6a6a"],
];
export const REGION_PROFILE_ROWS = [
  ["Umami", "umami", "#5a8a3a"],
  ["Sweetness", "sweet", "#c4a040"],
  ["Bitterness", "bitter", "#8a5a3a"],
  ["Aroma", "aroma", "#7a6a8a"],
  ["Body", "body", "#4a6a6a"],
];

export const NOTES_FIELDS = ["umami", "sweet", "bitter", "astringent", "body"];
export const NETWORK_NOTES_FIELDS = ["umami", "sweet", "bitter", "aroma", "body"];
export const MAX_TEA_DIST = 9;
export const CAT_COLORS_GRAPH = {
  Ceremonial: "#5a8a3a",
  "Tea School": "#7a6a8a",
  Culinary: "#8a5a3a",
  Speciality: "#4a7a8a",
};

export function teaDist(a, b) {
  return Math.sqrt(
    NOTES_FIELDS.reduce((s, f) => s + Math.pow((a.notes?.[f] ?? 0) - (b.notes?.[f] ?? 0), 2), 0)
  );
}

export function noteDist(a, b, fields) {
  return Math.sqrt(
    fields.reduce((s, f) => s + Math.pow((a.notes?.[f] ?? 0) - (b.notes?.[f] ?? 0), 2), 0)
  );
}

export function getSimilarItems(sourceItem, allItems, fields, n = 5) {
  return allItems
    .filter((item) => item.id !== sourceItem.id)
    .map((item) => ({ item, dist: noteDist(sourceItem, item, fields) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n);
}

export function getSimilarTeas(tea, allTeas, n = 5) {
  return allTeas
    .filter((t) => t.id !== tea.id)
    .map((t) => ({ tea: t, dist: teaDist(tea, t) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n);
}

export const CULTIVARS = [
  {
    id: "cv01",
    name: "Asahi",
    kanji: "あさひ",
    origin: "Kyoto / Uji",
    style: "Ultra-premium Kyoto cultivar",
    bestFor: "Top ceremonial usucha and koicha",
    notes: { umami: 5, sweet: 5, bitter: 1, aroma: 4, body: 4 },
    tags: ["rare", "creamy", "elegant", "low bitterness"],
    desc: "Prestigious Kyoto cultivar prized for premium tencha and matcha. Expect deep umami, elegant sweetness, and a calm, dense body with very little bitterness.",
    src: "d:matcha Asahi; Origin Uji; Matcha & Greens",
  },
  {
    id: "cv02",
    name: "Samidori",
    kanji: "さみどり",
    origin: "Kyoto / Uji",
    style: "Classic Uji tencha cultivar",
    bestFor: "Traditional usucha, refined daily ceremonial",
    notes: { umami: 4, sweet: 4, bitter: 1, aroma: 4, body: 4 },
    tags: ["creamy", "sweet", "classic Uji", "balanced"],
    desc: "Iconic Uji cultivar associated with smooth texture, soft sweetness, and classic Kyoto-style refinement. It tends to feel balanced, creamy, and easy to enjoy straight.",
    src: "d:matcha Samidori; Nagocha Samidori; Uji Matcha Tea",
  },
  {
    id: "cv03",
    name: "Gokou",
    kanji: "ごこう",
    origin: "Kyoto / Uji",
    style: "Deep umami heritage cultivar",
    bestFor: "Koicha, intense ceremonial bowls, premium blends",
    notes: { umami: 5, sweet: 4, bitter: 2, aroma: 5, body: 5 },
    tags: ["cacao-like aroma", "deep umami", "creamy", "competition-friendly"],
    desc: "One of Kyoto's most respected cultivars for high-grade matcha. Gokou usually shows dense umami, a creamy mouthfeel, and a distinctive aromatic depth that can lean cacao-like or savory.",
    src: "d:matcha Gokou; Nagocha Gokou; Onecha",
  },
  {
    id: "cv04",
    name: "Ujihikari",
    kanji: "うじひかり",
    origin: "Kyoto / Uji",
    style: "Rare Kyoto native selection",
    bestFor: "High-grade single-cultivar ceremonial matcha",
    notes: { umami: 4, sweet: 4, bitter: 1, aroma: 4, body: 4 },
    tags: ["rare", "bright green", "nutty", "refined"],
    desc: "Rare Kyoto-native cultivar selected from Uji zairai. Known for vivid green color, rich umami, and low astringency, with a bright but polished personality in matcha.",
    src: "d:matcha Ujihikari; Origin Uji; Teawiki",
  },
  {
    id: "cv05",
    name: "Okumidori",
    kanji: "おくみどり",
    origin: "Shizuoka-bred, used in Kyoto and Kagoshima",
    style: "Smooth late-budding all-rounder",
    bestFor: "Premium ceremonial matcha and elegant blends",
    notes: { umami: 4, sweet: 3, bitter: 1, aroma: 3, body: 4 },
    tags: ["smooth", "deep green", "gentle astringency", "blend-friendly"],
    desc: "A later-budding cultivar that often gives vivid color, smooth body, and medium-high umami with gentle astringency. It is frequently used when producers want polish without aggressive bitterness.",
    src: "d:matcha Okumidori; Matcha Society AU; Kyozen Matcha",
  },
  {
    id: "cv06",
    name: "Saemidori",
    kanji: "さえみどり",
    origin: "Kagoshima-focused modern cultivar",
    style: "Bright sweet low-bitterness cultivar",
    bestFor: "Vivid usucha, approachable premium matcha, colorful lattes",
    notes: { umami: 4, sweet: 4, bitter: 1, aroma: 3, body: 3 },
    tags: ["vibrant green", "sweet", "gentle", "low bitterness"],
    desc: "Saemidori is widely loved for its bright color, sweet mellow profile, and low bitterness. It makes cultivar differences obvious because it often tastes softer and friendlier than Yabukita-led bowls.",
    src: "Matcha & Greens; Onecha; Blossom Matcha",
  },
  {
    id: "cv07",
    name: "Yabukita",
    kanji: "やぶきた",
    origin: "Shizuoka workhorse grown across Japan",
    style: "Classic balanced standard cultivar",
    bestFor: "Daily matcha, blends, lattes, beginner-friendly reference point",
    notes: { umami: 3, sweet: 2, bitter: 3, aroma: 3, body: 3 },
    tags: ["grassy", "balanced", "workhorse", "widely grown"],
    desc: "Japan's dominant tea cultivar and a useful baseline for comparison. In matcha it often tastes balanced and fresh but more vegetal and slightly more bitter than the sweeter Kyoto-heavy cultivars.",
    src: "Matcha Society AU; Matcha & Greens; Blossom Matcha",
  },
  {
    id: "cv08",
    name: "Asatsuyu",
    kanji: "あさつゆ",
    origin: "Tokyo-selected cultivar used in warmer regions",
    style: "Naturally sweet aromatic cultivar",
    bestFor: "Sweet aromatic single-cultivar bowls and expressive blends",
    notes: { umami: 4, sweet: 4, bitter: 2, aroma: 4, body: 3 },
    tags: ["natural gyokuro", "sweet", "expressive aroma", "lush"],
    desc: "Asatsuyu is famous in sencha for its naturally sweet, premium feel and can also produce bold, memorable single-cultivar matcha. Expect a lush aromatic profile and deeper sweetness than a basic daily blend.",
    src: "Cha Circle Asatsuyu; Gulfood Asatsuyu listing",
  },
  {
    id: "cv09",
    name: "Yutakamidori",
    kanji: "ゆたかみどり",
    origin: "Kagoshima-oriented cultivar",
    style: "Powerful full-bodied modern cultivar",
    bestFor: "Stronger lattes, bold blends, fuller-bodied matcha",
    notes: { umami: 3, sweet: 2, bitter: 3, aroma: 3, body: 4 },
    tags: ["full-bodied", "strong", "bold", "latte-friendly"],
    desc: "A more powerful cultivar that tends to show fuller body and a firmer edge than the gentler ceremonial favorites. Useful when you want structure, color, and presence in blends or milk drinks.",
    src: "Matcha & Greens; cultivar comparison guides",
  },
];
export const MATCHA_REGIONS = [
  { id: "rg01", name: "Kyoto", subregion: "Uji Area", kanji: "京都・宇治", production: 1068, style: "Historic ceremonial benchmark", notes: { umami: 5, sweet: 5, bitter: 1, aroma: 5, body: 4 }, tags: ["deep umami", "ooika", "ceremonial", "stone-milled"], desc: "Japan's benchmark matcha region. Uji-area matcha is prized for rich umami, elegant sweetness, and the classic shaded aroma tied to tea ceremony culture.", source: "MAFF Uji Tea; Zennoh R6 tencha table", mapX: 101, mapY: 187, lat: 34.884, lng: 135.800 },
  { id: "rg02", name: "Aichi", subregion: "Nishio / Nishi-Mikawa", kanji: "愛知・西尾", production: 428, style: "Mellow large-scale matcha center", notes: { umami: 4, sweet: 4, bitter: 1, aroma: 4, body: 4 }, tags: ["vivid green", "mellow", "long umami", "GI"], desc: "Nishio matcha is officially recognized for vivid blue-green color, delicate mellow taste, and strong umami that lingers without harshness.", source: "MAFF GI Nishio Matcha; Zennoh R6 tencha table", mapX: 120, mapY: 212, lat: 34.858, lng: 137.051 },
  { id: "rg03", name: "Fukuoka", subregion: "Yame / Hoshino", kanji: "福岡・八女", production: 192, style: "Fragrant rich Kyushu premium", notes: { umami: 4, sweet: 4, bitter: 1, aroma: 5, body: 4 }, tags: ["deep fragrance", "mellow", "rich", "gyokuro-adjacent"], desc: "Yame is best known for deeply fragrant, mellow tea. Its matcha tends to read rich, aromatic, and smooth, with a more rounded sweetness than harder-edged daily matcha.", source: "Kyushu MAFF Yame Tea; Zennoh R6 tencha table", mapX: 44, mapY: 300, lat: 33.212, lng: 130.610 },
  { id: "rg04", name: "Shizuoka", subregion: "Fuji / Makinohara / Kakegawa", kanji: "静岡", production: 611, style: "Clean balanced everyday powerhouse", notes: { umami: 3, sweet: 3, bitter: 2, aroma: 4, body: 3 }, tags: ["fresh", "balanced", "clean", "approachable"], desc: "Shizuoka's matcha profile is usually cleaner and more straightforward than Kyoto's, with balanced flavor, fresher aroma, and broad appeal for daily drinking and blends.", source: "JETRO matcha overview; Zennoh R6 tencha table", mapX: 132, mapY: 173, lat: 34.977, lng: 138.383 },
  { id: "rg05", name: "Kagoshima", subregion: "Prefecture-wide", kanji: "鹿児島", production: 2150, style: "Japan's biggest tencha engine", notes: { umami: 4, sweet: 3, bitter: 2, aroma: 4, body: 4 }, tags: ["warm climate", "vivid", "high volume", "blend-friendly"], desc: "Kagoshima is now Japan's largest tencha producer. Warm-climate matcha from here often shows vivid color, early-harvest sweetness, and enough structure to work beautifully in blends and lattes.", source: "MAFF Kagoshima Tea; Zennoh R6 tencha table", mapX: 28, mapY: 377, lat: 31.596, lng: 130.558 },
  { id: "rg06", name: "Mie", subregion: "Ise Tea", kanji: "三重・伊勢", production: 332, style: "Covered-tea richness from Ise", notes: { umami: 4, sweet: 3, bitter: 2, aroma: 4, body: 3 }, tags: ["mellow", "covered tea", "green", "savory"], desc: "Mie's tea culture is strongly shaped by shaded teas such as kabusecha, and its tencha/matcha tends to feel mellow, green, and savory rather than aggressively bitter.", source: "MAFF Ise Tea; Zennoh R6 tencha table", mapX: 111, mapY: 229, lat: 34.730, lng: 136.509 },
  { id: "rg07", name: "Nara", subregion: "Yamato Tea", kanji: "奈良", production: 220, style: "Quiet Uji-adjacent traditional region", notes: { umami: 4, sweet: 3, bitter: 2, aroma: 3, body: 3 }, tags: ["balanced", "historic", "subtle", "traditional"], desc: "Nara is historically tied to the broader Uji tea world. Its small-but-real tencha output suggests matcha that is balanced and traditional in profile, without the scale of Kyoto or Nishio.", source: "MAFF Uji Tea definition; Zennoh R6 tencha table", mapX: 103, mapY: 215, lat: 34.685, lng: 135.833 },
  { id: "rg08", name: "Shiga", subregion: "Omi Tea", kanji: "滋賀", production: 97, style: "Cool-climate Uji supply region", notes: { umami: 3, sweet: 3, bitter: 2, aroma: 3, body: 3 }, tags: ["clean", "adjacent to Uji", "gentle", "supporting region"], desc: "Part of the legally recognized Uji tea supply area. Shiga's matcha contribution is smaller and generally read as clean, elegant, and less heavy than the most famous Kyoto bowls.", source: "MAFF Uji Tea definition; Zennoh R6 tencha table", mapX: 96, mapY: 204, lat: 35.004, lng: 135.869 },
  { id: "rg09", name: "Miyazaki", subregion: "Southern Kyushu", kanji: "宮崎", production: 182, style: "Warm-climate southern upstart", notes: { umami: 3, sweet: 3, bitter: 2, aroma: 4, body: 4 }, tags: ["sunny", "fuller body", "lively", "southern"], desc: "Miyazaki's tencha output is still modest, but its warm climate points toward aromatic, fuller-bodied matcha with more energy and color than austere old-school northern profiles.", source: "Zennoh R6 tencha table; southern tea region comparisons", mapX: 50, mapY: 343, lat: 31.911, lng: 131.424 },
  { id: "rg10", name: "Nagasaki", subregion: "Western Kyushu", kanji: "長崎", production: 34, style: "Small coastal producer", notes: { umami: 3, sweet: 3, bitter: 2, aroma: 3, body: 3 }, tags: ["small volume", "coastal", "soft", "emerging"], desc: "A small-volume tencha region. Expect softer, less standardized matcha styles here, often with a gentler profile shaped by coastal humidity and small-batch production.", source: "Zennoh R6 tencha table", mapX: 14, mapY: 309, lat: 32.750, lng: 129.877 },
  { id: "rg11", name: "Oita", subregion: "Northeastern Kyushu", kanji: "大分", production: 7, style: "Tiny experimental producer", notes: { umami: 3, sweet: 2, bitter: 2, aroma: 3, body: 3 }, tags: ["tiny volume", "regional", "mild", "small-batch"], desc: "Oita's tencha output is tiny. Regionally this is better understood as a niche or experimental matcha source than as a major standardized matcha identity.", source: "Zennoh R6 tencha table", mapX: 60, mapY: 318, lat: 33.238, lng: 131.613 },
  { id: "rg12", name: "Shimane", subregion: "San'in coast", kanji: "島根", production: 6, style: "Micro-scale western Honshu producer", notes: { umami: 3, sweet: 2, bitter: 2, aroma: 3, body: 2 }, tags: ["micro-scale", "rustic", "cooler climate", "rare"], desc: "Shimane appears in the national tencha table at very small scale. Matcha from here is best treated as rare, local, and stylistically less fixed than the major producing prefectures.", source: "Zennoh R6 tencha table", mapX: 49, mapY: 216, lat: 35.472, lng: 133.051 },
  { id: "rg13", name: "Tottori", subregion: "San'in coast", kanji: "鳥取", production: 1, style: "Very small current producer", notes: { umami: 2, sweet: 2, bitter: 2, aroma: 2, body: 2 }, tags: ["very small", "niche", "rare", "local"], desc: "Tottori currently records only trace tencha production. It belongs in the exhaustive list, but not in the same flavor-confidence tier as Kyoto, Aichi, or Fukuoka.", source: "Zennoh R6 tencha table", mapX: 65, mapY: 212, lat: 35.501, lng: 134.238 },
  { id: "rg14", name: "Saitama", subregion: "Sayama area", kanji: "埼玉", production: 8, style: "Tiny Kanto producer", notes: { umami: 2, sweet: 2, bitter: 3, aroma: 3, body: 2 }, tags: ["Kanto", "small volume", "clean", "brisk"], desc: "Saitama is famous more for Sayama tea than for matcha, and its tencha production is very small. Expect brisker, cleaner, less umami-heavy tendencies than classic Uji matcha.", source: "Zennoh R6 tencha table", mapX: 148, mapY: 130, lat: 35.857, lng: 139.413 },
  { id: "rg15", name: "Kanagawa", subregion: "Ashigara / Tanzawa side", kanji: "神奈川", production: 1, style: "Trace tencha producer", notes: { umami: 2, sweet: 2, bitter: 3, aroma: 3, body: 2 }, tags: ["trace production", "Kanto", "fresh", "niche"], desc: "Kanagawa currently appears only at trace tencha scale. It counts in an exhaustive region guide, but it is better understood as a niche local producer than a recognizable national matcha style.", source: "Zennoh R6 tencha table", mapX: 142, mapY: 151, lat: 35.328, lng: 139.140 },
];
export const REGION_CULTIVAR_SHARES = {
  rg01: [
    { name: "Yabukita", sharePct: 28 },
    { name: "Samidori", sharePct: 22 },
    { name: "Gokou", sharePct: 18 },
    { name: "Asahi", sharePct: 16 },
    { name: "Ujihikari", sharePct: 9 },
  ],
  rg02: [
    { name: "Yabukita", sharePct: 63 },
    { name: "Okumidori", sharePct: 14 },
    { name: "Saemidori", sharePct: 10 },
    { name: "Asahi", sharePct: 7 },
    { name: "Samidori", sharePct: 4 },
  ],
  rg03: [
    { name: "Yabukita", sharePct: 42 },
    { name: "Saemidori", sharePct: 21 },
    { name: "Okumidori", sharePct: 14 },
    { name: "Asatsuyu", sharePct: 12 },
    { name: "Yutakamidori", sharePct: 8 },
  ],
  rg04: [
    { name: "Yabukita", sharePct: 74 },
    { name: "Okumidori", sharePct: 9 },
    { name: "Saemidori", sharePct: 6 },
    { name: "Tsuyuhikari", sharePct: 5 },
    { name: "Kanayamidori", sharePct: 3 },
  ],
  rg05: [
    { name: "Yutakamidori", sharePct: 34 },
    { name: "Yabukita", sharePct: 28 },
    { name: "Saemidori", sharePct: 16 },
    { name: "Asatsuyu", sharePct: 11 },
    { name: "Okumidori", sharePct: 7 },
  ],
  rg06: [
    { name: "Yabukita", sharePct: 70 },
    { name: "Okumidori", sharePct: 10 },
    { name: "Saemidori", sharePct: 8 },
    { name: "Kanayamidori", sharePct: 5 },
    { name: "Asatsuyu", sharePct: 4 },
  ],
  rg07: [
    { name: "Yabukita", sharePct: 55 },
    { name: "Samidori", sharePct: 14 },
    { name: "Gokou", sharePct: 10 },
    { name: "Okumidori", sharePct: 9 },
    { name: "Asahi", sharePct: 6 },
  ],
  rg08: [
    { name: "Yabukita", sharePct: 66 },
    { name: "Okumidori", sharePct: 12 },
    { name: "Saemidori", sharePct: 8 },
    { name: "Samidori", sharePct: 6 },
    { name: "Gokou", sharePct: 4 },
  ],
  rg09: [
    { name: "Yutakamidori", sharePct: 39 },
    { name: "Yabukita", sharePct: 27 },
    { name: "Saemidori", sharePct: 15 },
    { name: "Asatsuyu", sharePct: 10 },
    { name: "Okumidori", sharePct: 7 },
  ],
  rg10: [
    { name: "Yabukita", sharePct: 48 },
    { name: "Saemidori", sharePct: 16 },
    { name: "Yutakamidori", sharePct: 14 },
    { name: "Asatsuyu", sharePct: 11 },
    { name: "Okumidori", sharePct: 7 },
  ],
  rg11: [
    { name: "Yabukita", sharePct: 52 },
    { name: "Saemidori", sharePct: 16 },
    { name: "Yutakamidori", sharePct: 13 },
    { name: "Asatsuyu", sharePct: 10 },
    { name: "Okumidori", sharePct: 7 },
  ],
  rg12: [
    { name: "Yabukita", sharePct: 62 },
    { name: "Okumidori", sharePct: 14 },
    { name: "Saemidori", sharePct: 10 },
    { name: "Kanayamidori", sharePct: 6 },
    { name: "Asatsuyu", sharePct: 5 },
  ],
  rg13: [
    { name: "Yabukita", sharePct: 70 },
    { name: "Okumidori", sharePct: 10 },
    { name: "Saemidori", sharePct: 8 },
    { name: "Kanayamidori", sharePct: 5 },
    { name: "Asatsuyu", sharePct: 4 },
  ],
  rg14: [
    { name: "Yabukita", sharePct: 76 },
    { name: "Saemidori", sharePct: 8 },
    { name: "Okumidori", sharePct: 6 },
    { name: "Kanayamidori", sharePct: 5 },
    { name: "Asatsuyu", sharePct: 3 },
  ],
  rg15: [
    { name: "Yabukita", sharePct: 82 },
    { name: "Okumidori", sharePct: 6 },
    { name: "Saemidori", sharePct: 4 },
    { name: "Kanayamidori", sharePct: 3 },
    { name: "Asatsuyu", sharePct: 2 },
  ],
};
export const REGIONS = [
  {
    id: "rg01",
    name: "Uji",
    prefecture: "Kyoto",
    area: "Uji / Southern Kyoto",
    map: { x: 70, y: 64 },
    status: "Historic ceremonial center",
    bestFor: "Classic high-ceremonial matcha and tea-school styles",
    notes: { umami: 5, sweet: 4, bitter: 1, aroma: 4, body: 5 },
    tags: ["refined", "ceremonial", "deep umami", "oishita heritage"],
    desc: "Japan's best-known ceremonial matcha region. Uji sets the reference point for elegant umami, polish, structure, and traditional tea-culture blending. In practice, Uji-style matcha often tastes calm, layered, and composed rather than loud.",
    src: "MAFF Uji Tea; Kyoto Prefecture tea pages",
  },
  {
    id: "rg02",
    name: "Yame",
    prefecture: "Fukuoka",
    area: "Yame region / Yabe River basin",
    map: { x: 18, y: 84 },
    status: "Shaded-tea stronghold",
    bestFor: "Rich, mellow, fog-grown shaded teas and premium matcha",
    notes: { umami: 5, sweet: 4, bitter: 1, aroma: 4, body: 4 },
    tags: ["mellow", "rich", "misty terroir", "full-bodied"],
    desc: "Yame is best known for deeply shaded premium teas and has the fog, mountain shelter, and day-night temperature swings that favor concentrated umami. Its matcha direction tends to feel rich, mellow, and rounded with strong depth.",
    src: "Fukuoka Prefecture Yame tea pages; MAFF Yame GI background",
  },
  {
    id: "rg03",
    name: "Nishio",
    prefecture: "Aichi",
    area: "Nishio / Anjo",
    map: { x: 78, y: 74 },
    status: "GI matcha production hub",
    bestFor: "Mellow daily-to-premium matcha and foodservice-quality consistency",
    notes: { umami: 4, sweet: 4, bitter: 1, aroma: 4, body: 4 },
    tags: ["mellow", "long umami", "brick ovens", "tana shading"],
    desc: "Nishio is one of Japan's biggest true matcha production zones and has a GI-protected identity. Official descriptions emphasize vivid color, elegant aroma, mellow texture, and umami that lingers without harshness.",
    src: "MAFF Nishio Matcha GI; Nishio City; Aichi Prefecture",
  },
  {
    id: "rg04",
    name: "Shizuoka",
    prefecture: "Shizuoka",
    area: "Makinohara / Kakegawa / Tenryu and wider prefecture",
    map: { x: 84, y: 69 },
    status: "Large-scale modern tea powerhouse",
    bestFor: "Balanced to brighter matcha, efficient modern production, broad style range",
    notes: { umami: 3, sweet: 3, bitter: 2, aroma: 3, body: 3 },
    tags: ["balanced", "fresh", "modern", "deep-steamed influence"],
    desc: "Shizuoka is historically Japan's dominant tea prefecture and is actively expanding tencha. Regional tea culture leans fresh, straightforward, and drinkable, so Shizuoka-style matcha often reads as cleaner and brighter than the deepest ceremonial Kyoto bowls.",
    src: "MAFF tea situation report; Shizuoka tencha expansion docs; Shizuoka tea pages",
  },
  {
    id: "rg05",
    name: "Kagoshima",
    prefecture: "Kagoshima",
    area: "Southern Kyushu including Chiran and surrounding districts",
    map: { x: 16, y: 92 },
    status: "Fast-growing tencha leader",
    bestFor: "Vivid modern matcha, cultivar diversity, broad price-quality range",
    notes: { umami: 4, sweet: 3, bitter: 2, aroma: 3, body: 3 },
    tags: ["vivid", "modern", "cultivar-diverse", "broad style range"],
    desc: "Kagoshima is now the largest tencha-producing prefecture by volume. Its warm climate and broad cultivar mix create huge stylistic range, but the region is especially associated with vivid color, freshness, and scalable modern production.",
    src: "MAFF tea situation report; Kagoshima Prefecture tea pages",
  },
  {
    id: "rg06",
    name: "Ise",
    prefecture: "Mie",
    area: "Hokusei and wider Mie tea areas",
    map: { x: 75, y: 72 },
    status: "Kabuse-heavy region with tencha overlap",
    bestFor: "Mellow shaded teas, softer umami, Uji-linked leaf supply",
    notes: { umami: 4, sweet: 3, bitter: 2, aroma: 3, body: 3 },
    tags: ["mellow", "beautiful green", "covered aroma", "kabuse influence"],
    desc: "Mie is better known for kabuse-cha than pure matcha branding, but official sources note tencha production as well, especially in the Hokusei area. Regionally the cup direction tends toward mellow, covered-leaf sweetness with a soft green profile.",
    src: "MAFF Ise Tea; Uji Tea regional definition",
  },
  {
    id: "rg07",
    name: "Yamato",
    prefecture: "Nara",
    area: "Yamato Highlands / Nara tea areas",
    map: { x: 68, y: 68 },
    status: "Historic highland tencha region",
    bestFor: "Fragrant, cooler-climate teas and small-scale historic matcha supply",
    notes: { umami: 3, sweet: 3, bitter: 2, aroma: 4, body: 3 },
    tags: ["highland-grown", "aromatic", "historic", "cooler climate"],
    desc: "Nara matters because Yamato Tea officially includes tencha and because Nara leaf is part of the broader Uji processing definition. Higher elevations and strong day-night swings point to fragrant, lively, aromatic teas rather than the softest coastal-style sweetness.",
    src: "MAFF Yamato Tea; Nara Prefecture Yamato Tea",
  },
];

export function normalizeText(value = "") {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, " ")
    .trim();
}


export function schoolFilterLabel(value) {
  return value === "San-Senke Favored" ? "San-Senke favored" : value;
}

export function getProducerMeta(producer) {
  return PRODUCER_META[producer] ?? {
    short: producer,
    compact: producer,
    full: producer,
    chipBg: "#5a4a30",
    chipColor: "#f5eed8",
  };
}

export function producerLabel(producer) {
  return getProducerMeta(producer).short;
}

export function producerCompactLabel(producer) {
  return getProducerMeta(producer).compact;
}

export function producerFullLabel(producer) {
  return getProducerMeta(producer).full;
}

export function producerChipStyle(producer) {
  const { chipBg, chipColor } = getProducerMeta(producer);
  return { background: chipBg, color: chipColor };
}

export function extractPriceValue(price) {
  if (!price) return null;
  const match = price.match(/\$([\d.]+)/);
  return match ? Number(match[1]) : null;
}

export function formatTonnes(tonnes) {
  if (tonnes >= 100) return Math.round(tonnes).toLocaleString();
  if (tonnes >= 10) return tonnes.toFixed(1).replace(/\.0$/, "");
  return tonnes.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function getTopCultivarsByRegion(region, limit = 5) {
  const mixes = REGION_CULTIVAR_SHARES[region.id] ?? [];
  return mixes.slice(0, limit).map((item, index) => {
    const rawTonnes = (region.production * item.sharePct) / 100;
    const precision = rawTonnes >= 100 ? 0 : rawTonnes >= 10 ? 1 : 2;
    return {
      rank: index + 1,
      name: item.name,
      sharePct: item.sharePct,
      tonnes: Number(rawTonnes.toFixed(precision)),
    };
  });
}
