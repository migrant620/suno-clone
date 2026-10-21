import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

type Node = ['path', { d: string }] | ['circle', { cx: number; cy: number; r: number }] | ['rect', { x: number; y: number; width: number; height: number; rx: number }];
interface LineIconProps {
  size?: number; color?: string; strokeWidth?: number; fill?: string; style?: StyleProp<ViewStyle>;
  accessible?: boolean; 'aria-hidden'?: boolean;
}

function lineIcon(name: string, nodes: Node[]) {
  function LineIcon({ size = 24, color = 'currentColor', strokeWidth = 2, fill = 'none', style, 'aria-hidden': hidden }: LineIconProps) {
    const shared = { fill, stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
    const css = (StyleSheet.flatten(style) || undefined) as React.CSSProperties | undefined;
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...shared} className={`lucide lucide-${name}`} style={css} aria-hidden={hidden || undefined}>
      {nodes.map(([tag, attrs], index) => React.createElement(tag, { key: index, ...shared, ...attrs }))}
    </svg>;
  }
  LineIcon.displayName = name;
  return LineIcon;
}

export const ChevronLeft = lineIcon('chevron-left', [['path', { d: 'm15 18-6-6 6-6' }]]);
export const Library = lineIcon('library', [['path', { d: 'm16 6 4 14' }], ['path', { d: 'M12 6v14' }], ['path', { d: 'M8 8v12' }], ['path', { d: 'M4 4v16' }]]);
export const Pause = lineIcon('pause', [['rect', { x: 14, y: 3, width: 5, height: 18, rx: 1 }], ['rect', { x: 5, y: 3, width: 5, height: 18, rx: 1 }]]);
export const Play = lineIcon('play', [['path', { d: 'M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z' }]]);
export const Redo2 = lineIcon('redo-2', [['path', { d: 'm15 14 5-5-5-5' }], ['path', { d: 'M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13' }]]);
export const Search = lineIcon('search', [['path', { d: 'm21 21-4.34-4.34' }], ['circle', { cx: 11, cy: 11, r: 8 }]]);
export const Sparkle = lineIcon('sparkle', [['path', { d: 'M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z' }]]);
export const Square = lineIcon('square', [['rect', { width: 18, height: 18, x: 3, y: 3, rx: 2 }]]);
export const Undo2 = lineIcon('undo-2', [['path', { d: 'M9 14 4 9l5-5' }], ['path', { d: 'M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11' }]]);
export const Upload = lineIcon('upload', [['path', { d: 'M12 3v12' }], ['path', { d: 'm17 8-5-5-5 5' }], ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }]]);
export const X = lineIcon('x', [['path', { d: 'M18 6 6 18' }], ['path', { d: 'm6 6 12 12' }]]);

export interface GradientRingProps { id: string; width: number; height: number }
export function GradientRing({ id, width, height }: GradientRingProps) {
  return <svg aria-hidden width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
    <defs><linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0" stopColor="#FF2997" /><stop offset="0.5" stopColor="#FF176C" /><stop offset="0.8" stopColor="#FF7800" /><stop offset="1" stopColor="#FFB000" /></linearGradient></defs>
    <rect x={0.75} y={0.75} width={width - 1.5} height={height - 1.5} rx={(height - 1.5) / 2} fill="none" stroke={`url(#${id})`} strokeWidth={1.5} />
  </svg>;
}
