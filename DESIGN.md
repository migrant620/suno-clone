---
version: alpha
name: Suno Android Creation
description: Warm neutral editing surfaces, dark typography, translucent pills and a vivid pink-orange creation accent. Representative implementation in progress.
colors:
  surface: "#F7F4EF"
  ink: "#101012"
  toolbar: "#E0DEDA"
  handle: "#4E4D55"
  muted: "#85848C"
  placeholder: "#C9C6C1"
  disabled: "#A3A3A3"
  primary: "#FF399C"
  orange: "#FF702C"
  blue: "#0089FF"
  white: "#FFFFFF"
  border: "#C5BDBD"
typography:
  body:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.2
  heading:
    fontFamily: Roboto
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.2
  section:
    fontFamily: Roboto
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
  caption:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.2
spacing:
  page: 16px
  small: 8px
  row: 12px
  section: 24px
rounded:
  sheet: 28px
  card: 24px
  input: 16px
  pill: 999px
---

## Overview

A mobile-first music creation interface: warm neutral editing surfaces, dark typography, translucent pills and a vivid pink-orange creation accent. This prototype covers creation, text editing, audio attachment, Library and playlists, Search, Hooks, Profile, Notifications, Settings and the subscription screens. All data is local sample data; nothing connects to a music service.

## Colors

`surface` is the warm editor sheet, `ink` the primary text, `toolbar` the editor toolbar fill and `handle` the sheet drag handle. `primary` and `orange` form the creation accent, which appears as a soft, grainy, slowly moving color field rather than a flat gradient. Dark appearance uses `#101012` for the main surface, `#19191B` for secondary surfaces, `#28282A` for dividers and controls and `#F7F4EF` for primary text. The comment sheet uses `#1C1C1F` with `#C2C2C1` body text, `#6A6A72` secondary text, `#FD429C` timestamps and a `#252529` composer.

## Typography

Body copy is 16 dp and screen headings 28 dp, set in Roboto. Section titles use 24 dp medium; captions 12 dp. Condensed display headings on the plans screens use Instrument Serif. All fonts are licensed packages bundled with the project.

## Layout

The app content area is 393 × 777 dp. Pages use a 16 dp side margin. The expanded editor toolbar uses 24 dp icons on 48 dp centers and stays above the keyboard; the drag handle is 32 × 4 dp. On the web, system bars are not drawn — the app surface starts directly below the browser chrome.

## Elevation & Depth

Expanded editors are a warm opaque sheet over a dimmed background. Saved-text menus and naming dialogs float above the sheet. Dialogs sit on a black scrim at about 32% opacity.

## Shapes

Pill buttons, rounded sheets (28 dp) and softly rounded cards (24 dp) are characteristic. Inputs use 16 dp corners; playlist covers 20 dp.

## Components

**Creation form.** Simple prompt and shared Lyrics / Styles / Title fields, a mode toggle, a model menu (an anchored 112 dp menu with 48 dp options) and a global clear. The expanded editor is a real multiline input with its own undo/redo history, saved items, rename and delete, and Done. Drafts survive closing the editor and switching modes.

**Audio attachment.** Song picker rows are 72 dp with 56 dp square covers. Selecting a song previews it; Continue attaches it. Cover and Extend share one player, and Extend has an adjustable start point. Recordings shorter than six seconds are rejected.

**Library and playlists.** Category cards are 164 × 124 dp with a 12 dp gap in a horizontal strip. Playlist detail covers are 210 × 210 dp, with a 240 × 40 dp Play button beside 40 dp Share and Download controls. New playlists open in their own sheet with a centered 28 dp name field, a visibility switch and a 56 dp submit button. Editing a playlist is a full page; cancelling keeps the original values.

**Navigation.** All five bottom tabs open real screens. Detail pages hide the bottom bar; Back returns to the originating list.

**Search.** Discovery, typing suggestions and submitted results are separate states. Results use underlined All / Songs / Creators / Playlists / Hooks tabs, a 48 dp field and 56 dp covers on 76 dp rows. Recent history lists 72 dp rows with 56 dp avatars and a separate remove control.

**Profile.** A fading cover with a 76 dp avatar, identity and an Edit pill. The profile editor is a full scrolling page with fixed Back and Save, a 272 dp cover region, grouped name and username fields and six social-link rows. Save stays disabled until something changes.

**Comments.** 32 dp avatars, a 58 dp text origin and a 44 dp composer. Timestamps seek the real player; likes, replies, copy and deleting your own comments are supported.

**Voice.** A full-height entry sheet with a 100 dp record control (72 dp `#C32906` core). Uploaded samples must be at least 15 seconds; the trim editor shows an 80 dp waveform with start and end handles.

**Photo to Song.** A full-screen camera with a 120 dp shutter, a gallery picker and an editable prompt with cycling highlighted words.

**Notifications and Settings.** Notifications open as a full page with a permission banner and switch. Settings uses 65 dp divided rows; Appearance offers Light, Dark and device setting. Account deletion uses a 272 × 312 dp confirmation card and removes all local demo data.

**Plans.** Monthly and annual billing with Pro / Premier cards and download packs. Checkout is a clearly labelled demo: no payment is taken and no service credit is issued.

## Do's and Don'ts

Use real text, inputs, controls and local data. Never embed screenshots of another product as interface elements. Label sample generation and demo checkout clearly, and never imply access to Suno's service. Keep one accent per screen.

## Responsive Behavior

Mobile first. On wider screens the app surface is centered at phone width. Native builds respect platform safe areas and keyboard insets.
