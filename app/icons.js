// Small self-contained line-icon set used across the site instead of emoji.
// All icons: 24x24 viewBox, stroke = currentColor, transparent fill.

function Svg({ size = 22, strokeWidth = 2, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconDice(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconLink(props) {
  return (
    <Svg {...props}>
      <path d="M9 15L15 9" />
      <path d="M10.5 6.5l1.6-1.6a4 4 0 0 1 5.6 5.6L16 12.2" />
      <path d="M13.5 17.5l-1.6 1.6a4 4 0 0 1-5.6-5.6L8 11.8" />
    </Svg>
  );
}

export function IconSpy(props) {
  return (
    <Svg {...props}>
      <path d="M3 9c2-1.5 5-2 9-2s7 0.5 9 2" />
      <rect x="4" y="9" width="6.5" height="5" rx="1.4" />
      <rect x="13.5" y="9" width="6.5" height="5" rx="1.4" />
      <path d="M10.5 11.3h3" />
      <path d="M4 11l-2 0.7" />
      <path d="M20 11l2 0.7" />
    </Svg>
  );
}

export function IconRadio(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M8.2 15.8a5.4 5.4 0 0 1 0-7.6" />
      <path d="M15.8 8.2a5.4 5.4 0 0 1 0 7.6" />
      <path d="M5.2 18.8a9.8 9.8 0 0 1 0-13.6" />
      <path d="M18.8 5.2a9.8 9.8 0 0 1 0 13.6" />
    </Svg>
  );
}

export function IconWrench(props) {
  return (
    <Svg {...props}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5l-6 6 2.4 2.4 6-6a4 4 0 0 0 5-5.4l-2.6 2.6-2-2z" />
    </Svg>
  );
}

export function IconHeart(props) {
  return (
    <Svg {...props}>
      <path d="M12 20s-7-4.3-9.3-8.6C1.2 8.4 2.6 5 6 5c2 0 3.3 1.1 6 3.7C14.7 6.1 16 5 18 5c3.4 0 4.8 3.4 3.3 6.4C19 15.7 12 20 12 20z" />
    </Svg>
  );
}

export function IconTrophy(props) {
  return (
    <Svg {...props}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" />
      <path d="M7 5H4a3 3 0 0 0 3 5" />
      <path d="M17 5h3a3 3 0 0 1-3 5" />
      <path d="M12 13v3" />
      <path d="M8.5 20.5h7" />
      <path d="M9.5 16.5h5l0.6 4h-6.2z" />
    </Svg>
  );
}

export function IconEye(props) {
  return (
    <Svg {...props}>
      <path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </Svg>
  );
}

export function IconTarget(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconUser(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1-3.6 4-5.5 7-5.5S18 16.4 19 20" />
    </Svg>
  );
}

export function IconUsers(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c0.8-3.2 3-4.9 5.5-4.9S14.2 15.8 15 19" />
      <path d="M15.5 5.3a3 3 0 0 1 0 5.7" />
      <path d="M15.8 14.1c2 0.5 3.4 2 4 4.9" />
    </Svg>
  );
}

export function IconArrowRight(props) {
  return (
    <Svg {...props}>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </Svg>
  );
}

export function IconLock(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Svg>
  );
}

export function IconRefresh(props) {
  return (
    <Svg {...props}>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 5v6h-6" />
    </Svg>
  );
}

export function IconCheck(props) {
  return (
    <Svg {...props}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Svg>
  );
}

export function IconX(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </Svg>
  );
}
