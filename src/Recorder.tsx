import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { AudioTrack, clockTime } from './audioData';
import { useRecorder } from './useRecorder';
import { AudioConfirm, useTrackPlayback } from './Audio';
import { C, IconButton, Label, Sheet } from './ui';
import AsyncStorage from './accountStorage';
import { Fonts } from './fonts';

const CONSENT_KEY = 'suno-ui:record-consent:v1';

function Switch({ label, value, onChange }: { label: string; value: boolean; onChange: (next: boolean) => void }) {
  return <Pressable accessibilityRole="switch" accessibilityLabel={label} aria-checked={value} accessibilityState={{ checked: value }} onPress={() => onChange(!value)} style={R.switchTarget}>
    <View style={[R.track, value && R.trackOn]}><View style={[R.thumb, value && R.thumbOn]} /></View>
  </Pressable>;
}

export function Recorder({ onClose, onUse }: { onClose: () => void; onUse: (track: AudioTrack) => void }) {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [allow, setAllow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [terms, setTerms] = useState(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(CONSENT_KEY).then(value => { if (active) setConsent(value === '1'); }).catch(() => { if (active) setConsent(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!allow || !agree) return;
    setConsent(true);
    AsyncStorage.setItem(CONSENT_KEY, '1').catch(() => undefined);
  }, [allow, agree]);
  if (consent === null) return null;
  if (!consent) return <Sheet compact onClose={onClose} backgroundColor="#E0DEDA">
    <View style={R.consent}>
      <Label accessibilityRole="header" style={R.consentTitle}>Start Recording</Label>
      <View style={R.consentRow}><Label style={R.consentText}>Allow recording</Label><Switch label="Allow recording" value={allow} onChange={setAllow} /></View>
      <View style={R.consentRow}><Label style={R.consentText}>Agree to the <Label accessibilityRole="link" onPress={() => setTerms(true)} style={[R.consentText, R.link]}>Terms & Conditions</Label></Label><Switch label="Agree to the Terms & Conditions" value={agree} onChange={setAgree} /></View>
    </View>
    {terms && <AudioConfirm title="Terms & Conditions" description="Your recording stays on this device. Tap to record at least 6 seconds." confirm="Continue" cancel="Not Now" onCancel={() => setTerms(false)} onConfirm={() => { setTerms(false); setAgree(true); }} />}
  </Sheet>;
  return <RecordingSheet onClose={onClose} onUse={onUse} />;
}

function RecordingSheet({ onClose, onUse }: { onClose: () => void; onUse: (track: AudioTrack) => void }) {
  const recorder = useRecorder();
  const [permission, setPermission] = useState(false);
  const [explained, setExplained] = useState(false);
  const track = useMemo<AudioTrack | null>(() => recorder.file ? { id: `recording-${Date.now()}`, title: 'Audio recording', styles: '', lyrics: '', source: { uri: recorder.file.uri }, duration: recorder.file.duration } : null, [recorder.file]);
  const playback = useTrackPlayback(track);
  const toggle = () => {
    if (recorder.recording) { void recorder.stop(); return; }
    if (!explained) { setPermission(true); return; }
    void recorder.start();
  };
  return <Sheet compact onClose={onClose} backgroundColor="#E0DEDA" handleHeight={48.4}>
    <View style={R.content}>
      <Label accessibilityLabel="Recording duration" style={R.time}>{clockTime(recorder.seconds)}</Label>
      {!!recorder.error && <Label accessibilityRole="alert" accessibilityLiveRegion="polite" style={R.error}>{recorder.error}</Label>}
      {!!playback.error && <Label accessibilityRole="alert" style={R.error}>{playback.error}</Label>}
      {recorder.recording && <Label style={R.hint}>Recording… Tap to stop.</Label>}
      {!!recorder.file && <Label style={R.hint}>Listen back or attach your recording.</Label>}
      <View style={{ flex: 1 }} />
      {track && <Pressable accessibilityRole="button" accessibilityLabel="Use recording" onPress={() => { playback.player.pause(); if (recorder.take()) onUse(track); }} style={R.use}><Label style={{ color: C.white, fontFamily: Fonts.medium, fontSize: 18 }}>Use recording</Label></Pressable>}
      <View style={R.actions}>{recorder.file ? <>
        <IconButton name={playback.status.playing ? 'pause' : 'play'} label={playback.status.playing ? 'Pause recording preview' : 'Play recording preview'} onPress={() => void playback.play()} style={R.preview} />
        <Pressable accessibilityRole="button" accessibilityLabel="Record again" onPress={() => { playback.player.pause(); recorder.discard(); }} style={R.again}><Label>Record again</Label></Pressable>
      </> : <Pressable accessibilityRole="button" accessibilityLabel={recorder.recording ? 'Stop recording' : 'Start recording'} disabled={recorder.busy} accessibilityState={{ disabled: recorder.busy }} onPress={toggle} style={R.record}>
        {recorder.busy ? <ActivityIndicator color="#C32906" /> : recorder.recording ? <View style={R.stop} /> : <View style={R.dot} />}
      </Pressable>}</View>
    </View>
    {permission && <AudioConfirm title="Allow microphone access" description="Suno uses your microphone to record audio." confirm="Continue" cancel="Not Now" onCancel={() => setPermission(false)} onConfirm={() => { setPermission(false); setExplained(true); void recorder.start(); }} />}
  </Sheet>;
}

const R = StyleSheet.create({
  consent: { paddingTop: 12.7, paddingBottom: 7.1 },
  consentTitle: { alignSelf: 'center', fontFamily: Fonts.medium, fontSize: 18, lineHeight: 21.5, letterSpacing: 0.15, color: '#2E2E33', marginBottom: 8 },
  consentRow: { flexDirection: 'row', alignItems: 'center', height: 48, marginBottom: 8, paddingLeft: 48, paddingRight: 48.1 },
  consentText: { flex: 1, fontSize: 16, lineHeight: 19.3, color: '#2E2E33' },
  link: { flex: 0, color: '#FD429C' },
  switchTarget: { width: 52, height: 48, justifyContent: 'center' },
  track: { width: 52, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#7D7C83', backgroundColor: '#FFFFFF', justifyContent: 'center', paddingLeft: 6 },
  trackOn: { borderColor: C.ink, backgroundColor: C.ink, paddingLeft: 22 },
  thumb: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#7D7C83' },
  thumbOn: { width: 24, height: 24, borderRadius: 12, marginLeft: -4, backgroundColor: '#FFFFFF' },
  content: { height: 539, alignItems: 'center', paddingHorizontal: 24 },
  time: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 19.3, letterSpacing: 1.3, color: '#5B5B62', fontVariant: ['tabular-nums'] },
  hint: { fontSize: 14, color: C.muted, marginTop: 12, textAlign: 'center' },
  error: { marginTop: 16, color: '#9D280A', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  actions: { height: 100.1, marginBottom: 58.9, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 16 },
  record: { width: 100.1, height: 100.1, borderRadius: 99, backgroundColor: '#EDEAE4', justifyContent: 'center', alignItems: 'center' },
  dot: { width: 80, height: 80, borderRadius: 99, backgroundColor: '#C32906' },
  stop: { width: 42, height: 42, borderRadius: 6, backgroundColor: '#C32906' },
  preview: { width: 64, height: 64, borderRadius: 99, backgroundColor: '#C9C7C4' },
  again: { minHeight: 48, paddingHorizontal: 20, justifyContent: 'center' },
  use: { alignSelf: 'stretch', height: 56, borderRadius: 99, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
});
