import { ThemeColors, useSurfaceColors } from './Theme';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Image, Keyboard, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { OutlineSwitch } from './OutlineSwitch';
import * as ImagePicker from 'expo-image-picker';
import { Playlist } from './libraryState';
import { C, IconButton, Label, S } from './ui';
import { Fonts } from './fonts';

export function PlaylistEditor({ item, onClose, onSave, saveError }: { item: Playlist; onClose: () => void; onSave: (patch: Partial<Pick<Playlist, 'name' | 'description' | 'isPublic' | 'coverUri'>>) => Promise<boolean>; saveError?: string }) {
  const C = useSurfaceColors(); const E = styles(C);
  const original = useRef(item).current;
  const [name, setName] = useState(original.name);
  const [description, setDescription] = useState(original.description || '');
  const [isPublic, setPublic] = useState(original.isPublic);
  const [coverUri, setCoverUri] = useState(original.coverUri);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const pending = useRef(false);
  const coverPending = useRef(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const changed = !!name.trim() && (name.trim() !== original.name || description !== (original.description || '') || isPublic !== original.isPublic || coverUri !== original.coverUri);
  const close = () => { if (!pending.current) onClose(); };
  useEffect(() => { const sub = BackHandler.addEventListener('hardwareBackPress', () => { close(); return true; }); return () => sub.remove(); }, [onClose]);
  const save = async () => {
    if (!changed || pending.current || coverPending.current) return;
    pending.current = true; setBusy(true); setSaveFailed(false);
    let saved = false;
    try { saved = await onSave({
      ...(name.trim() !== original.name ? { name: name.trim() } : {}),
      ...(description !== (original.description || '') ? { description } : {}),
      ...(isPublic !== original.isPublic ? { isPublic } : {}),
      ...(coverUri !== original.coverUri ? { coverUri } : {}),
    }); }
    catch { saved = false; }
    finally { pending.current = false; if (mounted.current) setBusy(false); }
    if (!mounted.current) return;
    if (saved) { Keyboard.dismiss(); onClose(); } else setSaveFailed(true);
  };
  const chooseCover = async () => {
    if (pending.current || coverPending.current) return;
    coverPending.current = true; setCoverBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8, base64: true });
      if (mounted.current && !result.canceled) {
        const asset = result.assets[0];
        if (!asset.base64) throw new Error('No persistent image content');
        setCoverUri(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);setError('');
      }
    } catch { if (mounted.current) setError('The cover could not be opened. Please try another image.'); }
    finally { coverPending.current = false; if (mounted.current) setCoverBusy(false); }
  };
  return <View style={{ flex: 1, backgroundColor: C.surface }}>
    <View style={E.header}><IconButton name="chevron-left" label="Back" disabled={busy} onPress={close} circle={E.backDisc.backgroundColor} /><Label pointerEvents="none" style={E.heading}>Update Playlist Details</Label><Pressable accessibilityRole="button" accessibilityLabel="Save playlist changes" disabled={!changed || busy || coverBusy} accessibilityState={{ disabled: !changed || busy || coverBusy, busy }} onPress={() => void save()} style={E.saveTarget}><View style={E.save}><Label style={{ color: changed ? C.ink : C.disabled, fontSize: 14, lineHeight: 16.7 }}>{busy ? 'Saving…' : 'Save'}</Label></View></Pressable></View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Edit playlist cover" disabled={busy || coverBusy} accessibilityState={{ disabled: busy || coverBusy, busy: coverBusy }} onPress={() => void chooseCover()} style={E.cover}><Image source={coverUri ? { uri: coverUri } : require('../assets/playlist-default.png')} style={StyleSheet.absoluteFill} /><View style={E.edit}><Label style={E.editText}>Edit</Label></View></Pressable>
      {!!(error || saveFailed) && <Label accessibilityRole="alert" style={{ color: '#B52B19', marginTop: 12 }}>{error || saveError || 'Library changes could not be saved on this device. Try again.'}</Label>}
      <TextInput accessibilityLabel="Playlist title" value={name} onChangeText={setName} editable={!busy} placeholder="Playlist title" selectionColor={C.primary} style={[E.input, E.title]} />
      <View style={E.description}><TextInput accessibilityLabel="Playlist description" value={description} onChangeText={setDescription} editable={!busy} placeholder="Playlist description (optional)" placeholderTextColor={C.disabled} selectionColor={C.primary} multiline maxLength={200} style={[E.input, E.descriptionInput]} /><Label style={E.counter}>{description.length} / 200</Label></View>
      <View style={[S.row, E.visibility]}><View style={{ flex: 1, gap: 4.1 }}><Label style={E.visibilityTitle}>Make Playlist Public</Label><Label style={E.visibilityHint}>Playlists will be visible on your profile, search, through links and in other areas of Suno</Label></View><OutlineSwitch label="Make Playlist Public" value={isPublic} onValueChange={value => { if (!pending.current) setPublic(value); }} /></View>
      {isPublic && <Label style={{ color: C.muted, fontSize: 12, marginTop: 12 }}>Local demo visibility only. Nothing is published to Suno.</Label>}
    </ScrollView>
  </View>;
}
const styles = (C: ThemeColors) => StyleSheet.create({
  header: { height: 76, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingLeft: 4, paddingRight: 3.7, paddingTop: 8 },
  backDisc: { backgroundColor: C.surface === '#101012' ? C.control : '#10101206' },
  heading: { position: 'absolute', left: 64, right: 64, top: 20.1, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 18, lineHeight: 24 },
  saveTarget: { height: 48, width: 79.7, justifyContent: 'center' },
  save: { height: 40, backgroundColor: '#FFFFFF44', borderRadius: 99, justifyContent: 'center', alignItems: 'center' },
  cover: { width: 170.3, height: 170.3, borderRadius: 20, overflow: 'hidden', alignSelf: 'center', marginTop: 8.1, alignItems: 'center' },
  edit: { position: 'absolute', bottom: 7.9, borderRadius: 99, backgroundColor: '#FFFFFF77', paddingHorizontal: 11.85, height: 32.2, justifyContent: 'center' },
  editText: { color: '#101012', fontSize: 14, lineHeight: 16.7 },
  input: { fontFamily: Fonts.regular, fontSize: 14, color: C.ink, backgroundColor: C.surface === '#101012' ? C.field : '#10101205', borderRadius: 12, padding: 16, ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}) },
  title: { height: 48, paddingVertical: 0, marginTop: 22.2 },
  description: { height: 128.4, marginTop: 10.8, backgroundColor: C.surface === '#101012' ? C.field : '#10101205', borderRadius: 12, paddingHorizontal: 12, paddingTop: 7, paddingBottom: 8.5 },
  descriptionInput: { height: 90.2, padding: 0, borderRadius: 0, backgroundColor: 'transparent', textAlignVertical: 'top' },
  counter: { marginTop: 8.1, textAlign: 'right', color: C.secondary, fontSize: 12, lineHeight: 14.6 },
  visibility: { marginTop: 12.4, minHeight: 75.3, paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 11.9, backgroundColor: C.surface === '#101012' ? C.field : '#10101205', borderRadius: 12, gap: 16 },
  visibilityTitle: { fontSize: 14, lineHeight: 16.7 },
  visibilityHint: { color: C.secondary, fontSize: 12, lineHeight: 15.3 },
});
