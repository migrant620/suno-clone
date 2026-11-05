import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AudioTrack } from './audioData';
import { useLibrary } from './useLibrary';
import { PlaylistForm } from './PlaylistForm';
import { C, Icon, Label, Sheet } from './ui';

export function AddToPlaylist({ track, library, onClose }: { track: AudioTrack; library: ReturnType<typeof useLibrary>; onClose: () => void }) {
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const close = () => { if (!pending.current) onClose(); };
  const change = async (operation: () => Promise<boolean>) => {
    if (pending.current) return;
    pending.current = true; setBusy(true);
    try { await operation(); }
    finally { pending.current = false; if (mounted.current) setBusy(false); }
  };
  const liked = !!library.data.likedIds?.includes(track.id);
  return <Sheet onClose={close} backgroundColor="#1C1C1E">
    <Label style={A.title}>Add to Playlist</Label>
    <ScrollView contentContainerStyle={A.list}>
      <Pressable accessibilityRole="button" accessibilityLabel="Create New Playlist" disabled={busy} onPress={() => setCreating(true)} style={A.row}><View style={A.newCover}><Icon name="plus" color={C.surface} size={28} /></View><Label style={A.label}>Create New Playlist</Label></Pressable>
      <Pressable accessibilityRole="checkbox" accessibilityLabel="Add playing song to Liked Songs" aria-checked={liked} disabled={busy} accessibilityState={{ checked: liked, disabled: busy, busy }} onPress={() => void change(() => library.toggleLike(track.id))} style={A.row}><View style={A.cover}><Image source={require('../assets/liked-texture.png')} style={StyleSheet.absoluteFill} /><Icon name="thumb-up" color="#B8DEEF" size={24} /></View><Label style={A.label}>Liked Songs</Label><Icon name={liked ? 'checkbox-marked' : 'checkbox-blank-outline'} size={26} color={liked ? C.primary : '#BBBBBD'} /></Pressable>
      {library.data.playlists.map(item => {
        const checked = item.songIds.includes(track.id);
        return <Pressable accessibilityRole="checkbox" accessibilityLabel={`Add playing song to ${item.name}`} aria-checked={checked} disabled={busy} accessibilityState={{ checked, disabled: busy, busy }} key={item.id} onPress={() => void change(() => checked ? library.removeSong(item.id, track.id) : library.addSong(item.id, track.id))} style={A.row}><Image source={item.coverUri ? { uri: item.coverUri } : require('../assets/playlist-default.png')} style={A.cover} /><Label style={A.label}>{item.name}</Label><Icon name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'} size={26} color={checked ? C.primary : '#BBBBBD'} /></Pressable>;
      })}
    </ScrollView>
    {!!library.error && <Label accessibilityLiveRegion="polite" style={A.error}>{library.error}</Label>}
    <Pressable accessibilityRole="button" disabled={busy} onPress={close} style={A.done}><Label style={{ fontSize: 16 }}>Done</Label></Pressable>
    {creating && <PlaylistForm error={library.error} onClose={() => setCreating(false)} onSave={async (name, isPublic) => (await library.create(name, isPublic, track.id)) !== null} />}
  </Sheet>;
}
const A = StyleSheet.create({
  title: { color: C.surface, textAlign: 'center', fontSize: 16, lineHeight: 24, marginBottom: 8 },
  list: { paddingHorizontal: 16 },
  row: { minHeight: 77, borderBottomWidth: 1, borderBottomColor: '#FFFFFF16', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cover: { width: 60, height: 60, borderRadius: 4, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  newCover: { width: 60, height: 60, borderRadius: 4, backgroundColor: '#252528', alignItems: 'center', justifyContent: 'center' },
  label: { color: '#CCCCCE', fontSize: 14, flex: 1 },
  done: { margin: 16, height: 56, borderRadius: 99, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  error: { color: C.primary, fontSize: 12, marginHorizontal: 16 },
});
