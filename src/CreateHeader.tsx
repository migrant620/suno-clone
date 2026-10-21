import React, { useId } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { GradientRing } from './lineIcons';
import { Icon, Label } from './ui';
import { useSurfaceColors } from './Theme';
import { useCreditPromotion } from './useCreditPromotion';
import { Fonts } from './fonts';

const MODE_TITLE_EM = { Simple: 3.125, Advanced: 4.616 } as const;
const MODE_TITLE_SOURCE_SIZE = 17.81;

export function CreateHeader({ mode, model, freePlan, promotion, onMode, onModel, onOffer, modelOpen }: {
  mode: 'Simple' | 'Advanced'; model: string; freePlan: boolean; modelOpen: boolean;
  promotion: ReturnType<typeof useCreditPromotion>; onMode: () => void; onModel: () => void; onOffer: () => void;
}) {
  const colors = useSurfaceColors(); const { width } = useWindowDimensions();
  const gradient = useId().replace(/:/g, '');
  const banner = freePlan && (promotion.active || promotion.error);
  return <View style={[H.header, { height: banner ? 112 : 80 }]}>
    <View style={[H.row, width < 360 && { paddingRight: 36 }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Switch creation mode" onPress={onMode} style={H.mode}><Label numberOfLines={1} style={[H.modeText, { minWidth: MODE_TITLE_EM[mode] * MODE_TITLE_SOURCE_SIZE }]}>{mode}</Label><Icon name="chevron-down" size={20} /></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Select model" onPress={onModel} style={H.model}>
        {banner ? <GradientRing id={gradient} width={93} height={48} /> : <View pointerEvents="none" accessible={false} style={[StyleSheet.absoluteFill, H.modelBorder, { borderColor: colors.surface === '#101012' ? '#F7F4EF26' : '#1010121A' }]} />}
        <View style={H.modelLabel}><Label numberOfLines={1} style={H.modelText}>{model}</Label></View>
        <View style={H.modelChevron} {...(modelOpen ? {} : { accessibilityRole: 'button' as const, accessibilityLabel: 'Close', 'aria-hidden': true, focusable: false })} pointerEvents="none"><Icon name={modelOpen ? 'chevron-up' : 'chevron-down'} size={20} /></View>
      </Pressable>
    </View>
    {freePlan && promotion.error ? <Pressable accessibilityRole="button" accessibilityLabel={promotion.invalid ? 'Reset demo offer timer' : 'Retry offer timer'} accessibilityState={{ disabled: promotion.loading }} disabled={promotion.loading} onPress={promotion.retry} style={H.promotion}><Label style={{ color: colors.muted, fontSize: 12 }}>{promotion.invalid ? 'Offer timer unavailable. Reset demo offer.' : 'Offer timer unavailable. Tap to retry.'}</Label></Pressable>
      : freePlan && promotion.active ? <Pressable accessibilityRole="button" accessibilityLabel="Upgrade for credit-free songs" accessibilityHint="Local demo offer. No purchase or Suno benefits are granted." onPress={onOffer} style={H.promotion}>
        <Label style={[H.offerTitle, { fontSize: width < 360 ? 11 : 12 }]}>UPGRADE FOR CREDIT-FREE SONGS</Label>
        <Label accessibilityLabel="Demo offer time remaining" style={[H.timer, { color: colors.muted }]}><Label style={{ fontSize: 9, color: colors.muted }}>Demo · </Label>{promotion.label}</Label>
      </Pressable> : null}
  </View>;
}
const H = StyleSheet.create({
  header: { marginHorizontal: 16, zIndex: 1 },
  row: { height: 64, marginLeft: -5.8, marginRight: -4, alignItems: 'center', justifyContent: 'center' },
  mode: { flexDirection: 'row', alignItems: 'center', gap: 0, height: 48 },
  modeText: { fontFamily: Fonts.title, fontSize: 16.98, lineHeight: 22, letterSpacing: 0.6, textAlign: 'center' },
  model: { position: 'absolute', top: 8, right: 4, width: 93.2, height: 48, paddingLeft: 12.8, paddingRight: 0, flexDirection: 'row', alignItems: 'center', gap: 0 },
  modelBorder: { borderWidth: 1, borderRadius: 24 },
  modelText: { fontFamily: Fonts.regular, fontSize: 12.6, lineHeight: 15, letterSpacing: 0.08, flexShrink: 0 },
  modelLabel: { width: 48, minWidth: 48, alignItems: 'center' },
  modelChevron: { width: 16, height: 16, marginLeft: 0.4, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  promotion: { position: 'absolute', top: 56, left: 0, right: 0, minHeight: 36, flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { color: '#E88725', fontFamily: Fonts.bold, lineHeight: 16, flexShrink: 1 },
  timer: { fontFamily: Fonts.bold, fontSize: 12, lineHeight: 16 },
});
