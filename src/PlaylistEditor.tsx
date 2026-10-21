import { ThemeColors, useSurfaceColors } from './Theme';
import React, { useEffect, useState } from 'react';
import { BackHandler, Image, Keyboard, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { OutlineSwitch } from './OutlineSwitch';
import * as ImagePicker from 'expo-image-picker';
import { Playlist } from './libraryState';
import { C, IconButton, Label, S } from './ui';
import { Fonts } from './fonts';

export function PlaylistEditor({ item, onClose, onSave }: { item: Playlist; onClose: () => void; onSave: (item: Playlist) => void }) {
  const C = useSurfaceColors(); const E = styles(C);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || '');
  const [isPublic, setPublic] = useState(item.isPublic);
  const [coverUri, setCoverUri] = useState(item.coverUri);
  const [error, setError] = useState('');
  const changed = !!name.trim() && (name.trim() !== item.name || description !== (item.description || '') || isPublic !== item.isPublic || coverUri !== item.coverUri);
  useEffect(() => { const sub = BackHandler.addEventListener('hardwareBackPress', () => { onClose(); return true; }); return () => sub.remove(); }, [onClose]);
  const chooseCover = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8, base64: true });
      if (!result.canceled) {
        const asset = result.assets[0];
        if (!asset.base64) throw new Error('No persistent image content');
        setCoverUri(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);setError('');
      }
    } catch { setError('The cover could not be opened. Please try another image.'); }
  };
  return <View style={{ flex: 1, backgroundColor: C.surface }}>
    <View style={E.header}><IconButton name="chevron-left" label="Back" onPress={onClose} circle={E.backDisc.backgroundColor} /><Label pointerEvents="none" style={E.heading}>Update Playlist Details</Label><Pressable accessibilityRole="button" accessibilityLabel="Save playlist changes" disabled={!changed} accessibilityState={{ disabled: !changed }} onPress={() => { Keyboard.dismiss(); onSave({ ...item, name: name.trim(), description, isPublic, coverUri }); }} style={E.saveTarget}><View style={E.save}><Label style={{ color: changed ? C.ink : C.disabled, fontSize: 14, lineHeight: 16.7 }}>Save</Label></View></Pressable></View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Edit playlist cover" onPress={() => void chooseCover()} style={E.cover}><Image source={coverUri ? { uri: coverUri } : require('../assets/playlist-default.png')} style={StyleSheet.absoluteFill} /><View style={E.edit}><Label style={E.editText}>Edit</Label></View></Pressable>
      {!!error && <Label style={{ color: '#B52B19', marginTop: 12 }}>{error}</Label>}
      <TextInput accessibilityLabel="Playlist title" value={name} onChangeText={setName} placeholder="Playlist title" selectionColor={C.primary} style={[E.input, E.title]} />
      <View style={E.description}><TextInput accessibilityLabel="Playlist description" value={description} onChangeText={setDescription} placeholder="Playlist description (optional)" placeholderTextColor={C.disabled} selectionColor={C.primary} multiline maxLength={200} style={[E.input, E.descriptionInput]} /><Label style={E.counter}>{description.length} / 200</Label></View>
      <View style={[S.row, E.visibility]}><View style={{ flex: 1, gap: 4.1 }}><Label style={E.visibilityTitle}>Make Playlist Public</Label><Label style={E.visibilityHint}>Playlists will be visible on your profile, search, through links and in other areas of Suno</Label></View><OutlineSwitch label="Make Playlist Public" value={isPublic} onValueChange={setPublic} /></View>
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
