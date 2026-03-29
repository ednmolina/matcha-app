import { useState, useMemo } from "react";

const TEAS = [
  // ===== YAMAMASA KOYAMAEN — CEREMONIAL =====
  { id:"yk01", name:"Chajyu no Mukashi", kanji:"茶寿の昔", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"Top Grade", price:"$162/30g", sizes:["30g","100g","150g"], status:"active", rating:4.3, notes:{umami:5,sweet:5,bitter:1,astringent:1,body:5}, tags:["toasted seeds","roasted coffee","cocoa","pumpkin seed"], desc:"The pinnacle. Intensely mild yet powerful with a magically light body. Fresh tender green flavors with aromas of toasted seeds and roasted coffee beans. Creamy, full-bodied aftertaste lingers exceptionally long. As koicha, an explosive experience.", src:"Sazen Tea; Ujicha Matcha" },
  { id:"yk02", name:"Kasuga no Mukashi", kanji:"香寿賀の昔", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Grade", price:"$108/30g", sizes:["30g","100g","150g"], status:"active", rating:4.5, notes:{umami:5,sweet:4,bitter:1,astringent:1,body:5}, tags:["cream","explosive fullness","mild sweetness"], desc:"Intense creaminess and uniquely delicious mildness transform into an explosive, majestic full-bodied sensation that lingers on the palate. Less sweet than Chajyu, yet far more so than Kaguraden.", src:"Misora UK; Sazen Tea" },
  { id:"yk03", name:"Kaguraden", kanji:"神楽殿", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Grade", price:"$82/30g", sizes:["30g","100g","150g"], status:"active", rating:4.7, notes:{umami:5,sweet:4,bitter:2,astringent:1,body:5}, tags:["dark chocolate","toasted nuts","coffee","floral"], desc:"Incredible intensity and velvety texture. Dark chocolate and toasted nuts emerge first, followed by coffee aromas, sweet creaminess, and light floral undertones. Exceptionally long, multi-dimensional aftertaste. Often limited to 1 per customer.", src:"The Steeping Room; Kanso Tea" },
  { id:"yk04", name:"Seiun", kanji:"星雲", producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"High Grade", price:"$55/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.4, notes:{umami:4,sweet:4,bitter:1,astringent:1,body:4}, tags:["gentle sweetness","deep umami","smooth finish"], desc:"\"Nebula.\" Harmonious balance of deep umami, gentle sweetness, and a smooth lingering finish. Vibrant green with velvety texture. Composed complexity rather than boldness.", src:"Ujicha Matcha; Sazen Tea" },
  { id:"yk05", name:"Tennouzan", kanji:"天王山", aliases:["Tennozan"], producer:"Yamamasa Koyamaen", category:"Ceremonial", sub:"Koicha", school:null, grade:"Standard Koicha", price:"$39/30g", sizes:["30g","100g","150g","300g"], status:"active", rating:4.5, notes:{umami:4,sweet:4,bitter:1,astringent:1,body:4}, tags:["dark chocolate","cream","lingering sweetness"], desc:"Exceptionally smooth texture with rich umami and deep green hue. Lingering sweetness — a true connoisseur's choice. Rich, creamy dark chocolate character. Recommended for important guests and gifting.", src:"Wakokoro Tea; Matchajp" },
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

const CATS = ["All", "Ceremonial", "Tea School", "Culinary", "Speciality"];
const PRODS = ["All", "Yamamasa Koyamaen", "Marukyu Koyamaen"];
const PROFILE_ROWS = [
  ["Umami", "umami", "#5a8a3a"],
  ["Sweetness", "sweet", "#c4a040"],
  ["Bitterness", "bitter", "#8a5a3a"],
  ["Astringency", "astringent", "#7a6a8a"],
  ["Body", "body", "#4a6a6a"],
];
const CULTIVAR_PROFILE_ROWS = [
  ["Umami", "umami", "#5a8a3a"],
  ["Sweetness", "sweet", "#c4a040"],
  ["Bitterness", "bitter", "#8a5a3a"],
  ["Aroma", "aroma", "#7a6a8a"],
  ["Body", "body", "#4a6a6a"],
];
const CULTIVARS = [
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

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function Stars({ r }) {
  const rounded = Math.round(r);
  const empty = 5 - rounded;
  return (
    <span style={{ color: "#b8860b", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(rounded)}
      {"☆".repeat(empty)}
      <span style={{ color: "#8a7a5a", fontSize: 11, marginLeft: 4 }}>{r.toFixed(1)}</span>
    </span>
  );
}

function Bar({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
      <span
        style={{
          fontSize: 10,
          width: 62,
          textAlign: "right",
          color: "#7a6a4a",
          fontFamily: "'Cormorant Garamond',serif",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 6, background: "#e8e0d0", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            width: `${value * 20}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width .5s ease",
          }}
        />
      </div>
    </div>
  );
}

function extractPriceValue(price) {
  if (!price) return null;
  const match = price.match(/\$([\d.]+)/);
  return match ? Number(match[1]) : null;
}

function ComparePanel({ teas, onRemove, onClear }) {
  const topRatedId = teas.reduce(
    (best, tea) => (!best || tea.rating > best.rating ? tea : best),
    null
  )?.id;

  if (!teas.length) {
    return (
      <section
        style={{
          marginBottom: 16,
          padding: "16px 18px",
          borderRadius: 18,
          border: "1px dashed #c7b799",
          background: "rgba(253,251,247,0.72)",
          color: "#5b4b32",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.5)",
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, color: "#8a7858" }}>
          Compare Tray
        </div>
        <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5 }}>
          Tap <strong>Compare</strong> on any tea to pin it here. Two teas work well, and you can keep adding more for a broader shelf-side scan.
        </div>
      </section>
    );
  }

  return (
      <section
        className="compare-panel"
        style={{
          position: "sticky",
          top: 8,
          zIndex: 5,
          marginBottom: 18,
          padding: "12px 12px 14px",
          borderRadius: 18,
          background: "linear-gradient(140deg,rgba(74,57,33,.96),rgba(50,39,25,.96))",
          color: "#f5eed8",
          boxShadow: "0 14px 36px rgba(48,34,18,.2)",
        border: "1px solid rgba(212,196,165,.35)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, color: "#cdbb98" }}>
            Compare Tray
          </div>
          <div style={{ marginTop: 2, fontSize: 13, fontWeight: 700 }}>
            {teas.length} tea{teas.length > 1 ? "s" : ""} selected
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          style={{
            border: "1px solid rgba(245,238,216,.4)",
            background: "rgba(245,238,216,.08)",
            color: "#f5eed8",
            borderRadius: 999,
            padding: "7px 12px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Clear Compare
        </button>
      </div>

      <div className="compare-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", paddingTop: 12, paddingBottom: 2 }}>
        {teas.map((tea) => (
          <article
            key={tea.id}
            className="compare-card"
            style={{
              flex: "0 0 228px",
              minWidth: 228,
              borderRadius: 16,
              background: "#f8f1e1",
              color: "#3f301f",
              padding: "12px 12px 14px",
              border: "1px solid #d7c7a7",
              boxShadow: "0 6px 18px rgba(31,22,12,.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.05, fontWeight: 700, color: "#2e2012" }}>{tea.name}</h3>
                <div style={{ marginTop: 3, fontSize: 12, color: "#7e6d4d" }}>{tea.kanji}</div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(tea.id)}
                aria-label={`Remove ${tea.name} from compare`}
                style={{
                  border: "none",
                  background: "#eadcc1",
                  color: "#684d29",
                  borderRadius: 999,
                  width: 24,
                  height: 24,
                  fontSize: 14,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: tea.producer === "Yamamasa Koyamaen" ? "#2d4a2d" : "#4a2d2d",
                  color: "#f5eed8",
                  fontWeight: 600,
                }}
              >
                {tea.producer === "Yamamasa Koyamaen" ? "山政" : "丸久"}
              </span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "#e7d8bc", color: "#5a4529" }}>
                {tea.sub}
              </span>
              {tea.id === topRatedId && (
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "#d9c36f", color: "#4d3b10", fontWeight: 700 }}>
                  Top Rated
                </span>
              )}
            </div>

            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <div>
                <Stars r={tea.rating} />
                {tea.price && <div style={{ marginTop: 3, fontSize: 10, color: "#6d5c40", fontWeight: 600 }}>{tea.price}</div>}
              </div>
              {extractPriceValue(tea.price) !== null && (
                <div style={{ textAlign: "right", fontSize: 10, color: "#7d6b51", fontWeight: 600 }}>
                  ${extractPriceValue(tea.price).toFixed(0)}
                </div>
              )}
            </div>

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #dfcfb1" }}>
              <div style={{ fontSize: 10, color: "#8a7a5a", marginBottom: 6, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                Taste Profile
              </div>
              {PROFILE_ROWS.map(([label, key, color]) => (
                <Bar key={key} label={label} value={tea.notes[key]} color={color} />
              ))}
            </div>

            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {tea.tags.slice(0, 3).map((tag) => (
                <span
                  key={`${tea.id}-${tag}`}
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: "#efe6d5",
                    color: "#5c4930",
                    border: "1px solid #dbcab0",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p
              className="compare-description"
              style={{
                margin: "10px 0 0",
                fontSize: 11,
                lineHeight: 1.45,
                color: "#4a3a28",
                fontFamily: "'EB Garamond','Cormorant Garamond',serif",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {tea.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Card({ tea, expanded, onToggle, compared, onCompareToggle }) {
  const lim = tea.status === "limited";

  return (
    <div
      onClick={onToggle}
      style={{
        background: lim ? "linear-gradient(135deg,#faf6ee,#f0e8d8)" : compared ? "#f6efde" : "#fdfbf7",
        border: `1px solid ${compared ? "#9d8650" : lim ? "#c4a35a" : "#d8cdb8"}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
        cursor: "pointer",
        opacity: lim ? 0.88 : 1,
        boxShadow: expanded || compared ? "0 8px 24px rgba(120,100,60,.12)" : "0 1px 4px rgba(0,0,0,.06)",
        transition: "all .3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {lim && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: -28,
            background: "#a0522d",
            color: "#fff",
            fontSize: 9,
            padding: "2px 32px",
            transform: "rotate(45deg)",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          LIMITED
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "#3a2e1e" }}>
              {tea.name}
            </h3>
            <span style={{ fontFamily: "serif", fontSize: 14, color: "#8a7a5a" }}>{tea.kanji}</span>
          </div>

          <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 10,
                padding: "1px 7px",
                borderRadius: 10,
                background: tea.producer === "Yamamasa Koyamaen" ? "#2d4a2d" : "#4a2d2d",
                color: "#f5eed8",
                fontWeight: 600,
              }}
            >
              {tea.producer === "Yamamasa Koyamaen" ? "山政" : "丸久"}
            </span>
            <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 10, background: "#e8dcc8", color: "#5a4a30" }}>
              {tea.sub}
            </span>
            {tea.school && (
              <span
                style={{
                  fontSize: 10,
                  padding: "1px 7px",
                  borderRadius: 10,
                  background: "#d4c4a8",
                  color: "#4a3a20",
                  fontStyle: "italic",
                }}
              >
                {tea.school}
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: "right", minWidth: 86 }}>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onCompareToggle(tea.id);
            }}
            style={{
              marginBottom: 8,
              borderRadius: 999,
              border: compared ? "1px solid #6a5530" : "1px solid #bfae8f",
              background: compared ? "#4d3922" : "#f7f0e2",
              color: compared ? "#f5eed8" : "#5d4a31",
              padding: "6px 10px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {compared ? "Added" : "Compare"}
          </button>
          <div>
            <Stars r={tea.rating} />
            {tea.price && <div style={{ fontSize: 11, color: "#6a5a3a", marginTop: 2, fontWeight: 600 }}>{tea.price}</div>}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 12, borderTop: "1px solid #e0d8c8", paddingTop: 10, animation: "fadeIn .3s ease" }}>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: "#4a3e2e",
              margin: "0 0 10px 0",
              fontFamily: "'EB Garamond','Cormorant Garamond',serif",
            }}
          >
            {tea.desc}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 140px", minWidth: 140 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#8a7a5a",
                  marginBottom: 4,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Taste Profile
              </div>
              {PROFILE_ROWS.map(([label, key, color]) => (
                <Bar key={key} label={label} value={tea.notes[key]} color={color} />
              ))}
            </div>
            <div style={{ flex: "1 1 140px", minWidth: 140 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#8a7a5a",
                  marginBottom: 4,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Flavor Notes
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {tea.tags.map((tag) => (
                  <span
                    key={`${tea.id}-${tag}`}
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: "#eae2d2",
                      color: "#5a4a30",
                      border: "1px solid #d8ccb4",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, color: "#8a7a5a", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                  Sizes
                </div>
                <div style={{ fontSize: 11, color: "#5a4a30", marginTop: 2 }}>{tea.sizes.join(" · ")}</div>
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 10, color: "#8a7a5a", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                  Grade
                </div>
                <div style={{ fontSize: 11, color: "#5a4a30", marginTop: 2 }}>{tea.grade}</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 9, color: "#a09080", marginTop: 8, fontStyle: "italic" }}>Sources: {tea.src}</div>
        </div>
      )}
    </div>
  );
}

function CultivarComparePanel({ cultivars, onRemove, onClear }) {
  if (!cultivars.length) {
    return (
      <section
        style={{
          marginBottom: 16,
          padding: "16px 18px",
          borderRadius: 18,
          border: "1px dashed #c7b799",
          background: "rgba(253,251,247,0.72)",
          color: "#5b4b32",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.5)",
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, color: "#8a7858" }}>
          Cultivar Compare
        </div>
        <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5 }}>
          Tap <strong>Compare</strong> on any cultivar to pin it here and see how varietal traits like umami, sweetness, aroma, and body differ.
        </div>
      </section>
    );
  }

  return (
      <section
        className="compare-panel"
        style={{
          position: "sticky",
          top: 8,
          zIndex: 5,
          marginBottom: 18,
          padding: "12px 12px 14px",
          borderRadius: 18,
          background: "linear-gradient(140deg,rgba(52,70,43,.96),rgba(37,53,31,.96))",
          color: "#eef3e7",
          boxShadow: "0 14px 36px rgba(30,45,22,.2)",
        border: "1px solid rgba(210,226,190,.28)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, color: "#c9dab9" }}>
            Cultivar Compare
          </div>
          <div style={{ marginTop: 2, fontSize: 13, fontWeight: 700 }}>
            {cultivars.length} cultivar{cultivars.length > 1 ? "s" : ""} selected
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          style={{
            border: "1px solid rgba(238,243,231,.35)",
            background: "rgba(238,243,231,.08)",
            color: "#eef3e7",
            borderRadius: 999,
            padding: "7px 12px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Clear Compare
        </button>
      </div>

      <div className="compare-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", paddingTop: 12, paddingBottom: 2 }}>
        {cultivars.map((cultivar) => (
          <article
            key={cultivar.id}
            className="compare-card"
            style={{
              flex: "0 0 232px",
              minWidth: 232,
              borderRadius: 16,
              background: "#f0f5e8",
              color: "#2d321f",
              padding: "12px 12px 14px",
              border: "1px solid #c9d8b7",
              boxShadow: "0 6px 18px rgba(31,22,12,.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.05, fontWeight: 700, color: "#29301d" }}>{cultivar.name}</h3>
                <div style={{ marginTop: 3, fontSize: 12, color: "#6b7854" }}>{cultivar.kanji}</div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(cultivar.id)}
                aria-label={`Remove ${cultivar.name} from compare`}
                style={{
                  border: "none",
                  background: "#d9e5c8",
                  color: "#4a5b31",
                  borderRadius: 999,
                  width: 24,
                  height: 24,
                  fontSize: 14,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "#406237", color: "#eef3e7", fontWeight: 600 }}>
                {cultivar.origin}
              </span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "#dee8cf", color: "#4b5837" }}>
                {cultivar.style}
              </span>
            </div>

            <div style={{ marginTop: 10, fontSize: 11, color: "#52623d", lineHeight: 1.45 }}>
              <strong>Best For:</strong> {cultivar.bestFor}
            </div>

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #d7e1c8" }}>
              <div style={{ fontSize: 10, color: "#768461", marginBottom: 6, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                Cultivar Profile
              </div>
              {CULTIVAR_PROFILE_ROWS.map(([label, key, color]) => (
                <Bar key={key} label={label} value={cultivar.notes[key]} color={color} />
              ))}
            </div>

            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {cultivar.tags.slice(0, 3).map((tag) => (
                <span
                  key={`${cultivar.id}-${tag}`}
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: "#e6eed9",
                    color: "#4a5934",
                    border: "1px solid #cedabf",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p
              className="compare-description"
              style={{
                margin: "10px 0 0",
                fontSize: 11,
                lineHeight: 1.45,
                color: "#3d472d",
                fontFamily: "'EB Garamond','Cormorant Garamond',serif",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {cultivar.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CultivarCard({ cultivar, expanded, compared, onToggle, onCompareToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: compared ? "#eef4e3" : "#fdfbf7",
        border: `1px solid ${compared ? "#6f8a4f" : "#d8cdb8"}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
        cursor: "pointer",
        boxShadow: expanded || compared ? "0 8px 24px rgba(85,110,58,.12)" : "0 1px 4px rgba(0,0,0,.06)",
        transition: "all .3s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "#2f3821" }}>
              {cultivar.name}
            </h3>
            <span style={{ fontFamily: "serif", fontSize: 14, color: "#788567" }}>{cultivar.kanji}</span>
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 10, background: "#355331", color: "#eef3e7", fontWeight: 600 }}>
              {cultivar.origin}
            </span>
            <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 10, background: "#e1ead5", color: "#4d5d39" }}>
              {cultivar.style}
            </span>
          </div>
        </div>

        <div style={{ textAlign: "right", minWidth: 94 }}>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onCompareToggle(cultivar.id);
            }}
            style={{
              marginBottom: 8,
              borderRadius: 999,
              border: compared ? "1px solid #496131" : "1px solid #b7c89f",
              background: compared ? "#3d542b" : "#f0f5e8",
              color: compared ? "#eef3e7" : "#556640",
              padding: "6px 10px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {compared ? "Added" : "Compare"}
          </button>
          <div style={{ fontSize: 11, color: "#5e6e48", fontWeight: 600 }}>{cultivar.bestFor}</div>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 12, borderTop: "1px solid #dfe5d4", paddingTop: 10, animation: "fadeIn .3s ease" }}>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: "#415036",
              margin: "0 0 10px 0",
              fontFamily: "'EB Garamond','Cormorant Garamond',serif",
            }}
          >
            {cultivar.desc}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 160px", minWidth: 160 }}>
              <div style={{ fontSize: 10, color: "#768461", marginBottom: 4, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                Cultivar Profile
              </div>
              {CULTIVAR_PROFILE_ROWS.map(([label, key, color]) => (
                <Bar key={key} label={label} value={cultivar.notes[key]} color={color} />
              ))}
            </div>
            <div style={{ flex: "1 1 160px", minWidth: 160 }}>
              <div style={{ fontSize: 10, color: "#768461", marginBottom: 4, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                Signature Traits
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {cultivar.tags.map((tag) => (
                  <span
                    key={`${cultivar.id}-${tag}`}
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: "#e7eddc",
                      color: "#4d5a3a",
                      border: "1px solid #d1dcc1",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, color: "#768461", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                  Best For
                </div>
                <div style={{ fontSize: 11, color: "#4e5b3b", marginTop: 2 }}>{cultivar.bestFor}</div>
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 10, color: "#768461", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                  Origin
                </div>
                <div style={{ fontSize: 11, color: "#4e5b3b", marginTop: 2 }}>{cultivar.origin}</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 9, color: "#8d9a7a", marginTop: 8, fontStyle: "italic" }}>Sources: {cultivar.src}</div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("teas");
  const [cat, setCat] = useState("All");
  const [prod, setProd] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [sort, setSort] = useState("grade");
  const [compareIds, setCompareIds] = useState([]);
  const [cultivarQ, setCultivarQ] = useState("");
  const [cultivarSort, setCultivarSort] = useState("alpha");
  const [cultivarOpen, setCultivarOpen] = useState(null);
  const [cultivarCompareIds, setCultivarCompareIds] = useState([]);

  const filtered = useMemo(() => {
    const items = TEAS.filter((tea) => {
      if (cat !== "All" && tea.category !== cat) return false;
      if (prod !== "All" && tea.producer !== prod) return false;
      if (!q) return true;

      const search = normalizeText(q);
      const searchFields = [
        tea.name,
        tea.kanji,
        tea.desc,
        tea.school ?? "",
        tea.sub,
        tea.producer,
        ...(tea.tags ?? []),
        ...(tea.aliases ?? []),
      ];

      return searchFields.some((value) => normalizeText(value).includes(search));
    });

    items.sort((a, b) => {
      if (a.status === "active" && b.status === "limited") return -1;
      if (a.status === "limited" && b.status === "active") return 1;
      if (sort === "alpha") return a.name.localeCompare(b.name);
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "umami") return b.notes.umami - a.notes.umami;
      return 0;
    });

    return items;
  }, [cat, prod, q, sort]);

  const counts = useMemo(() => {
    const c = {};
    CATS.forEach((value) => {
      c[value] = value === "All" ? TEAS.length : TEAS.filter((tea) => tea.category === value).length;
    });
    return c;
  }, []);

  const comparedTeas = useMemo(
    () => compareIds.map((id) => TEAS.find((tea) => tea.id === id)).filter(Boolean),
    [compareIds]
  );
  const filteredCultivars = useMemo(() => {
    const items = CULTIVARS.filter((cultivar) => {
      if (!cultivarQ) return true;

      const search = normalizeText(cultivarQ);
      const searchFields = [
        cultivar.name,
        cultivar.kanji,
        cultivar.origin,
        cultivar.style,
        cultivar.bestFor,
        cultivar.desc,
        ...(cultivar.tags ?? []),
      ];

      return searchFields.some((value) => normalizeText(value).includes(search));
    });

    items.sort((a, b) => {
      if (cultivarSort === "alpha") return a.name.localeCompare(b.name);
      if (cultivarSort === "umami") return b.notes.umami - a.notes.umami;
      if (cultivarSort === "sweet") return b.notes.sweet - a.notes.sweet;
      if (cultivarSort === "aroma") return b.notes.aroma - a.notes.aroma;
      if (cultivarSort === "bitter") return a.notes.bitter - b.notes.bitter;
      return 0;
    });

    return items;
  }, [cultivarQ, cultivarSort]);
  const comparedCultivars = useMemo(
    () => cultivarCompareIds.map((id) => CULTIVARS.find((cultivar) => cultivar.id === id)).filter(Boolean),
    [cultivarCompareIds]
  );

  function toggleCompare(id) {
    setCompareIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }
  function toggleCultivarCompare(id) {
    setCultivarCompareIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(255,248,232,.95), rgba(245,240,228,.94) 24%, rgba(235,227,211,.97) 58%, rgba(224,216,196,1) 100%)",
        fontFamily: "'Cormorant Garamond',Georgia,serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=EB+Garamond:ital@0;1&display=swap');@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box}input:focus,select:focus,button:focus{outline:2px solid #b8a070;outline-offset:2px}button{font-family:inherit}::-webkit-scrollbar{height:10px;width:10px}::-webkit-scrollbar-thumb{background:#b6a27c;border-radius:999px}::-webkit-scrollbar-track{background:rgba(255,255,255,.28)}@media (max-width: 480px){.compare-panel{padding:8px 8px 10px!important;border-radius:14px!important;top:4px!important}.compare-scroll{gap:8px!important;padding-top:8px!important}.compare-card{flex-basis:192px!important;min-width:192px!important;padding:9px 9px 10px!important}.compare-description{-webkit-line-clamp:2!important}}`}</style>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 12px 40px 12px" }}>
        <div style={{ textAlign: "center", padding: "28px 0 16px 0" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#8a7a5a", textTransform: "uppercase", fontWeight: 600 }}>
            Complete Compendium
          </div>
          <h1 style={{ margin: "4px 0 2px 0", fontSize: 34, fontWeight: 700, color: "#2a1e0e", lineHeight: 1.1 }}>
            抹茶 Matcha
          </h1>
          <div style={{ fontSize: 14, color: "#6a5a3a", fontStyle: "italic" }}>
            Yamamasa Koyamaen · Marukyu Koyamaen
          </div>
          <div style={{ fontSize: 11, color: "#9a8a6a", marginTop: 4 }}>
            {view === "teas"
              ? `${TEAS.length} teas catalogued · Uji, Kyoto`
              : `${CULTIVARS.length} major matcha cultivars compared · guide mode`}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { id: "teas", label: "Tea Catalog", count: TEAS.length },
            { id: "cultivars", label: "Cultivar Guide", count: CULTIVARS.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              style={{
                flex: "1 1 220px",
                padding: "11px 14px",
                borderRadius: 14,
                border: view === tab.id ? "2px solid #6f7f47" : "1px solid #c8bca4",
                background: view === tab.id ? (tab.id === "cultivars" ? "#445b30" : "#3a2e1e") : "rgba(253,251,247,.84)",
                color: view === tab.id ? "#f5eed8" : "#5a4a30",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {tab.label}
              <span style={{ marginLeft: 8, opacity: 0.7, fontSize: 11 }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {view === "teas" ? (
          <>
            <ComparePanel
              teas={comparedTeas}
              onRemove={(id) => setCompareIds((current) => current.filter((item) => item !== id))}
              onClear={() => setCompareIds([])}
            />

            <div
              style={{
                marginBottom: 16,
                padding: "16px 16px 14px",
                borderRadius: 18,
                border: "1px solid rgba(182,158,119,.35)",
                background: "rgba(253,251,247,.84)",
                boxShadow: "0 10px 30px rgba(75,53,23,.08)",
              }}
            >
              <input
                type="text"
                placeholder="Search name, kanji, flavor, school…"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1px solid #c8bca4",
                  borderRadius: 10,
                  background: "#fdfbf7",
                  fontSize: 13,
                  fontFamily: "inherit",
                  color: "#3a2e1e",
                  marginBottom: 10,
                }}
              />

              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                {PRODS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setProd(value)}
                    style={{
                      flex: "1 1 180px",
                      padding: "8px 4px",
                      border: prod === value ? "2px solid #7a6a3a" : "1px solid #c8bca4",
                      borderRadius: 8,
                      background: prod === value ? "#3a2e1e" : "#fdfbf7",
                      color: prod === value ? "#f5eed8" : "#5a4a30",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {value === "All" ? "Both Houses" : value === "Yamamasa Koyamaen" ? "山政 Yamamasa" : "丸久 Marukyu"}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
                {CATS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCat(value)}
                    style={{
                      padding: "5px 12px",
                      border: cat === value ? "2px solid #8a7a3a" : "1px solid #c8bca4",
                      borderRadius: 20,
                      background: cat === value ? "#5a4a2a" : "transparent",
                      color: cat === value ? "#f5eed8" : "#6a5a3a",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {value} <span style={{ fontSize: 9, opacity: 0.7 }}>({counts[value]})</span>
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: "#8a7a5a", fontWeight: 700, letterSpacing: 1 }}>SORT</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #c8bca4",
                    borderRadius: 6,
                    background: "#fdfbf7",
                    fontSize: 11,
                    fontFamily: "inherit",
                    color: "#4a3e2e",
                    cursor: "pointer",
                  }}
                >
                  <option value="alpha">A-Z</option>
                  <option value="grade">Active first</option>
                  <option value="rating">Highest Rating</option>
                  <option value="umami">Most Umami</option>
                </select>
                <span style={{ fontSize: 10, color: "#9a8a6a", marginLeft: "auto" }}>
                  {filtered.length} results · {comparedTeas.length} comparing
                </span>
              </div>
            </div>

            {filtered.map((tea) => (
              <Card
                key={tea.id}
                tea={tea}
                expanded={open === tea.id}
                compared={compareIds.includes(tea.id)}
                onToggle={() => setOpen(open === tea.id ? null : tea.id)}
                onCompareToggle={toggleCompare}
              />
            ))}

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#9a8a6a", fontStyle: "italic" }}>
                No teas match your search.
              </div>
            )}
          </>
        ) : (
          <>
            <CultivarComparePanel
              cultivars={comparedCultivars}
              onRemove={(id) => setCultivarCompareIds((current) => current.filter((item) => item !== id))}
              onClear={() => setCultivarCompareIds([])}
            />

            <div
              style={{
                marginBottom: 16,
                padding: "16px 16px 14px",
                borderRadius: 18,
                border: "1px solid rgba(141,171,114,.35)",
                background: "rgba(248,252,243,.88)",
                boxShadow: "0 10px 30px rgba(60,85,37,.08)",
              }}
            >
              <input
                type="text"
                placeholder="Search cultivar, flavor, region…"
                value={cultivarQ}
                onChange={(event) => setCultivarQ(event.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1px solid #c6d4b2",
                  borderRadius: 10,
                  background: "#fdfbf7",
                  fontSize: 13,
                  fontFamily: "inherit",
                  color: "#334125",
                  marginBottom: 10,
                }}
              />

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: "#73825e", fontWeight: 700, letterSpacing: 1 }}>SORT</span>
                <select
                  value={cultivarSort}
                  onChange={(event) => setCultivarSort(event.target.value)}
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #c6d4b2",
                    borderRadius: 6,
                    background: "#fdfbf7",
                    fontSize: 11,
                    fontFamily: "inherit",
                    color: "#445333",
                    cursor: "pointer",
                  }}
                >
                  <option value="alpha">A-Z</option>
                  <option value="umami">Most Umami</option>
                  <option value="sweet">Sweetest</option>
                  <option value="aroma">Most Aromatic</option>
                  <option value="bitter">Least Bitter</option>
                </select>
                <span style={{ fontSize: 10, color: "#83906f", marginLeft: "auto" }}>
                  {filteredCultivars.length} results · {comparedCultivars.length} comparing
                </span>
              </div>

              <div style={{ marginTop: 10, fontSize: 11, color: "#6e7b5a", lineHeight: 1.5 }}>
                Major matcha cultivars only. Profiles are directional: shading, terroir, harvest timing, and blending can still change the final cup dramatically.
              </div>
            </div>

            {filteredCultivars.map((cultivar) => (
              <CultivarCard
                key={cultivar.id}
                cultivar={cultivar}
                expanded={cultivarOpen === cultivar.id}
                compared={cultivarCompareIds.includes(cultivar.id)}
                onToggle={() => setCultivarOpen(cultivarOpen === cultivar.id ? null : cultivar.id)}
                onCompareToggle={toggleCultivarCompare}
              />
            ))}

            {filteredCultivars.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#7d8a67", fontStyle: "italic" }}>
                No cultivars match your search.
              </div>
            )}
          </>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            padding: "16px 0",
            borderTop: "1px solid #d0c8b4",
            fontSize: 10,
            color: "#9a8a6a",
            lineHeight: 1.6,
          }}
        >
          {view === "teas" ? (
            <>
              Sources: Sazen Tea · The Steeping Room · Kanso Tea · Wakokoro Tea · Nara Tea Co
              <br />
              Senchoju · Teance · Steepster · Japanese Select · Dragon Tea House · MatchaEasy
              <br />
              MEM Tea · MK & YK Official Catalogs · Community Reviews
              <br />
              <span style={{ fontStyle: "italic" }}>Ratings reflect aggregated internet sentiment. Prices approximate. March 2026.</span>
            </>
          ) : (
            <>
              Cultivar guide sources: d:matcha Kyoto · Origin Uji · Matcha & Greens · Matcha Society AU · Onecha
              <br />
              Cha Circle · Kyozen Matcha · Nagocha · educational cultivar comparison pages
              <br />
              <span style={{ fontStyle: "italic" }}>
                Cultivar traits are directional rather than absolute. Blending, shading, harvest timing, and milling style can shift the cup.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
