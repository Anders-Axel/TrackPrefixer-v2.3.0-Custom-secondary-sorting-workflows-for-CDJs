# TrackPrefixer Testing Record

## Status

TrackPrefixer v2.3.0 is the stable documented release. The runtime behavior described here passed the focused Lexicon tests and the 418-track stress test.

## Verified focused tests

### Configure and presets

- Configure opens and exits safely.
- Review and save succeeds.
- Preset names are saved correctly and never as `undefined`.
- Load restores all encoded settings.
- Saving the same name loads the newest marker.
- Delete removes the logical preset.
- System Default remains protected.
- Presets survive a complete Lexicon restart.

### Sorting

- Date Added primary and Year secondary.
- Date Added primary and BPM secondary.
- Date Added ignores hidden time of day.
- Year ascending.
- Year descending.
- Missing values First.
- Missing values Last.
- Rating numeric input.
- Artist text ordering with Year tie-break.
- Current Lexicon order.

### Targets and prefix handling

- Title target.
- Grouping target and removal.
- Comment target and removal.
- Replace existing prefixes.
- Skip existing prefixes in Number.
- Skip existing prefixes in Continue.
- Skipped tracks do not consume a number.

### Width and continuation

- Selected tracks width.
- Fixed width.
- Auto library size.
- Number expands across digit boundaries.
- Continue starts after the highest library prefix.
- Continue preserves existing prefix width.
- Continue ignores Start number and configured width mode.
- Continue uses the same sorting rules as Number.

## 418-track stress test

Settings:

```text
Target field: Title
Existing prefixes: Replace
Primary sort: Date Added
Primary direction: Ascending
Secondary sort: BPM
Secondary direction: Descending
Missing values: Last
Prefix width mode: Auto library size
Start number: 1
```

Observed result:

- 418 tracks numbered.
- 418 existing prefixes replaced in the rerun.
- Prefix width used: 4.
- Exact sequence from `0001*` through `0418*`.
- No missing prefix numbers.
- No duplicate prefix numbers.
- Date Added never moved backward.
- BPM descended within each calendar-day group.
- Missing BPM values appeared last within their group.
- Unparsed Date Added values: 0.
- No clone error.

## Minimal future regression suite

A future build does not need every possible combination. Test unique code paths:

1. Preset lifecycle if Configure or config changes.
2. One numeric field, one text field and Date Added if sorting changes.
3. A same-day Date Added group with different hidden times.
4. Number and Continue parity.
5. One target-field write and removal if target handling changes.
6. Replace and Skip if prefix handling changes.
7. A width boundary if numbering or Continue changes.
8. A moderate real-library run if clone-sensitive code changes.

## Accepted UI quirk

Configure TrackPrefixer appears with About, Settings and Run. The Settings page exposes `Preset Name`. This is accepted because it is the verified fallback that prevents `undefined` preset names. Use Run to launch Configure.
