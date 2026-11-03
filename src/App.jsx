import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import Sheet from "./Sheet.jsx";
import MapGestures from "./MapGestures.jsx";
import { tick } from "./motion.js";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  CompareIcon,
  LeafIcon,
  MapIcon,
  MinusIcon,
  NetworkIcon,
  PlusIcon,
  ResetIcon,
  SearchIcon,
  TeaIcon,
} from "./icons.jsx";
import {
  SAN_SENKE_SCHOOLS,
  SCHOOL_FILTERS,
  SCHOOL_CHIP_STYLES,
  TEAS,
  CATS,
  PRODS,
  PROFILE_ROWS,
  CULTIVAR_PROFILE_ROWS,
  REGION_PROFILE_ROWS,
  NOTES_FIELDS,
  NETWORK_NOTES_FIELDS,
  MAX_TEA_DIST,
  CAT_COLORS_GRAPH,
  noteDist,
  getSimilarItems,
  getSimilarTeas,
  CULTIVARS,
  MATCHA_REGIONS,
  normalizeText,
  schoolFilterLabel,
  producerLabel,
  producerCompactLabel,
  producerFullLabel,
  producerChipStyle,
  extractPriceValue,
  formatTonnes,
  getTopCultivarsByRegion,
} from "./data.js";

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

const SECTIONS = [
  { id: "teas", title: "Teas", tab: "Teas", icon: <TeaIcon />, count: TEAS.length },
  { id: "cultivars", title: "Cultivars", tab: "Cultivars", icon: <LeafIcon />, count: CULTIVARS.length },
  { id: "regions", title: "Regions", tab: "Regions", icon: <MapIcon />, count: MATCHA_REGIONS.length },
  { id: "network", title: "Flavor Network", tab: "Network", icon: <NetworkIcon />, count: null },
];

const TEA_SORTS = [
  ["rating", "Highest Rating"],
  ["alpha", "Name"],
  ["grade", "Available First"],
  ["umami", "Most Umami"],
];
const CULTIVAR_SORTS = [
  ["alpha", "Name"],
  ["umami", "Most Umami"],
  ["sweet", "Sweetest"],
  ["aroma", "Most Aromatic"],
  ["bitter", "Least Bitter"],
];
const REGION_SORTS = [
  ["production", "Most Production"],
  ["alpha", "Name"],
  ["umami", "Most Umami"],
  ["sweet", "Sweetest"],
  ["aroma", "Most Aromatic"],
];
const NETWORK_MODES = [
  { id: "teas", label: "Teas" },
  { id: "cultivars", label: "Cultivars" },
  { id: "regions", label: "Regions" },
];

const findTea = (id) => TEAS.find((tea) => tea.id === id);
const findCultivar = (id) => CULTIVARS.find((cultivar) => cultivar.id === id);
const findRegion = (id) => MATCHA_REGIONS.find((region) => region.id === id);
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// ---------------------------------------------------------------------------
// Small hooks
// ---------------------------------------------------------------------------

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

// True once the element has scrolled under the top edge – used to fade in the
// toolbar material only when content actually slides underneath it.
function useStuck() {
  const sentinelRef = useRef(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [sentinelRef, stuck];
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function Stars({ r }) {
  const rounded = Math.round(r);
  return (
    <span className="stars" aria-label={`Rated ${r.toFixed(1)} out of 5`}>
      <span aria-hidden="true">
        {"★".repeat(rounded)}
        <span className="stars-empty">{"★".repeat(5 - rounded)}</span>
      </span>
      <span className="stars-value">{r.toFixed(1)}</span>
    </span>
  );
}

function ProfileBars({ rows, notes }) {
  return (
    <div className="bars">
      {rows.map(([label, key, color]) => (
        <div className="bar" key={key}>
          <span className="bar-label">{label}</span>
          <span className="bar-track">
            <span className="bar-fill" style={{ "--w": `${notes[key] * 20}%`, "--color": color }} />
          </span>
          <span className="bar-value">{notes[key]}</span>
        </div>
      ))}
    </div>
  );
}

function Chip({ children, tone, style }) {
  return (
    <span className={`chip${tone ? ` chip--${tone}` : ""}`} style={style}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return <h4 className="section-label">{children}</h4>;
}

function CompareToggle({ compared, onToggle, name }) {
  return (
    <button
      type="button"
      className={`compare-toggle pressable${compared ? " is-on" : ""}`}
      aria-pressed={compared}
      aria-label={compared ? `Remove ${name} from compare` : `Add ${name} to compare`}
      title={compared ? "Remove from Compare" : "Add to Compare"}
      onClick={(event) => {
        event.stopPropagation();
        if (!compared) tick();
        onToggle();
      }}
    >
      <span className="compare-toggle-face">{compared ? <CheckIcon /> : <PlusIcon />}</span>
    </button>
  );
}

function CompareButtonWide({ compared, onToggle }) {
  return (
    <button
      type="button"
      className={`btn pressable ${compared ? "btn--tinted" : "btn--filled"}`}
      aria-pressed={compared}
      onClick={() => {
        if (!compared) tick();
        onToggle();
      }}
    >
      {compared ? <CheckIcon /> : <PlusIcon />}
      {compared ? "In Compare" : "Add to Compare"}
    </button>
  );
}

function SearchField({ value, onChange, placeholder, inputRef }) {
  return (
    <label className="search">
      <SearchIcon />
      <input
        ref={inputRef}
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={placeholder}
      />
      {value && (
        <button type="button" className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
          <CloseIcon />
        </button>
      )}
    </label>
  );
}

function SortMenu({ value, onChange, options }) {
  const current = options.find(([id]) => id === value)?.[1];
  return (
    <label className="menu-button pressable">
      <span className="menu-button-label">{current}</span>
      <ChevronDownIcon />
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label="Sort by">
        {options.map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChipRow({ label, options, value, onChange, renderLabel, counts }) {
  return (
    <div className="filter-row">
      <span className="filter-row-label">{label}</span>
      <div className="chip-scroller" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            className={`filter-chip pressable${value === option ? " is-on" : ""}`}
            onClick={() => onChange(option)}
          >
            {renderLabel ? renderLabel(option) : option}
            {counts && <span className="filter-chip-count">{counts[option]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function Segmented({ options, value, onChange, label }) {
  const index = Math.max(0, options.findIndex((option) => option.id === value));
  return (
    <div className="segmented" role="radiogroup" aria-label={label} style={{ "--count": options.length, "--index": index }}>
      <span className="segmented-thumb" aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={option.id === value}
          className={`segmented-item${option.id === value ? " is-on" : ""}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function InfoList({ rows }) {
  const visible = rows.filter(([, value]) => value);
  if (!visible.length) return null;
  return (
    <dl className="info-list">
      {visible.map(([label, value]) => (
        <div className="info-row" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TagList({ tags }) {
  return (
    <div className="chips">
      {tags.map((tag) => (
        <Chip key={tag} tone="quiet">
          {tag}
        </Chip>
      ))}
    </div>
  );
}

function EmptyState({ children }) {
  return <div className="empty-state">{children}</div>;
}

function cardKeyHandler(onOpen) {
  return (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };
}

// ---------------------------------------------------------------------------
// Catalog cards
// ---------------------------------------------------------------------------

function TeaChips({ tea, showSchool = true }) {
  return (
    <div className="chips">
      <Chip style={producerChipStyle(tea.producer)} tone="solid">
        {producerLabel(tea.producer)}
      </Chip>
      <Chip>{tea.sub}</Chip>
      {tea.favoredSchool && (
        <Chip tone="solid" style={SCHOOL_CHIP_STYLES[tea.favoredSchool]}>
          {tea.favoredSchool} favored
        </Chip>
      )}
      {showSchool && tea.school && !tea.favoredSchool && <Chip tone="quiet">{tea.school}</Chip>}
      {tea.status === "limited" && <Chip tone="warn">Limited</Chip>}
    </div>
  );
}

function TeaCard({ tea, compared, onOpen, onCompareToggle }) {
  return (
    <article
      id={`tea-card-${tea.id}`}
      className={`card pressable${compared ? " is-compared" : ""}${tea.status === "limited" ? " is-limited" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`${tea.name}, ${producerCompactLabel(tea.producer)}`}
      onClick={onOpen}
      onKeyDown={cardKeyHandler(onOpen)}
    >
      <div className="card-head">
        <div className="card-titles">
          <h3 className="card-title">{tea.name}</h3>
          <span className="kanji">{tea.kanji}</span>
        </div>
        <CompareToggle compared={compared} onToggle={() => onCompareToggle(tea.id)} name={tea.name} />
      </div>
      <TeaChips tea={tea} />
      <p className="card-tags">{tea.tags.slice(0, 3).join(" · ")}</p>
      <div className="card-foot">
        <Stars r={tea.rating} />
        {tea.price && <span className="card-price">{tea.price}</span>}
      </div>
    </article>
  );
}

function CultivarCard({ cultivar, compared, onOpen, onCompareToggle }) {
  return (
    <article
      className={`card pressable${compared ? " is-compared" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={cultivar.name}
      onClick={onOpen}
      onKeyDown={cardKeyHandler(onOpen)}
    >
      <div className="card-head">
        <div className="card-titles">
          <h3 className="card-title">{cultivar.name}</h3>
          <span className="kanji">{cultivar.kanji}</span>
        </div>
        <CompareToggle compared={compared} onToggle={() => onCompareToggle(cultivar.id)} name={cultivar.name} />
      </div>
      <div className="chips">
        <Chip tone="accent">{cultivar.origin}</Chip>
        <Chip>{cultivar.style}</Chip>
      </div>
      <p className="card-tags">{cultivar.tags.slice(0, 3).join(" · ")}</p>
      <div className="card-foot">
        <span className="card-caption">Best for</span>
        <span className="card-foot-value">{cultivar.bestFor}</span>
      </div>
    </article>
  );
}

function RegionCard({ region, compared, onOpen, onCompareToggle }) {
  const share = Math.round((region.production / MATCHA_REGIONS.reduce((sum, r) => sum + r.production, 0)) * 100);
  return (
    <article
      className={`card pressable${compared ? " is-compared" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={region.name}
      onClick={onOpen}
      onKeyDown={cardKeyHandler(onOpen)}
    >
      <div className="card-head">
        <div className="card-titles">
          <h3 className="card-title">{region.name}</h3>
          <span className="kanji">{region.kanji}</span>
        </div>
        <CompareToggle compared={compared} onToggle={() => onCompareToggle(region.id)} name={region.name} />
      </div>
      <div className="chips">
        <Chip tone="accent">{region.production.toLocaleString()} t tencha</Chip>
        <Chip>{region.subregion}</Chip>
      </div>
      <p className="card-tags">{region.style}</p>
      <div className="card-foot">
        <span className="share-meter" aria-label={`${share}% of national tencha`}>
          <span style={{ "--w": `${Math.max(2, share)}%` }} />
        </span>
        <span className="card-caption">{share < 1 ? "<1" : share}% of Japan</span>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Similar lists
// ---------------------------------------------------------------------------

function SimilarRows({ items, onSelect, comparedIds, onCompareToggle }) {
  return (
    <ul className="similar-list">
      {items.map(({ id, title, subtitle, pct }) => {
        const isCompared = comparedIds?.includes(id);
        return (
          <li key={id} className="similar-row">
            <button
              type="button"
              className="similar-main"
              onClick={onSelect ? () => onSelect(id) : undefined}
              disabled={!onSelect}
            >
              <span className="similar-text">
                <span className="similar-title">{title}</span>
                <span className="similar-subtitle">{subtitle}</span>
              </span>
              <span className="similar-match">
                <span className="similar-pct">{pct}%</span>
                <span className="similar-caption">match</span>
              </span>
              {onSelect && <ChevronRightIcon className="similar-chevron" />}
            </button>
            {onCompareToggle && (
              <CompareToggle compared={isCompared} onToggle={() => onCompareToggle(id)} name={title} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function SimilarTeaList({ tea, onSelect, comparedIds, onCompareToggle }) {
  const items = getSimilarTeas(tea, TEAS, 5).map(({ tea: t, dist }) => ({
    id: t.id,
    title: t.name,
    subtitle: `${t.sub} · ${producerCompactLabel(t.producer)}`,
    pct: Math.max(0, Math.round((1 - dist / MAX_TEA_DIST) * 100)),
  }));
  return <SimilarRows items={items} onSelect={onSelect} comparedIds={comparedIds} onCompareToggle={onCompareToggle} />;
}

function SimilarNetworkList({ item, allItems, noteFields, subtitleFor, onSelect }) {
  const items = getSimilarItems(item, allItems, noteFields, 5).map(({ item: next, dist }) => ({
    id: next.id,
    title: next.name,
    subtitle: subtitleFor(next),
    pct: Math.max(0, Math.round((1 - dist / MAX_TEA_DIST) * 100)),
  }));
  return <SimilarRows items={items} onSelect={onSelect} />;
}

// ---------------------------------------------------------------------------
// Detail sheets
// ---------------------------------------------------------------------------

function TeaDetail({ tea, compared, compareIds, onCompareToggle, onSelect }) {
  return (
    <div className="detail">
      <div className="detail-hero">
        <TeaChips tea={tea} />
        <div className="detail-meta">
          <Stars r={tea.rating} />
          {tea.price && <span className="detail-price">{tea.price}</span>}
        </div>
        <CompareButtonWide compared={compared} onToggle={() => onCompareToggle(tea.id)} />
      </div>

      <p className="detail-desc">{tea.desc}</p>

      <div className="detail-columns">
        <section>
          <SectionLabel>Taste Profile</SectionLabel>
          <div className="group">
            <ProfileBars rows={PROFILE_ROWS} notes={tea.notes} />
          </div>
        </section>
        <section>
          <SectionLabel>Details</SectionLabel>
          <InfoList
            rows={[
              ["Producer", producerFullLabel(tea.producer)],
              ["Category", tea.category],
              ["Grade", tea.grade],
              ["Sizes", tea.sizes?.join(" · ")],
              ["School", tea.school],
              ["Favored by", [tea.favoredBy, tea.favoredBranch].filter(Boolean).join(" · ")],
            ]}
          />
        </section>
      </div>

      <section>
        <SectionLabel>Flavor Notes</SectionLabel>
        <TagList tags={tea.tags} />
      </section>

      <section>
        <SectionLabel>Most Similar Teas</SectionLabel>
        <div className="group group--flush">
          <SimilarTeaList tea={tea} onSelect={onSelect} comparedIds={compareIds} onCompareToggle={onCompareToggle} />
        </div>
      </section>

      {tea.src && <p className="footnote">Sources: {tea.src}</p>}
    </div>
  );
}

function CultivarDetail({ cultivar, compared, onCompareToggle, onSelect }) {
  return (
    <div className="detail">
      <div className="detail-hero">
        <div className="chips">
          <Chip tone="accent">{cultivar.origin}</Chip>
          <Chip>{cultivar.style}</Chip>
        </div>
        <CompareButtonWide compared={compared} onToggle={() => onCompareToggle(cultivar.id)} />
      </div>

      <p className="detail-desc">{cultivar.desc}</p>

      <div className="detail-columns">
        <section>
          <SectionLabel>Cultivar Profile</SectionLabel>
          <div className="group">
            <ProfileBars rows={CULTIVAR_PROFILE_ROWS} notes={cultivar.notes} />
          </div>
        </section>
        <section>
          <SectionLabel>Details</SectionLabel>
          <InfoList
            rows={[
              ["Best for", cultivar.bestFor],
              ["Origin", cultivar.origin],
              ["Style", cultivar.style],
            ]}
          />
        </section>
      </div>

      <section>
        <SectionLabel>Signature Traits</SectionLabel>
        <TagList tags={cultivar.tags} />
      </section>

      <section>
        <SectionLabel>Most Similar Cultivars</SectionLabel>
        <div className="group group--flush">
          <SimilarNetworkList
            item={cultivar}
            allItems={CULTIVARS}
            noteFields={NETWORK_NOTES_FIELDS}
            subtitleFor={(item) => item.origin}
            onSelect={onSelect}
          />
        </div>
      </section>

      {cultivar.src && <p className="footnote">Sources: {cultivar.src}</p>}
    </div>
  );
}

function TopCultivars({ region }) {
  const rows = getTopCultivarsByRegion(region);
  if (!rows.length) return null;
  const max = rows[0].tonnes || 1;
  return (
    <ol className="rank-list">
      {rows.map((item) => (
        <li key={item.name} className="rank-row">
          <span className="rank-n">{item.rank}</span>
          <span className="rank-name">{item.name}</span>
          <span className="rank-meter">
            <span style={{ "--w": `${(item.tonnes / max) * 100}%` }} />
          </span>
          <span className="rank-value">{formatTonnes(item.tonnes)} t</span>
        </li>
      ))}
    </ol>
  );
}

function RegionDetail({ region, compared, onCompareToggle, onSelect }) {
  return (
    <div className="detail">
      <div className="detail-hero">
        <div className="chips">
          <Chip tone="accent">{region.production.toLocaleString()} t tencha</Chip>
          <Chip>{region.subregion}</Chip>
        </div>
        <CompareButtonWide compared={compared} onToggle={() => onCompareToggle(region.id)} />
      </div>

      <p className="detail-desc">{region.desc}</p>

      <div className="detail-columns">
        <section>
          <SectionLabel>Matcha Profile</SectionLabel>
          <div className="group">
            <ProfileBars rows={REGION_PROFILE_ROWS} notes={region.notes} />
          </div>
        </section>
        <section>
          <SectionLabel>Top Cultivars by Tonnes</SectionLabel>
          <div className="group">
            <TopCultivars region={region} />
          </div>
        </section>
      </div>

      <section>
        <SectionLabel>Details</SectionLabel>
        <InfoList
          rows={[
            ["Style", region.style],
            ["Subregion", region.subregion],
            ["Production", `${region.production.toLocaleString()} metric tons of tencha`],
          ]}
        />
      </section>

      <section>
        <SectionLabel>Signature Traits</SectionLabel>
        <TagList tags={region.tags} />
      </section>

      <section>
        <SectionLabel>Most Similar Regions</SectionLabel>
        <div className="group group--flush">
          <SimilarNetworkList
            item={region}
            allItems={MATCHA_REGIONS}
            noteFields={NETWORK_NOTES_FIELDS}
            subtitleFor={(item) => `${item.subregion} · ${item.production} t`}
            onSelect={onSelect}
          />
        </div>
      </section>

      {region.source && <p className="footnote">Sources: {region.source}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compare
// ---------------------------------------------------------------------------

function ClampedText({ text }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="clamped">
      <p className={`compare-desc${expanded ? " is-expanded" : ""}`}>{text}</p>
      <button type="button" className="text-btn" onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Less" : "More"}
      </button>
    </div>
  );
}

function CompareCardShell({ title, subtitle, onRemove, onOpen, children }) {
  return (
    <article className="compare-card">
      <div className="card-head">
        <button type="button" className="card-titles compare-card-open" onClick={onOpen}>
          <h3 className="card-title">{title}</h3>
          <span className="kanji">{subtitle}</span>
        </button>
        <button type="button" className="icon-btn icon-btn--sm pressable" onClick={onRemove} aria-label={`Remove ${title} from compare`}>
          <CloseIcon />
        </button>
      </div>
      {children}
    </article>
  );
}

function TeaCompareCard({ tea, isTop, onRemove, onOpen }) {
  const [showSimilar, setShowSimilar] = useState(false);
  return (
    <CompareCardShell title={tea.name} subtitle={tea.kanji} onRemove={onRemove} onOpen={onOpen}>
      <div className="chips">
        <Chip style={producerChipStyle(tea.producer)} tone="solid">
          {producerLabel(tea.producer)}
        </Chip>
        <Chip>{tea.sub}</Chip>
        {tea.favoredSchool && (
          <Chip tone="solid" style={SCHOOL_CHIP_STYLES[tea.favoredSchool]}>
            {tea.favoredSchool}
          </Chip>
        )}
        {isTop && <Chip tone="gold">Top Rated</Chip>}
      </div>
      <div className="compare-meta">
        <Stars r={tea.rating} />
        {extractPriceValue(tea.price) !== null && <span className="detail-price">${extractPriceValue(tea.price).toFixed(0)}</span>}
      </div>
      <div className="group">
        <ProfileBars rows={PROFILE_ROWS} notes={tea.notes} />
      </div>
      <TagList tags={tea.tags.slice(0, 3)} />
      <ClampedText text={tea.desc} />
      <button type="button" className="text-btn text-btn--row" onClick={() => setShowSimilar((value) => !value)} aria-expanded={showSimilar}>
        Similar teas
        <ChevronDownIcon className={showSimilar ? "flip" : ""} />
      </button>
      {showSimilar && (
        <div className="group group--flush">
          <SimilarTeaList tea={tea} />
        </div>
      )}
    </CompareCardShell>
  );
}

function CultivarCompareCard({ cultivar, onRemove, onOpen }) {
  return (
    <CompareCardShell title={cultivar.name} subtitle={cultivar.kanji} onRemove={onRemove} onOpen={onOpen}>
      <div className="chips">
        <Chip tone="accent">{cultivar.origin}</Chip>
        <Chip>{cultivar.style}</Chip>
      </div>
      <p className="compare-line">
        <strong>Best for</strong> {cultivar.bestFor}
      </p>
      <div className="group">
        <ProfileBars rows={CULTIVAR_PROFILE_ROWS} notes={cultivar.notes} />
      </div>
      <TagList tags={cultivar.tags.slice(0, 3)} />
      <ClampedText text={cultivar.desc} />
    </CompareCardShell>
  );
}

function RegionCompareCard({ region, isLargest, onRemove, onOpen }) {
  return (
    <CompareCardShell title={region.name} subtitle={region.subregion} onRemove={onRemove} onOpen={onOpen}>
      <div className="chips">
        <Chip tone="accent">{region.production.toLocaleString()} t</Chip>
        {isLargest && <Chip tone="gold">Largest</Chip>}
      </div>
      <p className="compare-line">
        <strong>Style</strong> {region.style}
      </p>
      <div className="group">
        <ProfileBars rows={REGION_PROFILE_ROWS} notes={region.notes} />
      </div>
      <div className="group">
        <TopCultivars region={region} />
      </div>
      <TagList tags={region.tags.slice(0, 3)} />
      <ClampedText text={region.desc} />
    </CompareCardShell>
  );
}

// ---------------------------------------------------------------------------
// Flavor network
// ---------------------------------------------------------------------------

const WORLD_W = 820;
const WORLD_H = 560;

function FlavorNetwork({ mode, onOpenDetail }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const rafRef = useRef(0);
  const viewRef = useRef(null); // { s, tx, ty, base } in CSS px
  const sizeRef = useRef({ w: 0, h: 0 });
  const pointersRef = useRef(new Map());
  const gestureRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);
  const SIMILAR_HIGHLIGHT_COUNT = 5;
  const kind = mode === "cultivars" ? "cultivar" : mode === "regions" ? "region" : "tea";
  const items = mode === "cultivars" ? CULTIVARS : mode === "regions" ? MATCHA_REGIONS : TEAS;
  const noteFields = mode === "teas" ? NOTES_FIELDS : NETWORK_NOTES_FIELDS;
  const profileRows = mode === "cultivars" ? CULTIVAR_PROFILE_ROWS : mode === "regions" ? REGION_PROFILE_ROWS : PROFILE_ROWS;
  const edgeThreshold = mode === "teas" ? 2.5 : 2.7;
  const pluralLabel = mode === "cultivars" ? "cultivars" : mode === "regions" ? "regions" : "teas";
  const detailSubtitle =
    mode === "cultivars"
      ? (item) => item.origin
      : mode === "regions"
        ? (item) => `${item.subregion} · ${item.production} t tencha`
        : (item) => producerFullLabel(item.producer);
  const similarSubtitle =
    mode === "cultivars"
      ? (item) => item.origin
      : mode === "regions"
        ? (item) => `${item.subregion} · ${item.production} t`
        : (item) => `${item.sub} · ${producerCompactLabel(item.producer)}`;

  const redraw = useCallback(() => {
    const sim = simRef.current;
    if (sim) sim.draw();
  }, []);

  // Fit the graph's actual bounds (not the whole world) so it fills the
  // canvas on every screen size – big enough to tap on iPhone.
  const fitView = useCallback(() => {
    const { w, h } = sizeRef.current;
    if (!w || !h) return;
    const nodes = simRef.current?.nodes;
    let minX = 0, minY = 0, maxX = WORLD_W, maxY = WORLD_H;
    if (nodes?.length) {
      minX = Math.min(...nodes.map((n) => n.x));
      maxX = Math.max(...nodes.map((n) => n.x));
      minY = Math.min(...nodes.map((n) => n.y));
      maxY = Math.max(...nodes.map((n) => n.y));
    }
    const pad = 36;
    const bw = Math.max(80, maxX - minX);
    const bh = Math.max(80, maxY - minY);
    const base = Math.min((w - pad * 2) / bw, (h - pad * 2 - 40) / bh);
    viewRef.current = {
      base,
      s: base,
      tx: w / 2 - ((minX + maxX) / 2) * base,
      ty: (h - 40) / 2 - ((minY + maxY) / 2) * base + 4,
    };
    if (simRef.current) simRef.current.userMoved = false;
    setZoom(1);
  }, []);

  // Size the canvas to its container at device pixel ratio for crisp Retina rendering.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const resize = () => {
      const w = wrap.clientWidth;
      const h = Math.round(Math.max(360, Math.min(620, w < 600 ? w * 1.15 : w * 0.66)));
      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = { w, h };
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      fitView();
      redraw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", redraw);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", redraw);
    };
  }, [fitView, redraw]);

  useEffect(() => {
    const itemCount = Math.max(1, items.length);
    const orbitX = Math.max(180, Math.min(250, 125 + itemCount * 2.2));
    const orbitY = Math.max(140, Math.min(210, 95 + itemCount * 1.8));

    const nodes = items.map((item, i) => ({
      id: item.id,
      item,
      x: WORLD_W / 2 + Math.cos((2 * Math.PI * i) / itemCount) * orbitX,
      y: WORLD_H / 2 + Math.sin((2 * Math.PI * i) / itemCount) * orbitY,
      vx: 0,
      vy: 0,
    }));

    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = noteDist(nodes[i].item, nodes[j].item, noteFields);
        if (d <= edgeThreshold) edges.push({ i, j, d, strength: 1 - d / (edgeThreshold + 0.1) });
      }
    }

    function draw() {
      const canvas = canvasRef.current;
      const view = viewRef.current;
      const sim = simRef.current;
      if (!canvas || !view || !sim) return;
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const styles = getComputedStyle(canvas);
      const labelColor = styles.getPropertyValue("--label").trim() || "#1c1b17";
      const haloColor = styles.getPropertyValue("--bg-elevated").trim() || "#fff";
      const { hovId, selId, similarIds } = sim;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(view.s * dpr, 0, 0, view.s * dpr, view.tx * dpr, view.ty * dpr);
      const px = 1 / view.s; // one CSS pixel in world units

      for (const e of edges) {
        const ni = nodes[e.i];
        const nj = nodes[e.j];
        const similarEdge = selId && ((ni.id === selId && similarIds.has(nj.id)) || (nj.id === selId && similarIds.has(ni.id)));
        const hi = ni.id === selId || nj.id === selId || ni.id === hovId || nj.id === hovId;
        ctx.beginPath();
        ctx.moveTo(ni.x, ni.y);
        ctx.lineTo(nj.x, nj.y);
        ctx.strokeStyle = similarEdge
          ? `rgba(45,150,160,${e.strength * 0.95})`
          : hi
            ? `rgba(196,128,32,${e.strength * 0.9})`
            : `rgba(140,128,96,${e.strength * 0.3})`;
        ctx.lineWidth = (similarEdge ? 2.4 : hi ? 2 : 0.9) * px;
        ctx.stroke();
      }

      for (const n of nodes) {
        const isSel = n.id === selId;
        const isHov = n.id === hovId;
        const isSimilar = !isSel && similarIds.has(n.id);
        const r = (isSel ? 9 : isHov ? 8 : isSimilar ? 7 : 6) * px;
        if (isSel) {
          ctx.shadowColor = "rgba(196,120,32,.6)";
          ctx.shadowBlur = 14 * px * view.s * dpr;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? "#d4832a" : isHov ? "#4f8a2c" : isSimilar ? "#2d969f" : "#7fa85a";
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = isSel || isHov || isSimilar ? "rgba(0,0,0,.25)" : "rgba(255,255,255,.75)";
        ctx.lineWidth = 1.2 * px;
        ctx.stroke();
      }

      for (const n of nodes) {
        if (n.id !== selId && n.id !== hovId && !(selId && similarIds.has(n.id))) continue;
        const fs = (n.id === selId ? 13 : 12) * px;
        ctx.font = `${n.id === selId ? 600 : 500} ${fs}px -apple-system, BlinkMacSystemFont, system-ui, sans-serif`;
        ctx.lineWidth = 3 * px;
        ctx.lineJoin = "round";
        ctx.strokeStyle = haloColor;
        ctx.strokeText(n.item.name, n.x + 11 * px, n.y + 4 * px);
        ctx.fillStyle = labelColor;
        ctx.fillText(n.item.name, n.x + 11 * px, n.y + 4 * px);
      }
    }

    simRef.current = { nodes, edges, alpha: 1, hovId: null, selId: null, similarIds: new Set(), userMoved: false, draw };

    function step() {
      const sim = simRef.current;
      if (!sim) return;
      sim.alpha *= 0.98;
      const a = sim.alpha;
      for (const n of nodes) {
        n.vx += (WORLD_W / 2 - n.x) * 0.0018;
        n.vy += (WORLD_H / 2 - n.y) * 0.0018;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x || 0.01;
          const dy = nodes[j].y - nodes[i].y || 0.01;
          const d2 = dx * dx + dy * dy;
          const d = Math.sqrt(d2) || 0.01;
          const f = Math.min(700, 700 / d2) * a;
          const fx = (f * dx) / d;
          const fy = (f * dy) / d;
          nodes[i].vx -= fx;
          nodes[i].vy -= fy;
          nodes[j].vx += fx;
          nodes[j].vy += fy;
        }
      }
      for (const e of edges) {
        const ni = nodes[e.i];
        const nj = nodes[e.j];
        const dx = nj.x - ni.x;
        const dy = nj.y - ni.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = (d - (20 + e.d * 45)) * 0.045 * a * e.strength;
        const fx = (f * dx) / d;
        const fy = (f * dy) / d;
        ni.vx += fx;
        ni.vy += fy;
        nj.vx -= fx;
        nj.vy -= fy;
      }
      for (const n of nodes) {
        n.vx *= 0.82;
        n.vy *= 0.82;
        n.x = Math.max(16, Math.min(WORLD_W - 16, n.x + n.vx));
        n.y = Math.max(16, Math.min(WORLD_H - 16, n.y + n.vy));
      }
      if (!sim.userMoved) fitView(); // follow the layout as it settles
      draw();
      if (sim.alpha > 0.004) rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      simRef.current = null;
    };
  }, [items, noteFields, edgeThreshold, fitView]);

  function toCanvas(clientX, clientY) {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function toWorld(point) {
    const { s, tx, ty } = viewRef.current;
    return { x: (point.x - tx) / s, y: (point.y - ty) / s };
  }

  function nodeAt(point, pointerType) {
    const sim = simRef.current;
    if (!sim || !viewRef.current) return null;
    const world = toWorld(point);
    const hit = (pointerType === "touch" ? 22 : 12) / viewRef.current.s;
    let best = null;
    let bestD = hit;
    for (const n of sim.nodes) {
      const d = Math.hypot(n.x - world.x, n.y - world.y);
      if (d <= bestD) {
        best = n;
        bestD = d;
      }
    }
    return best;
  }

  function selectNode(node) {
    const sim = simRef.current;
    if (!sim) return;
    sim.selId = node?.id ?? null;
    sim.similarIds = node
      ? new Set(getSimilarItems(node.item, items, noteFields, SIMILAR_HIGHLIGHT_COUNT).map(({ item }) => item.id))
      : new Set();
    sim.draw();
    setSelected(node?.item ?? null);
  }

  function selectById(id) {
    const node = simRef.current?.nodes.find((n) => n.id === id);
    if (node) selectNode(node);
  }

  function setScale(nextS, anchor) {
    const view = viewRef.current;
    if (!view) return;
    const clamped = Math.max(view.base * 0.5, Math.min(view.base * 8, nextS));
    view.tx = anchor.x - (anchor.x - view.tx) * (clamped / view.s);
    view.ty = anchor.y - (anchor.y - view.ty) * (clamped / view.s);
    view.s = clamped;
    if (simRef.current) simRef.current.userMoved = true;
    setZoom(clamped / view.base);
    redraw();
  }

  // Wheel: trackpad pinch (ctrlKey) and ⌘/Ctrl-scroll zoom; two-finger scroll pans.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const onWheel = (event) => {
      const view = viewRef.current;
      if (!view) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const anchor = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (event.ctrlKey || event.metaKey) {
        const next = view.s * Math.exp(-event.deltaY * 0.01);
        const clamped = Math.max(view.base * 0.5, Math.min(view.base * 8, next));
        view.tx = anchor.x - (anchor.x - view.tx) * (clamped / view.s);
        view.ty = anchor.y - (anchor.y - view.ty) * (clamped / view.s);
        view.s = clamped;
        setZoom(clamped / view.base);
      } else {
        view.tx -= event.deltaX;
        view.ty -= event.deltaY;
      }
      if (simRef.current) simRef.current.userMoved = true;
      simRef.current?.draw();
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, []);

  function onPointerDown(event) {
    const canvas = canvasRef.current;
    canvas.setPointerCapture(event.pointerId);
    const point = toCanvas(event.clientX, event.clientY);
    pointersRef.current.set(event.pointerId, point);
    const view = viewRef.current;
    if (!view) return;
    if (pointersRef.current.size === 1) {
      gestureRef.current = { type: "pan", start: point, tx: view.tx, ty: view.ty, moved: false, pointerType: event.pointerType };
    } else if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      gestureRef.current = {
        type: "pinch",
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        s: view.s,
        world: toWorld(mid),
        moved: true,
      };
    }
  }

  function onPointerMove(event) {
    const view = viewRef.current;
    const sim = simRef.current;
    if (!view || !sim) return;
    const point = toCanvas(event.clientX, event.clientY);

    if (!pointersRef.current.has(event.pointerId)) {
      if (event.pointerType !== "mouse") return;
      const node = nodeAt(point, "mouse");
      const id = node?.id ?? null;
      if (id !== sim.hovId) {
        sim.hovId = id;
        sim.draw();
      }
      canvasRef.current.style.cursor = node ? "pointer" : "grab";
      return;
    }

    pointersRef.current.set(event.pointerId, point);
    const gesture = gestureRef.current;
    if (!gesture) return;
    if (gesture.type === "pan") {
      const dx = point.x - gesture.start.x;
      const dy = point.y - gesture.start.y;
      if (!gesture.moved && Math.hypot(dx, dy) < (gesture.pointerType === "touch" ? 8 : 4)) return;
      gesture.moved = true;
      sim.userMoved = true;
      view.tx = gesture.tx + dx;
      view.ty = gesture.ty + dy;
      canvasRef.current.style.cursor = "grabbing";
      sim.draw();
    } else if (gesture.type === "pinch" && pointersRef.current.size >= 2) {
      const [a, b] = [...pointersRef.current.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const s = Math.max(view.base * 0.5, Math.min(view.base * 8, gesture.s * (dist / gesture.dist)));
      view.s = s;
      sim.userMoved = true;
      view.tx = mid.x - gesture.world.x * s;
      view.ty = mid.y - gesture.world.y * s;
      setZoom(s / view.base);
      sim.draw();
    }
  }

  function onPointerUp(event) {
    const gesture = gestureRef.current;
    const point = toCanvas(event.clientX, event.clientY);
    pointersRef.current.delete(event.pointerId);
    if (gesture?.type === "pan" && !gesture.moved && event.type === "pointerup") {
      selectNode(nodeAt(point, event.pointerType));
    }
    if (pointersRef.current.size === 1 && viewRef.current) {
      const [remaining] = [...pointersRef.current.values()];
      gestureRef.current = { type: "pan", start: remaining, tx: viewRef.current.tx, ty: viewRef.current.ty, moved: true };
    } else if (pointersRef.current.size === 0) {
      gestureRef.current = null;
      if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    }
  }

  function onPointerLeave() {
    const sim = simRef.current;
    if (sim && sim.hovId) {
      sim.hovId = null;
      sim.draw();
    }
  }

  function zoomBy(factor) {
    const { w, h } = sizeRef.current;
    if (viewRef.current) setScale(viewRef.current.s * factor, { x: w / 2, y: h / 2 });
  }

  return (
    <div className="network">
      <div className="network-stage">
        <div ref={wrapRef} className="network-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="network-canvas"
            aria-label={`Flavor similarity network of ${items.length} ${pluralLabel}`}
            role="img"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerLeave}
          />
          <div className="network-controls material">
            <button type="button" className="icon-btn icon-btn--plain pressable" onClick={() => zoomBy(1.25)} aria-label="Zoom in">
              <PlusIcon />
            </button>
            <span className="network-zoom">{zoom.toFixed(1)}×</span>
            <button type="button" className="icon-btn icon-btn--plain pressable" onClick={() => zoomBy(0.8)} aria-label="Zoom out">
              <MinusIcon />
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--plain pressable"
              onClick={() => {
                fitView();
                redraw();
              }}
              aria-label="Reset view"
            >
              <ResetIcon />
            </button>
          </div>
          <div className="network-legend">
            <span><i style={{ background: "#d4832a" }} /> Selected</span>
            <span><i style={{ background: "#2d969f" }} /> Most similar</span>
          </div>
        </div>

        <aside className={`network-detail${selected ? " has-selection" : ""}`} aria-live="polite">
          {selected ? (
            <>
              <div className="network-detail-head">
                <h3 className="card-title">{selected.name}</h3>
                <span className="kanji">{selected.kanji}</span>
                <p className="network-detail-sub">{detailSubtitle(selected)}</p>
              </div>
              <div className="chips">
                {mode === "teas" ? (
                  <>
                    <Chip
                      tone="solid"
                      style={{ background: CAT_COLORS_GRAPH[selected.category], color: "#fff" }}
                    >
                      {selected.category}
                    </Chip>
                    <Chip>{selected.sub}</Chip>
                  </>
                ) : (
                  <Chip>{selected.style}</Chip>
                )}
              </div>
              <div className="group">
                <ProfileBars rows={profileRows} notes={selected.notes} />
              </div>
              <button type="button" className="btn btn--tinted pressable" onClick={() => onOpenDetail(kind, selected.id)}>
                View Details
                <ChevronRightIcon />
              </button>
              <SectionLabel>Most Similar</SectionLabel>
              <div className="group group--flush">
                <SimilarNetworkList
                  item={selected}
                  allItems={items}
                  noteFields={noteFields}
                  subtitleFor={similarSubtitle}
                  onSelect={selectById}
                />
              </div>
            </>
          ) : (
            <div className="network-placeholder">
              <NetworkIcon size={28} />
              <p>Tap a dot to see its flavor profile and the {pluralLabel} closest to it.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Region map
// ---------------------------------------------------------------------------

// Base map tiles. Esri's gray canvas needs no API key and has a native dark
// version. If its tiles fail to load, fall back to OpenStreetMap's own tiles.
const TILE_SOURCES = {
  esri: {
    light: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
    maxNativeZoom: 16,
  },
  osm: {
    light: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom: 19,
  },
};

function BaseTiles({ dark }) {
  const [source, setSource] = useState("esri");
  const failures = useRef(0);
  const tiles = TILE_SOURCES[source];
  return (
    <TileLayer
      key={`${source}-${dark ? "dark" : "light"}`}
      className={dark && source === "osm" ? "map-tiles-dark" : undefined}
      url={dark ? tiles.dark : tiles.light}
      attribution={tiles.attribution}
      maxNativeZoom={tiles.maxNativeZoom}
      eventHandlers={{
        tileerror: () => {
          failures.current += 1;
          if (source === "esri" && failures.current >= 3) setSource("osm");
        },
      }}
    />
  );
}

function JapanRegionMap({ regions, selectedIds, onSelect }) {
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  const forcedTheme = document.documentElement.dataset.theme;
  const dark = forcedTheme ? forcedTheme === "dark" : systemDark;
  const coarse = useMediaQuery("(pointer: coarse)");
  return (
    <section className="map-card">
      <div className="map-frame">
        <MapContainer
          center={[34.6, 135.4]}
          zoom={5}
          style={{ width: "100%", height: "100%" }}
          zoomControl
          attributionControl
          scrollWheelZoom={false}
          touchZoom={false}
          zoomSnap={0}
          zoomDelta={1}
          dragging
          inertiaDeceleration={2200}
        >
          <MapGestures minZoom={4} maxZoom={13} />
          <BaseTiles dark={dark} />
          {regions.map((region) => {
            const selected = selectedIds.includes(region.id);
            const radius = Math.max(7, Math.min(18, 7 + Math.log10(region.production + 1) * 4));
            return (
              <CircleMarker
                key={region.id}
                center={[region.lat, region.lng]}
                radius={selected ? radius + 3 : radius}
                pathOptions={{
                  fillColor: selected ? "#3d8bd0" : "#6aa84f",
                  fillOpacity: selected ? 0.95 : 0.78,
                  color: "#ffffff",
                  weight: 2,
                }}
                eventHandlers={{ click: () => onSelect(region.id) }}
              >
                <Tooltip direction="top" offset={[0, -radius - 4]} opacity={1}>
                  <strong>{region.name}</strong>
                  <br />
                  <span>{region.subregion}</span>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
      <p className="map-caption">
        Tencha-producing prefectures, sized by output. {coarse ? "Pinch to zoom, drag to move. Tap" : "Scroll or pinch to zoom, drag to move. Click"} a marker to open that region.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Chrome: sidebar, tab bar, compare button
// ---------------------------------------------------------------------------

function Sidebar({ view, onChange, compareCounts }) {
  return (
    <aside className="sidebar material material--thick">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">抹</span>
        <div>
          <div className="brand-name">Matcha</div>
          <div className="brand-sub">Compendium</div>
        </div>
      </div>
      <nav className="sidebar-nav" aria-label="Sections">
        {SECTIONS.map(({ id, title, icon, count }) => (
          <button
            key={id}
            type="button"
            className={`sidebar-item pressable${view === id ? " is-on" : ""}`}
            aria-current={view === id ? "page" : undefined}
            data-section={id}
            onClick={() => onChange(id)}
          >
            {icon}
            <span className="sidebar-item-label">{title}</span>
            {compareCounts[id] > 0 ? (
              <span className="sidebar-badge" title={`${compareCounts[id]} in compare`}>
                {compareCounts[id]}
              </span>
            ) : (
              count != null && <span className="sidebar-count">{count}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        {PRODS.slice(1).map((producer) => (
          <div key={producer}>{producerFullLabel(producer)}</div>
        ))}
        <div className="sidebar-hint">
          Press <kbd>/</kbd> to search
        </div>
      </div>
    </aside>
  );
}

function TabBar({ view, onChange }) {
  return (
    <nav className="tabbar material" aria-label="Sections">
      {SECTIONS.map(({ id, tab, icon }) => (
        <button
          key={id}
          type="button"
          className={`tab pressable${view === id ? " is-on" : ""}`}
          aria-current={view === id ? "page" : undefined}
          data-section={id}
          onClick={() => onChange(id)}
        >
          {icon}
          <span>{tab}</span>
        </button>
      ))}
    </nav>
  );
}

// Narrow desktop browser windows: a segmented nav in the header (never the phone tab bar).
function TopNav({ view, onChange }) {
  return (
    <nav className="topnav" aria-label="Sections">
      {SECTIONS.map(({ id, tab, icon }) => (
        <button
          key={id}
          type="button"
          className={`topnav-item pressable${view === id ? " is-on" : ""}`}
          aria-current={view === id ? "page" : undefined}
          data-section={id}
          onClick={() => onChange(id)}
        >
          {icon}
          <span>{tab}</span>
        </button>
      ))}
    </nav>
  );
}

function CompareFab({ count, onClick, label }) {
  const visible = count > 0;
  return (
    <button
      type="button"
      className={`compare-fab pressable${visible ? " is-visible" : ""}`}
      onClick={onClick}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      aria-label={`Compare ${plural(count, label)}`}
    >
      <CompareIcon />
      <span>Compare</span>
      <span className="compare-fab-count">{count}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const [view, setView] = useState("teas");
  const [cat, setCat] = useState("All");
  const [prod, setProd] = useState("All");
  const [schoolFilter, setSchoolFilter] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("rating");
  const [compareIds, setCompareIds] = useState([]);
  const [cultivarQ, setCultivarQ] = useState("");
  const [cultivarSort, setCultivarSort] = useState("alpha");
  const [cultivarCompareIds, setCultivarCompareIds] = useState([]);
  const [regionQ, setRegionQ] = useState("");
  const [regionSort, setRegionSort] = useState("production");
  const [regionCompareIds, setRegionCompareIds] = useState([]);
  const [networkMode, setNetworkMode] = useState("teas");
  const [detail, setDetail] = useState(null); // { kind, id }
  const [lastDetail, setLastDetail] = useState(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const searchRef = useRef(null);
  const [sentinelRef, stuck] = useStuck();

  // Keep the last detail around while the sheet animates out.
  if (detail && detail !== lastDetail) setLastDetail(detail);
  const shownDetail = detail ?? lastDetail;

  const filtered = useMemo(() => {
    const items = TEAS.filter((tea) => {
      if (cat !== "All" && tea.category !== cat) return false;
      if (prod !== "All" && tea.producer !== prod) return false;
      if (schoolFilter === "San-Senke Favored" && !tea.sanSenkeFavored) return false;
      if (SAN_SENKE_SCHOOLS.includes(schoolFilter) && tea.favoredSchool !== schoolFilter) return false;
      if (!q) return true;
      const search = normalizeText(q);
      const searchFields = [
        tea.name,
        tea.kanji,
        tea.desc,
        tea.school ?? "",
        tea.favoredSchool ?? "",
        tea.favoredBy ?? "",
        tea.favoredBranch ?? "",
        tea.sanSenkeFavored ? "san senke favored" : "",
        tea.sanSenkeFavored ? "sanseke favored" : "",
        tea.sub,
        tea.producer,
        ...(tea.tags ?? []),
        ...(tea.aliases ?? []),
      ];
      return searchFields.some((value) => normalizeText(value).includes(search));
    });
    items.sort((a, b) => {
      if (sort === "grade") {
        if (a.status === "active" && b.status === "limited") return -1;
        if (a.status === "limited" && b.status === "active") return 1;
      }
      if (sort === "alpha") return a.name.localeCompare(b.name);
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "umami") return b.notes.umami - a.notes.umami;
      return 0;
    });
    return items;
  }, [cat, prod, schoolFilter, q, sort]);

  const counts = useMemo(() => {
    const c = {};
    CATS.forEach((value) => {
      c[value] = value === "All" ? TEAS.length : TEAS.filter((tea) => tea.category === value).length;
    });
    return c;
  }, []);
  const prodCounts = useMemo(() => {
    const c = {};
    PRODS.forEach((value) => {
      c[value] = value === "All" ? TEAS.length : TEAS.filter((tea) => tea.producer === value).length;
    });
    return c;
  }, []);
  const schoolCounts = useMemo(() => {
    const c = {};
    SCHOOL_FILTERS.forEach((value) => {
      if (value === "All") c[value] = TEAS.length;
      else if (value === "San-Senke Favored") c[value] = TEAS.filter((tea) => tea.sanSenkeFavored).length;
      else c[value] = TEAS.filter((tea) => tea.favoredSchool === value).length;
    });
    return c;
  }, []);
  const favoredProducerSummary = useMemo(() => {
    const tally = filtered.reduce((acc, tea) => {
      if (!tea.sanSenkeFavored) return acc;
      acc[tea.producer] = (acc[tea.producer] ?? 0) + 1;
      return acc;
    }, {});
    return PRODS.slice(1)
      .map((producer) => (tally[producer] ? `${tally[producer]} ${producerCompactLabel(producer)}` : null))
      .filter(Boolean)
      .join(" · ");
  }, [filtered]);

  const comparedTeas = useMemo(() => compareIds.map(findTea).filter(Boolean), [compareIds]);
  const filteredCultivars = useMemo(() => {
    const items = CULTIVARS.filter((cultivar) => {
      if (!cultivarQ) return true;
      const search = normalizeText(cultivarQ);
      return [cultivar.name, cultivar.kanji, cultivar.origin, cultivar.style, cultivar.bestFor, cultivar.desc, ...(cultivar.tags ?? [])].some(
        (value) => normalizeText(value).includes(search)
      );
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
  const comparedCultivars = useMemo(() => cultivarCompareIds.map(findCultivar).filter(Boolean), [cultivarCompareIds]);
  const filteredRegions = useMemo(() => {
    const items = MATCHA_REGIONS.filter((region) => {
      if (!regionQ) return true;
      const search = normalizeText(regionQ);
      return [region.name, region.kanji, region.subregion, region.style, region.desc, ...(region.tags ?? [])].some((value) =>
        normalizeText(value).includes(search)
      );
    });
    items.sort((a, b) => {
      if (regionSort === "production") return b.production - a.production;
      if (regionSort === "alpha") return a.name.localeCompare(b.name);
      if (regionSort === "umami") return b.notes.umami - a.notes.umami;
      if (regionSort === "sweet") return b.notes.sweet - a.notes.sweet;
      if (regionSort === "aroma") return b.notes.aroma - a.notes.aroma;
      return 0;
    });
    return items;
  }, [regionQ, regionSort]);
  const comparedRegions = useMemo(() => regionCompareIds.map(findRegion).filter(Boolean), [regionCompareIds]);

  const toggleIn = (setter) => (id) =>
    setter((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const toggleCompare = toggleIn(setCompareIds);
  const toggleCultivarCompare = toggleIn(setCultivarCompareIds);
  const toggleRegionCompare = toggleIn(setRegionCompareIds);

  const changeView = useCallback((next) => {
    setView(next);
    setCompareOpen(false);
    window.scrollTo({ top: 0 });
  }, []);

  const closeDetail = useCallback(() => setDetail(null), []);
  const closeCompare = useCallback(() => setCompareOpen(false), []);

  // "/" or ⌘K focuses search, like a Mac app.
  useEffect(() => {
    const onKey = (event) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? "");
      if ((event.key === "/" && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
        if (!searchRef.current) return;
        event.preventDefault();
        searchRef.current.focus();
        searchRef.current.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const section = SECTIONS.find((s) => s.id === view);
  const compareCounts = { teas: compareIds.length, cultivars: cultivarCompareIds.length, regions: regionCompareIds.length, network: 0 };

  const subtitle =
    view === "teas"
      ? `${TEAS.length} teas from Uji, Kyoto · ${PRODS.slice(1).map(producerCompactLabel).join(", ")}`
      : view === "cultivars"
        ? `${CULTIVARS.length} major matcha cultivars, compared`
        : view === "regions"
          ? `${MATCHA_REGIONS.length} tencha-producing prefectures, mapped`
          : networkMode === "cultivars"
            ? `${CULTIVARS.length} cultivars mapped by flavor similarity`
            : networkMode === "regions"
              ? `${MATCHA_REGIONS.length} regions mapped by flavor similarity`
              : `${TEAS.length} teas mapped by flavor similarity`;

  // ---- Detail sheet content ----------------------------------------------
  let detailTitle = "";
  let detailSubtitle = "";
  let detailBody = null;
  if (shownDetail) {
    const { kind, id } = shownDetail;
    if (kind === "tea") {
      const tea = findTea(id);
      if (tea) {
        detailTitle = tea.name;
        detailSubtitle = tea.kanji;
        detailBody = (
          <TeaDetail
            tea={tea}
            compared={compareIds.includes(tea.id)}
            compareIds={compareIds}
            onCompareToggle={toggleCompare}
            onSelect={(nextId) => setDetail({ kind: "tea", id: nextId })}
          />
        );
      }
    } else if (kind === "cultivar") {
      const cultivar = findCultivar(id);
      if (cultivar) {
        detailTitle = cultivar.name;
        detailSubtitle = cultivar.kanji;
        detailBody = (
          <CultivarDetail
            cultivar={cultivar}
            compared={cultivarCompareIds.includes(cultivar.id)}
            onCompareToggle={toggleCultivarCompare}
            onSelect={(nextId) => setDetail({ kind: "cultivar", id: nextId })}
          />
        );
      }
    } else if (kind === "region") {
      const region = findRegion(id);
      if (region) {
        detailTitle = region.name;
        detailSubtitle = region.kanji;
        detailBody = (
          <RegionDetail
            region={region}
            compared={regionCompareIds.includes(region.id)}
            onCompareToggle={toggleRegionCompare}
            onSelect={(nextId) => setDetail({ kind: "region", id: nextId })}
          />
        );
      }
    }
  }

  // ---- Compare sheet content ---------------------------------------------
  const compareConfig =
    view === "teas"
      ? { label: "tea", items: comparedTeas, clear: () => setCompareIds([]) }
      : view === "cultivars"
        ? { label: "cultivar", items: comparedCultivars, clear: () => setCultivarCompareIds([]) }
        : view === "regions"
          ? { label: "region", items: comparedRegions, clear: () => setRegionCompareIds([]) }
          : { label: "item", items: [], clear: () => {} };
  const topRatedId = comparedTeas.reduce((best, tea) => (!best || tea.rating > best.rating ? tea : best), null)?.id;
  const largestRegionId = comparedRegions.reduce((best, r) => (!best || r.production > best.production ? r : best), null)?.id;
  const openFromCompare = (kind, id) => {
    setCompareOpen(false);
    setDetail({ kind, id });
  };

  return (
    <div className="app" data-section={view}>
      <Sidebar view={view} onChange={changeView} compareCounts={compareCounts} />

      <main className="main">
        <header className="page-header">
          <div className="eyebrow">抹茶 Matcha Compendium</div>
          <TopNav view={view} onChange={changeView} />
          <h1 className="large-title">{section.title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </header>

        <div ref={sentinelRef} className="toolbar-sentinel" aria-hidden="true" />
        <div className={`toolbar${stuck ? " is-stuck" : ""}`}>
          {view === "teas" && (
            <div className="toolbar-row">
              <SearchField value={q} onChange={setQ} placeholder="Search teas, kanji, flavors, schools" inputRef={searchRef} />
              <SortMenu value={sort} onChange={setSort} options={TEA_SORTS} />
            </div>
          )}
          {view === "cultivars" && (
            <div className="toolbar-row">
              <SearchField value={cultivarQ} onChange={setCultivarQ} placeholder="Search cultivars, flavors, origins" inputRef={searchRef} />
              <SortMenu value={cultivarSort} onChange={setCultivarSort} options={CULTIVAR_SORTS} />
            </div>
          )}
          {view === "regions" && (
            <div className="toolbar-row">
              <SearchField value={regionQ} onChange={setRegionQ} placeholder="Search prefectures, subregions, styles" inputRef={searchRef} />
              <SortMenu value={regionSort} onChange={setRegionSort} options={REGION_SORTS} />
            </div>
          )}
          {view === "network" && (
            <div className="toolbar-row">
              <Segmented options={NETWORK_MODES} value={networkMode} onChange={setNetworkMode} label="Network" />
            </div>
          )}
        </div>

        {view === "teas" && (
          <>
            <div className="filters">
              <ChipRow
                label="Producer"
                options={PRODS}
                value={prod}
                onChange={setProd}
                counts={prodCounts}
                renderLabel={(value) => (value === "All" ? "All" : producerLabel(value))}
              />
              <ChipRow label="Category" options={CATS} value={cat} onChange={setCat} counts={counts} />
              <ChipRow
                label="Favored"
                options={SCHOOL_FILTERS}
                value={schoolFilter}
                onChange={setSchoolFilter}
                counts={schoolCounts}
                renderLabel={(value) => (value === "All" ? "Any School" : schoolFilterLabel(value))}
              />
            </div>
            <p className="results-line">
              {plural(filtered.length, "tea")}
              {schoolFilter !== "All" && ` · favored: ${favoredProducerSummary || "none"}`}
              {comparedTeas.length > 0 && ` · ${comparedTeas.length} in compare`}
            </p>
            <div className="grid">
              {filtered.map((tea) => (
                <TeaCard
                  key={tea.id}
                  tea={tea}
                  compared={compareIds.includes(tea.id)}
                  onOpen={() => setDetail({ kind: "tea", id: tea.id })}
                  onCompareToggle={toggleCompare}
                />
              ))}
            </div>
            {filtered.length === 0 && <EmptyState>No teas match your search.</EmptyState>}
          </>
        )}

        {view === "cultivars" && (
          <>
            <p className="results-line">
              {plural(filteredCultivars.length, "cultivar")}
              {comparedCultivars.length > 0 && ` · ${comparedCultivars.length} in compare`}
            </p>
            <div className="grid">
              {filteredCultivars.map((cultivar) => (
                <CultivarCard
                  key={cultivar.id}
                  cultivar={cultivar}
                  compared={cultivarCompareIds.includes(cultivar.id)}
                  onOpen={() => setDetail({ kind: "cultivar", id: cultivar.id })}
                  onCompareToggle={toggleCultivarCompare}
                />
              ))}
            </div>
            {filteredCultivars.length === 0 && <EmptyState>No cultivars match your search.</EmptyState>}
            <p className="note">
              Major matcha cultivars only. Profiles are directional: shading, terroir, harvest timing, and blending can still change the final cup dramatically.
            </p>
          </>
        )}

        {view === "regions" && (
          <>
            <JapanRegionMap
              regions={MATCHA_REGIONS}
              selectedIds={regionCompareIds}
              onSelect={(id) => setDetail({ kind: "region", id })}
            />
            <p className="results-line">
              {plural(filteredRegions.length, "region")}
              {comparedRegions.length > 0 && ` · ${comparedRegions.length} in compare`}
            </p>
            <div className="grid">
              {filteredRegions.map((region) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  compared={regionCompareIds.includes(region.id)}
                  onOpen={() => setDetail({ kind: "region", id: region.id })}
                  onCompareToggle={toggleRegionCompare}
                />
              ))}
            </div>
            {filteredRegions.length === 0 && <EmptyState>No regions match your search.</EmptyState>}
            <p className="note">
              Exhaustive here means every prefecture in the current national tencha table with nonzero production. The biggest names still define most of the real market. Top-cultivar tonnes are directional estimates using regional cultivar-share assumptions scaled by prefecture tencha output.
            </p>
          </>
        )}

        {view === "network" && (
          <>
            <p className="results-line">Each dot is a {networkMode === "teas" ? "tea" : networkMode.slice(0, -1)}; lines join close flavor neighbors. Drag to pan, pinch to zoom.</p>
            <FlavorNetwork key={networkMode} mode={networkMode} onOpenDetail={(kind, id) => setDetail({ kind, id })} />
          </>
        )}

        <footer className="sources">
          {view === "teas" ? (
            <>
              <p>
                Sources: Sazen Tea · The Steeping Room · Kanso Tea · Wakokoro Tea · Nara Tea Co · Senchoju · Teance · Steepster · Japanese Select · Dragon Tea House · MatchaEasy · MEM Tea · MK &amp; YK Official Catalogs · Community Reviews
              </p>
              <p>Ratings reflect aggregated internet sentiment. Prices approximate. March 2026.</p>
            </>
          ) : view === "cultivars" ? (
            <>
              <p>
                Cultivar guide sources: d:matcha Kyoto · Origin Uji · Matcha &amp; Greens · Matcha Society AU · Onecha · Cha Circle · Kyozen Matcha · Nagocha · educational cultivar comparison pages
              </p>
              <p>Cultivar traits are directional rather than absolute. Blending, shading, harvest timing, and milling style can shift the cup.</p>
            </>
          ) : view === "network" ? (
            <>
              <p>Flavor network uses the same tea, cultivar, and region profile datasets from the other tabs.</p>
              <p>Similarity is profile-distance based (directional), intended for exploration rather than strict scientific ranking.</p>
            </>
          ) : (
            <>
              <p>
                Region guide sources: Zennoh national tea production table (R6 tea-type production) · MAFF Uji Tea · MAFF GI Nishio Matcha · MAFF regional tea pages for Yame, Ise, Kagoshima and related tea regions
              </p>
              <p>
                Exhaustive region list = all prefectures with nonzero tencha production. Flavor profiles for very small producers are directional and less standardized than Kyoto, Aichi, Fukuoka, Shizuoka, Mie, or Kagoshima.
              </p>
              <p>Cultivar top-5 lists are directional estimates derived from regional cultivar prevalence, not official prefectural cultivar census tables.</p>
            </>
          )}
        </footer>
      </main>

      <TabBar view={view} onChange={changeView} />

      {view !== "network" && (
        <CompareFab count={compareConfig.items.length} label={compareConfig.label} onClick={() => setCompareOpen(true)} />
      )}

      <Sheet
        open={compareOpen}
        onClose={closeCompare}
        size="lg"
        label="compare"
        title={`Compare ${compareConfig.label[0].toUpperCase()}${compareConfig.label.slice(1)}s`}
        subtitle={`${compareConfig.items.length} selected`}
        accessory={
          compareConfig.items.length > 0 && (
            <button type="button" className="text-btn" onClick={compareConfig.clear}>
              Clear
            </button>
          )
        }
      >
        {compareConfig.items.length === 0 ? (
          <EmptyState>Nothing to compare yet. Tap + on any card to add it here.</EmptyState>
        ) : (
          <div className="compare-rail">
            {view === "teas" &&
              comparedTeas.map((tea) => (
                <TeaCompareCard
                  key={tea.id}
                  tea={tea}
                  isTop={comparedTeas.length > 1 && tea.id === topRatedId}
                  onRemove={() => toggleCompare(tea.id)}
                  onOpen={() => openFromCompare("tea", tea.id)}
                />
              ))}
            {view === "cultivars" &&
              comparedCultivars.map((cultivar) => (
                <CultivarCompareCard
                  key={cultivar.id}
                  cultivar={cultivar}
                  onRemove={() => toggleCultivarCompare(cultivar.id)}
                  onOpen={() => openFromCompare("cultivar", cultivar.id)}
                />
              ))}
            {view === "regions" &&
              comparedRegions.map((region) => (
                <RegionCompareCard
                  key={region.id}
                  region={region}
                  isLargest={comparedRegions.length > 1 && region.id === largestRegionId}
                  onRemove={() => toggleRegionCompare(region.id)}
                  onOpen={() => openFromCompare("region", region.id)}
                />
              ))}
          </div>
        )}
      </Sheet>

      <Sheet
        open={Boolean(detail)}
        onClose={closeDetail}
        title={detailTitle}
        subtitle={detailSubtitle}
        label={shownDetail ? `${shownDetail.kind}-${shownDetail.id}` : undefined}
      >
        {detailBody}
      </Sheet>
    </div>
  );
}
