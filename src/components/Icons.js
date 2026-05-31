import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export function Icon({ name, size = 18, color = '#fff', strokeWidth = 1.7 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':
      return <Svg {...props}><Path d="M3 11l9-8 9 8" /><Path d="M5 10v10h14V10" /></Svg>;
    case 'user':
      return <Svg {...props}><Circle cx="12" cy="9" r="3.5" /><Path d="M4.5 20c1.4-3.5 4.3-5 7.5-5s6.1 1.5 7.5 5" /><Circle cx="12" cy="12" r="10" /></Svg>;
    case 'globe':
      return <Svg {...props}><Circle cx="12" cy="12" r="9" /><Path d="M3 12h18" /><Path d="M12 3c2.8 3 2.8 15 0 18" /><Path d="M12 3c-2.8 3-2.8 15 0 18" /></Svg>;
    case 'chat':
      return <Svg {...props}><Rect x="3" y="5" width="18" height="13" rx="2" /><Path d="M7 19l-2 3v-3" /></Svg>;
    case 'help':
      return <Svg {...props}><Circle cx="12" cy="12" r="9" /><Path d="M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-2.5 2-2.5 4" /><Circle cx="12" cy="17" r="0.6" fill={color} /></Svg>;
    case 'search':
      return <Svg {...props}><Circle cx="11" cy="11" r="7" /><Path d="M20 20l-3.5-3.5" /></Svg>;
    case 'phone':
      return <Svg {...props}><Path d="M5 4h3l2 5-2 1c1 2.5 3 4.5 5.5 5.5l1-2 5 2v3c0 1-1 2-2 2C9 20.5 3.5 15 3.5 6c0-1 1-2 2-2z" /></Svg>;
    case 'star':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><Path d="M12 2l3 6.9 7.6.7-5.8 5 1.8 7.4L12 18.3 5.4 22l1.8-7.4-5.8-5 7.6-.7z" /></Svg>;
    case 'star-empty':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6"><Path d="M12 3l2.7 6.2 6.8.6-5.2 4.5 1.6 6.7L12 17.5 6.1 21l1.6-6.7L2.5 9.8l6.8-.6z" /></Svg>;
    case 'plus':
      return <Svg {...props}><Path d="M12 5v14M5 12h14" /></Svg>;
    case 'settings':
      return <Svg {...props}><Circle cx="12" cy="12" r="3" /><Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Svg>;
    case 'id-card':
      return <Svg {...props}><Rect x="3" y="5" width="18" height="14" rx="2" /><Circle cx="9" cy="12" r="2" /><Path d="M14 10h4M14 13h3M6 16h12" /></Svg>;
    case 'back':
      return <Svg {...props}><Path d="M15 18l-6-6 6-6" /></Svg>;
    case 'pin':
      return <Svg {...props}><Path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" /><Circle cx="12" cy="9" r="2.5" /></Svg>;
    default:
      return null;
  }
}

export function StarRow({ value = 5, size = 12 }) {
  return (
    <React.Fragment>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon key={i} name={i <= Math.round(value) ? 'star' : 'star-empty'} size={size} color="#fbbf24" />
      ))}
    </React.Fragment>
  );
}
