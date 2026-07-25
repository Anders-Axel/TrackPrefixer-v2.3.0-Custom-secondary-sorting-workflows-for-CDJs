# Changelog

## 2.3.0 - Stable release

- Published the verified runtime under the clean public version name TrackPrefixer v2.3.0.
- Removed internal rebuild terminology from the release name, package folder, version output and current documentation.
- Finalized README usage documentation for Number and Continue width behavior.
- Documented Date Added calendar-day semantics and the accepted Lexicon Preset Name Settings submenu.
- Added TESTING.md with the focused test record and 418-track stress-test evidence.
- Runtime behavior is unchanged from the final verified development build.

## Internal development history: 2.3.0 rebuild 13

- Finalized documentation and project-handoff material before the stable public package.
- Runtime behavior was unchanged from rebuild 12.

## 2.3.0 rebuild 12

- Date Added sorting now compares calendar dates only and ignores the time of day.
- Tracks added on the same displayed date now use the configured secondary sort field across the whole date group.
- The same calendar-date behavior is used by Number selected tracks and Continue selected numbering.
- Date parsing compatibility, missing-value handling, prefix behavior, presets and clone-safe index sorting are otherwise unchanged.

## 2.3.0 rebuild 11

- Continue selected numbering now ignores the configured prefix-width mode.
- Continue preserves the digit width of the highest matching library prefix.
- Width expands only when the next assigned number requires more digits.
- Skip mode counts only tracks that will actually receive a new number when checking a width boundary.
- Number selected tracks, sorting, presets and library highest-prefix scanning are otherwise unchanged.

## 2.3.0 rebuild 10

- Continue selected numbering now applies the same saved primary, secondary, direction and missing-value sorting rules as Number selected tracks.
- Uses clone-safe integer index sorting and never sorts `_vars.tracksSelected` directly.
- Includes the rebuild 9 Date Added parser and unparsed-date reporting in Continue.
- The full-library highest-prefix scan, Incoming exclusion and prefix assignment start remain unchanged.

## 2.3.0 rebuild 9

- Fixed Date Added sorting for Lexicon Date objects, ISO dates and localized date strings.
- Primary Date Added sorting now remains primary; the secondary field is used only when Date Added values are equal.
- Treats zero values as missing for Year, BPM and Rating so Missing values First/Last behaves consistently.
- Added a compact count of unparsed Date Added values to Number selected tracks reports and logs.
- Preset Manager, Continue numbering and prefix behavior are otherwise unchanged from rebuild 8.

## 2.3.0 rebuild 8

- Preset name input now follows Lexicon's official `settingsKey` text-dialog pattern.
- Added an explicit confirmation before a preset marker is written.
- Fixed Delete preset when exactly one user preset exists.
- Fixed Review and save by providing the minimum two select options required by Lexicon.
- Expanded remaining one-line conditionals in preset parsing to follow Lexicon preprocessing guidance.
- Numbering, Continue, removal and clone-safe library logic remain unchanged.

## 2.3.0 rebuild 5

- Rebuilt from the user-supplied rebuild 3 archive.
- Preset name input now uses a non-empty default and normalizes the Lexicon dialog result before validation.
- Internal ZIP folder name now matches rebuild 5.

## 2.3.0 rebuild 3

- Fixed Load preset when only System Default is available; Lexicon select dialogs require at least two options.
- Fixed preset names by using the text dialog return value directly, matching the existing verified Configure text-input pattern.
- Fixed Delete preset with no user presets by reporting the state without opening a one-option select dialog.
- Numbering and Continue logic remain unchanged.

## 2.3.0

- Added Preset Manager to the stable v2.2.1 Configure menu.
- Added Load preset, Save current settings and Delete preset.
- Added a protected built-in System Default preset.
- Presets use append-only filename markers and are reconstructed with `_files.list()` only.
- No preset database object and no `_files.read()` are used.
- Kept changes temporary until Review and save is confirmed.
- Preserved the verified numbering, continuation, removal, sorting and shared-settings code.

## 2.2.1

- Replaced the linear Configure wizard with a section-based main menu.
- Added General, Sorting, Prefix and numbering, and Review and save sections.
- Added a Menu button inside every settings section so users can leave a section immediately.
- Added Cancel on the main menu so configuration can always be abandoned without saving.
- Kept edits temporary until Review and save is confirmed.
- Preserved all numbering, continuation, removal, sorting and shared-settings behavior.

## 2.2.0

- Added Back navigation to every Configure TrackPrefixer step after the first.
- Changed Configure to keep edits temporary until the final Save action.
- Added Cancel on the first step; closing or cancelling there exits without saving.
- Preserved all numbering, continuation, removal, sorting and shared-settings behavior.

## 2.1.10

- Completed final release-hardening and version consistency cleanup.
- Synchronized version labels across all JavaScript files, README, About and VERSION.
- Corrected the duplicated 2.1.8 changelog heading for the earlier marker-based settings release.
- No numbering, continuation, removal, sorting or shared-settings behavior was changed.

## 2.1.9

- Added concise explanations above every Configure TrackPrefixer input and drop-down menu.
- Clarified what each setting controls and what its available options mean.
- No numbering, continuation, removal, sorting, or shared-settings behavior was changed.

## 2.1.8

- Fixed Configure TrackPrefixer so it displays the latest shared settings marker, including defaults restored by Restore Default Settings.
- Numbering, continuation, removal, and shared marker behavior are otherwise unchanged from v2.1.7.

## 2.1.7

- Restored the stable v2.1.1 track-modification core.
- Shared settings are now encoded in timestamped marker filenames and loaded with `_files.list()`.
- Numbering actions no longer call `_files.read()` before modifying tracks.
- Start Number and all other Configure values are shared across actions.


All notable changes to TrackPrefixer are documented here.

## 2.1.1 - 2026-07-17

### Added

- Visible **About TrackPrefixer** action
- README with installation, usage and clone-safety guidance
- MIT license
- Contribution and maintenance documentation
- Code of Conduct
- Clear authorship and AI-assistance disclosure

### Changed

- Project packaged as a handoff-ready open-source release

### Runtime compatibility

- Numbering logic remains based on the verified clone-safe v2.1 implementation
- No library track objects are retained across asynchronous batch calls

## 2.1.0 - 2026-07-17

### Added

- Persistent configuration action
- Saved sorting, target-field, width and numbering settings
- Direct-run numbering actions without repeated settings dialogs
- Restore default settings action

### Fixed

- Preserved clone-safe sorting through integer indexes
