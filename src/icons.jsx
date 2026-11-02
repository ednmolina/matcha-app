// SF Symbols–style line icons (1.75 stroke, round caps) drawn inline.
function Icon({ children, size = 22, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function TeaIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 9h13v3.5A6.5 6.5 0 0 1 10.5 19 6.5 6.5 0 0 1 4 12.5V9Z" />
      <path d="M17 10.5h1.25a2.25 2.25 0 0 1 0 4.5H16.4" />
      <path d="M8 3.5c-.6.8-.6 1.7 0 2.5M11.5 3.5c-.6.8-.6 1.7 0 2.5" />
    </Icon>
  );
}

export function LeafIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 19c0-8 5-13.5 14-14-.2 9.2-5.8 14-14 14Z" />
      <path d="M5 19 13 11" />
    </Icon>
  );
}

export function MapIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </Icon>
  );
}

export function NetworkIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="6" cy="7" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="12" cy="17.5" r="2.4" />
      <path d="M8.1 7.6 15.8 6.4M7.2 8.9l3.6 6.6M16.9 8l-3.7 7.4" />
    </Icon>
  );
}

export function SearchIcon(props) {
  return (
    <Icon size={17} {...props}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 4.5 4.5" />
    </Icon>
  );
}

export function CloseIcon(props) {
  return (
    <Icon size={16} strokeWidth="2.2" {...props}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </Icon>
  );
}

export function PlusIcon(props) {
  return (
    <Icon size={16} strokeWidth="2.2" {...props}>
      <path d="M12 5.5v13M5.5 12h13" />
    </Icon>
  );
}

export function CheckIcon(props) {
  return (
    <Icon size={16} strokeWidth="2.4" {...props}>
      <path d="m5.5 12.5 4.2 4.2 8.8-9.4" />
    </Icon>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Icon size={14} strokeWidth="2.2" {...props}>
      <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
    </Icon>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Icon size={14} strokeWidth="2.2" {...props}>
      <path d="m9.5 6 6 6-6 6" />
    </Icon>
  );
}

export function CompareIcon(props) {
  return (
    <Icon size={18} {...props}>
      <rect x="3.5" y="5" width="7" height="14" rx="2" />
      <rect x="13.5" y="5" width="7" height="14" rx="2" />
    </Icon>
  );
}

export function MinusIcon(props) {
  return (
    <Icon size={16} strokeWidth="2.2" {...props}>
      <path d="M5.5 12h13" />
    </Icon>
  );
}

export function ResetIcon(props) {
  return (
    <Icon size={16} strokeWidth="2" {...props}>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 4.5v3.8h3.8" />
    </Icon>
  );
}
