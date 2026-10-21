import { lazy } from 'react';

const loaders = {
  Library: () => import('./Library').then(m => ({ default: m.Library })),
  Search: () => import('./Search').then(m => ({ default: m.Search })),
  Profile: () => import('./Profile').then(m => ({ default: m.Profile })),
  Discovery: () => import('./Discovery').then(m => ({ default: m.Discovery })),
  HookPlayer: () => import('./HookPlayer').then(m => ({ default: m.HookPlayer })),
  HookCollection: () => import('./HookCollection').then(m => ({ default: m.HookCollection })),
  CreatorProfile: () => import('./CreatorProfile').then(m => ({ default: m.CreatorProfile })),
  LibraryPlayer: () => import('./LibraryPlayer').then(m => ({ default: m.LibraryPlayer })),
  PhotoToSong: () => import('./PhotoToSong').then(m => ({ default: m.PhotoToSong })),
  InspirationRecorder: () => import('./InspirationRecorder').then(m => ({ default: m.InspirationRecorder })),
  Voice: () => import('./Voice').then(m => ({ default: m.Voice })),
  VoiceDetails: () => import('./VoiceDetails').then(m => ({ default: m.VoiceDetails })),
  SubscriptionFlow: () => import('./SubscriptionFlow').then(m => ({ default: m.SubscriptionFlow })),
  ExampleCreation: () => import('./ExampleCreation').then(m => ({ default: m.ExampleCreation })),
  SongActions: () => import('./SongActions').then(m => ({ default: m.SongActions })),
  SongReport: () => import('./SongReport').then(m => ({ default: m.SongReport })),
  PlaylistShare: () => import('./PlaylistShare').then(m => ({ default: m.PlaylistShare })),
  AddToPlaylist: () => import('./AddToPlaylist').then(m => ({ default: m.AddToPlaylist })),
  Recorder: () => import('./Recorder').then(m => ({ default: m.Recorder })),
  TextEditor: () => import('./TextEditor').then(m => ({ default: m.TextEditor })),
  Notifications: () => import('./Notifications').then(m => ({ default: m.Notifications })),
  MediaChip: () => import('./MediaChip').then(m => ({ default: m.MediaChip })),
};

export const Library = lazy(loaders.Library);
export const Search = lazy(loaders.Search);
export const Profile = lazy(loaders.Profile);
export const Discovery = lazy(loaders.Discovery);
export const HookPlayer = lazy(loaders.HookPlayer);
export const HookCollection = lazy(loaders.HookCollection);
export const CreatorProfile = lazy(loaders.CreatorProfile);
export const LibraryPlayer = lazy(loaders.LibraryPlayer);
export const PhotoToSong = lazy(loaders.PhotoToSong);
export const InspirationRecorder = lazy(loaders.InspirationRecorder);
export const Voice = lazy(loaders.Voice);
export const VoiceDetails = lazy(loaders.VoiceDetails);
export const SubscriptionFlow = lazy(loaders.SubscriptionFlow);
export const ExampleCreation = lazy(loaders.ExampleCreation);
export const SongActions = lazy(loaders.SongActions);
export const SongReport = lazy(loaders.SongReport);
export const PlaylistShare = lazy(loaders.PlaylistShare);
export const AddToPlaylist = lazy(loaders.AddToPlaylist);
export const Recorder = lazy(loaders.Recorder);
export const TextEditor = lazy(loaders.TextEditor);
export const Notifications = lazy(loaders.Notifications);
export const MediaChip = lazy(loaders.MediaChip);

let prefetched = false;
export function prefetchScreens(): void {
  if (prefetched) return;
  prefetched = true;
  const start = () => Object.values(loaders).forEach(load => { load().catch(() => undefined); });
  if (typeof document !== 'undefined' && document.fonts?.ready) void document.fonts.ready.then(start, start);
  else start();
}
