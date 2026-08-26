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

export function IconSkull(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.5c-4 0-7 2.9-7 6.8 0 2.3 1.1 4 2.6 5.2V18a1 1 0 0 0 1 1h1.2v1.6c0 .5.4.9 1 .9h2.4c.6 0 1-.4 1-.9V19H15a1 1 0 0 0 1-1v-2.5c1.5-1.2 2.6-2.9 2.6-5.2 0-3.9-3-6.8-6.6-6.8z" />
      <circle cx="9.3" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
      <path d="M11 13.2l-0.8 1.6h1.6z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconClock(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

export function IconAlertTriangle(props) {
  return (
    <Svg {...props}>
      <path d="M12 4.2l9 15.6H3z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.7" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconBook(props) {
  return (
    <Svg {...props}>
      <path d="M4 5.5c2-1 5-1 8 0v13c-3-1-6-1-8 0z" />
      <path d="M20 5.5c-2-1-5-1-8 0v13c3-1 6-1 8 0z" />
    </Svg>
  );
}

export function IconFlask(props) {
  return (
    <Svg {...props}>
      <path d="M10 3h4" />
      <path d="M10.5 3v6l-4.8 8.3a1.6 1.6 0 0 0 1.4 2.4h9.8a1.6 1.6 0 0 0 1.4-2.4L13.5 9V3" />
      <path d="M8 15h8" />
    </Svg>
  );
}

export function IconSmartphone(props) {
  return (
    <Svg {...props}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.2" />
      <path d="M11 18.3h2" />
    </Svg>
  );
}

export function IconCopy(props) {
  return (
    <Svg {...props}>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 8.5V5.5A2 2 0 0 0 13.5 3.5H5.5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" />
    </Svg>
  );
}

export function IconWaves(props) {
  return (
    <Svg {...props}>
      <path d="M4 7.5c2.7-2.2 5.3-2.2 8 0s5.3 2.2 8 0" />
      <path d="M4 12c2.7-2.2 5.3-2.2 8 0s5.3 2.2 8 0" />
      <path d="M4 16.5c2.7-2.2 5.3-2.2 8 0s5.3 2.2 8 0" />
    </Svg>
  );
}

export function IconWifi(props) {
  return (
    <Svg {...props}>
      <path d="M4 9.5a12 12 0 0 1 16 0" />
      <path d="M7 13a8 8 0 0 1 10 0" />
      <path d="M10 16.5a4 4 0 0 1 4 0" />
      <circle cx="12" cy="19.5" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  );
}
