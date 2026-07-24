# TrackPrefixer

TrackPrefixer is an open-source plugin for Lexicon DJ that adds sortable numeric prefixes to track metadata.

Example:

```text
0001* Track Title
0002* Track Title
0003* Track Title
```

This makes numeric playback order available when a DJ player sorts the configured field alphabetically.

## Author

Created by **AndersAxel**.

Designed and developed by AndersAxel with AI-assisted development. AI was used as a development aid; product direction, testing, feature selection and final implementation decisions were made by the project author.

## Current version

**v2.3.0**

This is the stable documented release. It includes the verified calendar-date sorting behavior, synchronized Number and Continue sorting, complete preset management, and the tested Lexicon compatibility safeguards.

## Features

- Configure settings once and reuse them across actions.
- Load, save and delete presets through filename-only marker storage.
- Protected built-in System Default preset.
- Number selected tracks from a chosen start number.
- Continue from the highest matching prefix in the main library.
- Number and Continue use the same primary, secondary, direction and missing-value sorting rules.
- Date Added compares calendar dates only and ignores the hidden time of day.
- Remove prefixes from selected tracks.
- Target fields: Title, Grouping or Comment.
- Replace or skip existing TrackPrefixer prefixes.
- Batch-based library scanning that ignores Incoming tracks.

## Number selected tracks

Number selected tracks uses the configured Start number and one of these width modes:

- **Selected tracks**: width is based on the last number assigned in the current run.
- **Auto library size**: width is based on the number of tracks in the main library.
- **Fixed width**: uses the selected width, but expands if the assigned number requires more digits.

## Continue selected numbering

Continue selected numbering intentionally differs from Number selected tracks in only two ways:

- It ignores Start number and begins after the highest matching prefix in the main library.
- It ignores the configured prefix-width mode and preserves the width of the highest matching library prefix, expanding only when required by a digit boundary.

Continue still uses the same selected-track sorting and Replace/Skip behavior as Number selected tracks.

## Date Added sorting

Date Added is normalized to a local calendar-day key. Times on the same day are ignored. For example, all of these values are treated as equal for the primary sort:

```text
2023-06-12 08:15
2023-06-12 14:30
2023-06-12 22:45
```

The configured secondary field then orders the entire date group.

## Presets

Presets are stored as append-only filename markers in the plugin Files folder. They are reconstructed with `_files.list()`; no preset database object and no `_files.read()` call are used.

Supported operations:

- Load preset
- Save current settings
- Replace an existing preset by saving the same name again
- Delete preset
- Protected System Default preset

Presets have been verified to survive a full Lexicon restart.

## Lexicon menu note

Lexicon displays **About / Settings / Run** below Configure TrackPrefixer because the action declares one setting named `Preset Name`.

- Use **Run** to open TrackPrefixer's Configure menu.
- The visible `Preset Name` setting is an accepted compatibility workaround for Lexicon text-dialog behavior.
- Its value is used as a safe fallback so preset names are never written as `undefined`.
- It can normally be ignored. Removing it may reintroduce the preset-name bug and must not be done without a real Lexicon regression test.

## Installation

1. Download and extract the complete TrackPrefixer folder.
2. Replace the previous TrackPrefixer plugin folder in Lexicon.
3. Reload plugins or restart Lexicon.
4. Open **Plugins > TrackPrefixer > Configure TrackPrefixer > Run**.
5. Review and save the desired settings.
6. Use **Number selected tracks** or **Continue selected numbering** for normal work.

## Safe defaults

- Target field: Title
- Primary sort: Current Lexicon order
- Secondary sort: None
- Prefix width: Selected tracks
- Start number: 1
- Existing prefixes: Replace
- Format: `0001* Track Title`

## Clone-safety rules

Lexicon can raise `an object could not be cloned` when host-managed objects are retained or transformed unsafely. The verified implementation follows these rules:

- Never sort `_vars.tracksSelected` directly.
- Sort only an array of integer indexes.
- Read the library batch by batch with `_library.track.getNextAllBatch()`.
- Do not retain library track objects across `await` calls.
- Store settings as separate primitive values.
- Keep logs compact and never serialize track objects.

Future contributors must preserve these rules unless a replacement has been tested in Lexicon against a real library.

## Actions

- **Configure TrackPrefixer**: edits persistent settings and manages presets.
- **About TrackPrefixer**: shows version, authorship, AI disclosure, license and status.
- **Number selected tracks**: numbers selected tracks using the saved settings.
- **Continue selected numbering**: scans the main library and continues after the highest matching prefix.
- **Remove selected prefixes**: removes matching prefixes from the configured target field.
- **Reset saved number**: resets the informational saved number.
- **Restore default settings**: restores safe defaults.

## Verified release testing

This release was tested in Lexicon with focused code-path tests and a 418-track stress test. The stress test produced `0001*` through `0418*` without gaps or duplicates, used Date Added ascending with BPM descending, ignored time of day, placed missing BPM values last, and reported zero unparsed Date Added values.

See `TESTING.md` for the detailed verification record.

## Project continuation

Read these files before changing runtime code:

- `MAINTAINERS.md`
- `CONTRIBUTING.md`
- `TESTING.md`
- `CHANGELOG.md`


## License

MIT License. See `LICENSE`.
