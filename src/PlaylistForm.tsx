import { ThemeColors, useSurfaceColors } from './Theme';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { C, IconButton, Label, S } from './ui';
import { Fonts } from './fonts';
import { OutlineSwitch } from './OutlineSwitch';

export function PlaylistForm({ initialName = '', initialPublic = false, editing = false, onClose, onSave, error }: {
  initialName?: string; initialPublic?: boolean; editing?: boolean;
  onClose: () => void; onSave: (name: string, isPublic: boolean) => Promise<boolean>; error?: string;
}) {
  const C = useSurfaceColors(); const F = styles(C);
  const [name, setName] = useState(initialName);
  const [isPublic, setPublic] = useState(initialPublic);
  const input = useRef<TextInput>(null);
  const pending = useRef(false);
  const mounted = useRef(true);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const { width } = useWindowDimensions();
  const valid = !!name.trim();
  const close = () => { if (!pending.current) { Keyboard.dismiss(); onClose(); } };
  const submit = async () => {
    if (!valid || pending.current) return;
    pending.current = true; setBusy(true); setFailed(false);
    let saved = false;
    try { saved = await onSave(name.trim(), isPublic); }
    catch { saved = false; }
    finally { pending.current = false; if (mounted.current) setBusy(false); }
    if (!mounted.current) return;
    if (saved) { Keyboard.dismiss(); onClose(); } else setFailed(true);
  };
  return <Modal transparent visible animationType="slide" statusBarTranslucent onRequestClose={close} onShow={() => input.current?.focus()}>
    <View style={F.outer}>
      <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel="Close playlist form" onPress={close} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined} style={[F.sheet, { width: Math.min(width, 480) }]}>
        <View style={F.header}><Label style={F.heading}>{editing ? 'Edit Playlist' : 'Create New Playlist'}</Label><IconButton name="close" label="Cancel playlist" disabled={busy} onPress={close} style={F.close} /></View>
        <View style={F.nameArea}><TextInput ref={input} autoFocus={Platform.OS === 'web'} accessibilityLabel="Playlist name" placeholder="Untitled" placeholderTextColor="#858585" value={name} onChangeText={setName} editable={!busy} selectionColor={C.primary} multiline style={F.name} onKeyPress={event => {
          if (Platform.OS !== 'web') return;
          const key = event.nativeEvent as unknown as KeyboardEvent;
          if (key.key === 'Enter' && (key.ctrlKey || key.metaKey) && !key.isComposing && !key.repeat && !key.altKey) { event.preventDefault(); void submit(); }
        }} /></View>
        <View style={F.footer}>
          <View style={[S.row, F.visibility]}><Label style={F.visibilityText}>Show on my Public Profile &amp; Search</Label><OutlineSwitch label="Show on my Public Profile & Search" value={isPublic} onValueChange={value => { if (!pending.current) setPublic(value); }} scale={0.81} /></View>
          {isPublic && <Label style={F.disclosure}>Local demo visibility only. Nothing is published to Suno.</Label>}
          {failed && <Label accessibilityRole="alert" style={F.disclosure}>{error || 'Library changes could not be saved on this device. Try again.'}</Label>}
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: !valid || busy, busy }} disabled={!valid || busy} onPress={() => void submit()} style={[F.submit, !valid && { backgroundColor: '#9D9B98' }]}><Label style={[F.submitText, !valid && { color: '#C0BEBB' }]}>{busy ? 'Saving…' : editing ? 'Save Changes' : 'Create Playlist'}</Label></Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  </Modal>;
}
const styles = (C: ThemeColors) => StyleSheet.create({
  outer: { flex: 1, backgroundColor: '#00000055', alignItems: 'center', paddingTop: Platform.OS === 'web' ? 47 : 96 },
  sheet: { flex: 1, backgroundColor: C.surface === '#101012' ? C.field : '#EEEBE5', borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  header: { height: 64, alignItems: 'center', paddingTop: 20 },
  heading: { fontFamily: Fonts.medium, fontSize: 20, lineHeight: 26 },
  close: { position: 'absolute', right: 16, top: 8 },
  nameArea: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  name: { height: 148, padding: 16, fontFamily: Fonts.regular, fontSize: 28, lineHeight: 34, color: C.ink, textAlign: 'center', textAlignVertical: 'top', ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}) },
  footer: { padding: 16, gap: 16 },
  visibility: { justifyContent: 'center', gap: 14.2, minHeight: 38 },
  visibilityText: { color: C.secondary, fontSize: 14, flexShrink: 1 },
  disclosure: { fontSize: 12, color: C.muted, textAlign: 'center' },
  submit: { height: 56, borderRadius: 99, backgroundColor: C.ink, justifyContent: 'center', alignItems: 'center' },
  submitText: { fontSize: 18, lineHeight: 24, fontFamily: Fonts.medium, color: C.surface },
});
