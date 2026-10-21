import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export { default as ChevronLeft } from 'lucide-react-native/icons/chevron-left';
export { default as Library } from 'lucide-react-native/icons/library';
export { default as Pause } from 'lucide-react-native/icons/pause';
export { default as Play } from 'lucide-react-native/icons/play';
export { default as Redo2 } from 'lucide-react-native/icons/redo-2';
export { default as Search } from 'lucide-react-native/icons/search';
export { default as Sparkle } from 'lucide-react-native/icons/sparkle';
export { default as Square } from 'lucide-react-native/icons/square';
export { default as Undo2 } from 'lucide-react-native/icons/undo-2';
export { default as Upload } from 'lucide-react-native/icons/upload';
export { default as X } from 'lucide-react-native/icons/x';

export interface GradientRingProps { id: string; width: number; height: number }
export function GradientRing({ id, width, height }: GradientRingProps) {
  return <Svg pointerEvents="none" accessible={false} aria-hidden width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}>
    <Defs><LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%"><Stop offset="0" stopColor="#FF2997" /><Stop offset="0.5" stopColor="#FF176C" /><Stop offset="0.8" stopColor="#FF7800" /><Stop offset="1" stopColor="#FFB000" /></LinearGradient></Defs>
    <Rect x={0.75} y={0.75} width={width - 1.5} height={height - 1.5} rx={(height - 1.5) / 2} fill="none" stroke={`url(#${id})`} strokeWidth={1.5} />
  </Svg>;
}
