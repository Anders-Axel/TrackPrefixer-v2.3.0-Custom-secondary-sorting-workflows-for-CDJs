# Maintainer Notes

## Release state

TrackPrefixer v2.3.0 is the stable documented release. Its runtime behavior is the verified calendar-date sorting and synchronized Number/Continue implementation that passed focused Lexicon tests and the 418-track stress test.

There are no known functional blockers. One accepted Lexicon UI quirk remains: Configure TrackPrefixer appears with About, Settings and Run subitems because the action declares the `Preset Name` setting used by the preset-name compatibility workaround.

## Project intent

TrackPrefixer creates sortable numeric keys in a configurable track text field for DJ-library workflows.

The main library is the source of truth for Continue numbering. `_storage` is informational and stores configuration; it must never replace the full highest-prefix scan.

## Runtime file map

- `configure.trackprefixer.js`: settings menu, shared marker creation and Preset Manager.
- `number.selected.from.start.js`: selected-track sorting and numbering from Start number.
- `continue.selected.numbering.js`: full-library highest-prefix scan, selected-track sorting and continuation.
- `remove.selected.prefixes.js`: removes matching prefixes from the configured target field.
- `restore.default.settings.js`: restores settings and writes a shared settings marker.
- `reset.saved.number.js`: resets informational storage only.
- `about.trackprefixer.js`: version and project status output.
- `config.json`: actions, permissions and the `Preset Name` compatibility setting.

Actions intentionally remain complete root-level JavaScript files. Some logic is duplicated because module loading has not been verified in the Lexicon plugin environment. Do not reorganize the runtime into shared modules without a working Lexicon test plugin.

## Verified Lexicon behaviors

- `_library.track.getNextAllBatch()` is the stable full-library scan method.
- Incoming tracks are ignored by library counting and highest-prefix scans.
- Archived tracks are outside the normal `all` batch scope used by the plugin.
- Search results are not used for full-library correctness.
- Host-managed track objects can trigger `an object could not be cloned` when handled unsafely.
- Lexicon select dialogs require at least two options.
- The preset text dialog required a `settingsKey` fallback to avoid `undefined` preset names in this installation.

## Non-negotiable clone-safety invariants

1. Never sort `_vars.tracksSelected` directly.
2. Build and sort integer indexes only.
3. Do not retain library track objects across `await` calls.
4. Read the library batch by batch.
5. Store persistent settings as primitives.
6. Never serialize track objects into logs, files or storage.
7. Keep runtime logs compact.

## Shared settings storage

Configure writes append-only markers named like:

```text
tp-settings-<timestamp>-<encoded primitive values>.txt
```

Every action reconstructs the newest valid settings marker with `_files.list()`. The marker filename is the source of truth across action boundaries. `_storage` is retained for compatibility and convenience, but marker files make the settings visible to all actions.

## Preset storage

Preset markers are append-only and reconstructed from filenames only:

```text
tp-preset-v1-<timestamp>-save-<encoded name>-<encoded settings>.txt
tp-preset-v1-<timestamp>-delete-<encoded name>.txt
```

The newest marker for a preset name wins. Saving the same name again replaces the logical preset without overwriting old files. Delete writes a newer delete marker. System Default is protected.

Do not replace this with an object database or `_files.read()` unless Lexicon compatibility has been proven.

## Accepted Preset Name workaround

`config.json` declares:

```json
"settings": {
  "Preset Name": "New preset"
}
```

The save dialog uses `settingsKey: "Preset Name"`. The code first accepts a usable direct dialog return value, then falls back to `_settings["Preset Name"]`. Validation blocks empty, `undefined`, `null`, protected and overlong names.

This workaround causes Lexicon to display About, Settings and Run below Configure TrackPrefixer. The UI is accepted because it prevents the previously reproduced `undefined` marker bug. Do not remove the setting without a real Lexicon test that proves preset Save, Load, replacement, Delete and restart persistence still work.

## Sorting engine

Number selected tracks and Continue selected numbering use the same selected-track comparator:

1. Map the configured primary field.
2. Compare missing placement.
3. Normalize and compare the primary value.
4. Apply primary direction.
5. If equal, repeat for the secondary field.
6. If still equal, preserve selection order through the integer index tie-breaker.

Numeric normalization is shared by Year, BPM and Rating. Text normalization is shared by Title and Artist. Date Added has its own parser.

## Date Added semantics

Date Added compares calendar days only. Hidden times are deliberately ignored so a secondary sort applies across every track showing the same date in Lexicon.

The parser accepts Lexicon Date objects, ISO-like values and localized date strings. It converts a valid value to a local year-month-day key. Invalid values count as missing and increment the compact unparsed-date counter.

Any future Date Added change must be applied identically to Number and Continue.

## Number and Continue contract

Shared behavior:

- Same primary and secondary sorting.
- Same Ascending and Descending handling.
- Same Missing First and Last handling.
- Same Title, Grouping and Comment targets.
- Same Replace and Skip handling.
- Same canonical prefix recognition.

Number selected tracks:

- Uses Start number.
- Uses Selected tracks, Auto library size or Fixed width.
- Expands width when the assigned number requires it.

Continue selected numbering:

- Scans the main library for the highest matching prefix.
- Ignores Start number.
- Ignores the configured width mode.
- Preserves the width of the highest matching library prefix.
- Expands width only at a digit boundary.
- If no library prefix exists, starts at 1 with width 1.

## Prefix compatibility

Canonical format:

```text
0001* Track Title
```

Detection pattern:

```text
^[0-9]+\*\s
```

The asterisk and following space prevent ordinary titles such as `1999 (Original Mix)` from matching accidentally.

## Verified test record

Focused runtime tests verified:

- Preset Save, Load, replacement, Delete and persistence after restart.
- Review and save.
- Date Added primary sorting with Year and BPM secondary sorting.
- Date Added ignoring time of day.
- Year ascending and descending.
- Missing values First and Last.
- Rating numeric input.
- Artist text input with Year tie-breaking.
- Title, Grouping and Comment targets.
- Replace and Skip in Number and Continue.
- Selected, Fixed and Auto library-size width paths.
- Continue preserving existing prefix width.
- Remove selected prefixes.

A 418-track stress test verified:

- Four-digit Auto library size prefixes.
- Exact prefix sequence `0001*` through `0418*`.
- No missing or duplicate numbers.
- Date Added ascending by calendar day.
- BPM descending within each date group.
- Missing BPM values last.
- Zero unparsed Date Added values.
- No clone error.

See `TESTING.md` for the reusable regression suite.

## Change discipline

- Start from the latest complete user-supplied or verified ZIP.
- Make one behavioral change at a time.
- Do not rewrite the stable numbering engine for cosmetic cleanup.
- Preserve backward compatibility.
- Return complete replacement files and a complete ZIP.
- If `config.json` changes, return the whole file.
- If JavaScript changes, return complete JavaScript files.
- Never claim a ZIP was rebuilt or tested unless the actual artifact was created and checked.

## Release verification

Before distributing a build:

1. Run `node --check` on every JavaScript file.
2. Parse `config.json`.
3. Run an archive integrity test.
4. Confirm the internal folder name matches the build.
5. Confirm the intended modified code is present inside the archive.
6. Confirm unrelated runtime files are unchanged or explain every difference.
7. Update VERSION, About, README, CHANGELOG, TESTING and handoff documentation.

## Roadmap

The stable settings and sorting release is complete. Future work is optional and should be isolated:

1. Optional separator configuration with legacy-prefix recognition.
2. Explicit opt-in normalization of existing prefix widths.
3. Additional target fields only after permissions and field names are verified.
4. Preset rename, duplicate, import or export only if Lexicon-safe storage remains simple.
5. Whole-library sorting remains high risk because track objects cannot be accumulated safely across batches.
