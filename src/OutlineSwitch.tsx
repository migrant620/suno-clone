import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSurfaceColors } from './Theme';

const OUTLINE = '#7D7C83';

export function OutlineSwitch({ value, onValueChange, label, scale = 1 }: {
  value: boolean; onValueChange: (value: boolean) => void; label: string; scale?: number;
}) {
  const C = useSurfaceColors();
  const width = 52 * scale; const height = 32 * scale; const border = 2 * scale;
  const thumb = (value ? 24 : 16) * scale;
  const left = value ? width - 4 * scale - thumb : 8 * scale;
  return <Pressable accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: value }} aria-checked={value}
    onPress={() => onValueChange(!value)} style={[O.target, { minWidth: Math.max(48, width), minHeight: 48 }]}>
    <View style={{ width, height, borderRadius: height / 2, borderWidth: border, borderColor: value ? C.ink : OUTLINE, backgroundColor: value ? C.ink : '#FFFFFF' }}>
      <View style={{ position: 'absolute', top: (height - thumb) / 2 - border, left: left - border, width: thumb, height: thumb, borderRadius: thumb / 2, backgroundColor: value ? C.surface : OUTLINE }} />
    </View>
  </Pressable>;
}

const O = StyleSheet.create({
  target: { alignItems: 'center', justifyContent: 'center' },
});
