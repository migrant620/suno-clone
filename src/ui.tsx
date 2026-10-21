import { useSheetEscape } from './useSheetEscape';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TextProps, View, ViewStyle, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import { Library, Redo2, Undo2 } from './lineIcons';
import { communityGlyphs, ioniconsGlyphs, materialGlyphs } from './iconGlyphs';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from './tokens';
import { useSurfaceColors } from './Theme';
import { Fonts } from './fonts';

function faceReady(family: string): boolean {
  if (Platform.OS !== 'web' || typeof document === 'undefined' || !document.fonts) return true;
  let loaded = false;
  document.fonts.forEach(face => { if (face.family.replace(/["']/g, '') === family && face.status === 'loaded') loaded = true; });
  return loaded;
}
function useFaceReady(family: string): boolean {
  const [ready, setReady] = React.useState(() => faceReady(family));
  React.useEffect(() => {
    if (ready || typeof document === 'undefined' || !document.fonts) return undefined;
    let alive = true;
    const update = () => { if (alive && faceReady(family)) setReady(true); };
    document.fonts.addEventListener('loadingdone', update);
    update();
    return () => { alive = false; document.fonts.removeEventListener('loadingdone', update); };
  }, [family, ready]);
  return ready;
}
type GlyphProps<N extends string> = Omit<TextProps, 'children'> & { name: N; size?: number; color?: string };
function glyphSet<M extends Record<string, number>>(glyphMap: M, family: string) {
  return function GlyphIcon({ name, size = 12, color = 'black', style, ...props }: GlyphProps<Extract<keyof M, string>>) {
    const ready = useFaceReady(family);
    const code = glyphMap[name];
    return <Text selectable={false} allowFontScaling={false} {...props} style={[{ fontSize: size, color: ready ? color : 'transparent' }, style, { fontFamily: family, fontWeight: 'normal', fontStyle: 'normal' }]}>{typeof code === 'number' ? String.fromCodePoint(code) : '?'}</Text>;
  };
}
export const Ionicons = glyphSet(ioniconsGlyphs as Record<keyof typeof ioniconsGlyphs, number>, 'ionicons');
const MaterialIcons = glyphSet(materialGlyphs as Record<keyof typeof materialGlyphs, number>, 'material');
const MaterialCommunityIcons = glyphSet(communityGlyphs as Record<keyof typeof communityGlyphs, number>, 'material-community');

export const C = tokens.colors;
export type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
export function Label({ style, ...props }: TextProps) {
  const colors = useSurfaceColors();
  return <Text {...props} style={[S.text, { color: colors.ink }, style]} />;
}
export function Icon({ name, size = 24, color: suppliedColor }: { name: IconName; size?: number; color?: string }) {
  const colors = useSurfaceColors(); const color = suppliedColor || colors.ink;
  const Vector = name === 'undo' ? Undo2 : name === 'redo' ? Redo2 : name === 'bookshelf' ? Library : null;
  if (Vector) return <View accessible={false} aria-hidden importantForAccessibility="no-hide-descendants"><Vector size={size} color={color} strokeWidth={2.5} /></View>;
  if (name === 'delete') return <Ionicons name="trash" size={size} color={color} accessible={false} aria-hidden importantForAccessibility="no-hide-descendants" />;
  if (name === 'thumb-up') return <MaterialIcons name="thumb-up-alt" size={size} color={color} accessible={false} aria-hidden importantForAccessibility="no-hide-descendants" />;
  return <MaterialCommunityIcons name={name} size={size} color={color} accessible={false} aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}
export function IconButton({ name, label, onPress, disabled, color, style, size = 24, circle, glyphBox, selected }: {
  name: IconName; label: string; onPress: () => void; disabled?: boolean; color?: string; style?: ViewStyle; size?: number; circle?: string; glyphBox?: number;
  selected?: boolean;
}) {
  const glyph = <Icon name={name} size={size} color={disabled ? C.disabled : color} />;
  const labelId = useGlyphLabelId();
  return <Pressable accessibilityRole="button" accessibilityLabel={glyphBox ? undefined : label} aria-labelledby={glyphBox ? labelId : undefined} accessibilityState={{ disabled: !!disabled, ...(selected === undefined ? {} : { selected }) }} aria-pressed={selected} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [S.iconButton, style, pressed && { opacity: 0.55 }]}>
    {!!circle && <View pointerEvents="none" style={[S.disc, { backgroundColor: circle }]} />}
    {glyphBox ? <GlyphLabel id={labelId} label={label} size={glyphBox}>{glyph}</GlyphLabel> : glyph}
  </Pressable>;
}
export const useGlyphLabelId = () => `glyph-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
export function GlyphLabel({ id, label, size, children, offsetY = 0 }: { id: string; label: string; size: number; children: React.ReactNode; offsetY?: number }) {
  return <View nativeID={id} accessibilityRole="button" accessibilityLabel={label} aria-hidden focusable={false} pointerEvents="none" style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', overflow: 'visible', transform: offsetY ? [{ translateY: offsetY }] : undefined }}>{children}</View>;
}
export function Pill({ title, icon, onPress, active, onRemove }: {
  title: string; icon?: IconName; onPress: () => void; active?: boolean; onRemove?: () => void;
}) {
  const C = useSurfaceColors();
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={S.pillTarget}>
    <View style={[S.pill, active ? { backgroundColor: C.surface === '#101012' ? '#FFFFFF0D' : '#1010120A' } : { ...S.pillEmpty, borderColor: C.surface === '#101012' ? '#F7F4EF26' : '#1010121A' }]}>
      <View style={S.pillContent}>
        {icon && <Icon name={icon} size={20} color={active ? C.blue : C.disabled} />}
        <Label style={S.pillText}>{title}</Label>
      </View>
      {active && onRemove && <IconButton name="close" label={`Remove ${title}`} onPress={onRemove} style={{ width: 28, height: 40 }} color={C.disabled} />}
    </View>
  </Pressable>;
}
const ACCENT_STOPS: readonly [string, string, ...string[]] = ['#FD8D1F', '#FD492B', '#FD2068', '#FD2068', '#FD492B', '#FD492B'];
const ACCENT_LOCATIONS: readonly [number, number, ...number[]] = [0, 0.15, 0.28, 0.61, 0.71, 1];
export function Accent({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <LinearGradient colors={ACCENT_STOPS} locations={ACCENT_LOCATIONS} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={[{ overflow: 'hidden' }, style]}>{children}</LinearGradient>;
}
export function Sheet({ children, onClose, compact = false, onShow, backgroundColor, backdrop, keyboardAvoiding = false, handleColor, handleHeight, handlePaddingTop }: { children: React.ReactNode; onClose: () => void; compact?: boolean; onShow?: () => void; backgroundColor?: string; backdrop?: React.ReactNode; keyboardAvoiding?: boolean; handleColor?: string; handleHeight?: number; handlePaddingTop?: number }) {
  const sheetRoot = React.useRef<View>(null);
  useSheetEscape(onClose, sheetRoot);
  const { width } = useWindowDimensions();
  const colors = useSurfaceColors();
  return <Modal transparent visible animationType="slide" onRequestClose={onClose} onShow={onShow} hardwareAccelerated={!!backdrop} statusBarTranslucent>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : keyboardAvoiding ? 'height' : undefined} style={S.modalOuter}>
      <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel="Close sheet" onPress={onClose} />
      <View ref={sheetRoot} style={[S.sheet, { width: Math.min(width, 480), backgroundColor: backgroundColor || colors.surface }, compact ? { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', minHeight: 180 } : { flex: 1 }]}>
        {backdrop && <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>{backdrop}</View>}
        <View style={[S.handleArea, handleHeight ? { height: handleHeight } : undefined]}><Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close sheet" style={[S.handleTarget, handlePaddingTop !== undefined ? { paddingTop: handlePaddingTop } : undefined]}><View accessibilityLabel="Drag handle" style={[S.handle, { backgroundColor: handleColor || colors.handle }]} /></Pressable></View>
        {children}
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}
export const S = StyleSheet.create({
  text: { fontFamily: Fonts.regular, fontSize: tokens.typography.body.fontSize, lineHeight: 21, color: C.ink, includeFontPadding: false },
  heading: { fontFamily: Fonts.regular, fontSize: tokens.typography.heading.fontSize, lineHeight: 34, letterSpacing: 0.7 },
  sectionHeading: { fontFamily: Fonts.medium, fontSize: tokens.typography.section.fontSize, lineHeight: 30 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  disc: { position: 'absolute', width: 40, height: 40, borderRadius: 999 },
  pillTarget: { height: 48, justifyContent: 'center' },
  pill: { borderRadius: 999, flexDirection: 'row', alignItems: 'center', height: 40 },
  pillEmpty: { borderWidth: 1, borderStyle: 'dashed', borderColor: C.border },
  pillActive: { backgroundColor: '#1010120A' },
  pillContent: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 11, paddingRight: 19, height: 40 },
  pillText: { fontFamily: Fonts.medium, fontSize: 13.1, lineHeight: 17, letterSpacing: 0.6, marginTop: 1.1 },
  modalOuter: { flex: 1, backgroundColor: '#00000040', alignItems: 'center', justifyContent: 'flex-end', paddingTop: Platform.OS === 'web' ? 0 : 49 },
  sheet: { backgroundColor: C.surface, borderTopLeftRadius: tokens.rounded.sheet, borderTopRightRadius: tokens.rounded.sheet, overflow: 'hidden', paddingBottom: Platform.OS === 'ios' ? 24 : 0 },
  handleArea: { height: 52, alignItems: 'center' },
  handleTarget: { width: 48, height: 48, alignItems: 'center', paddingTop: 22 },
  handle: { width: 32, height: 4, backgroundColor: C.handle, borderRadius: 2 },
});
