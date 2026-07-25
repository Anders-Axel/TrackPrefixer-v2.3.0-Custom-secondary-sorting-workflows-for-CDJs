# Contributing to TrackPrefixer

TrackPrefixer was created by AndersAxel and developed with AI assistance. Contributions and future maintainers are welcome.

## Read first

Before changing runtime code, read:

- `README.md`
- `MAINTAINERS.md`
- `TESTING.md`
- `CHANGELOG.md`

## Preserve the verified runtime constraints

1. Do not sort Lexicon's selected-track array directly.
2. Sort integer indexes only.
3. Do not retain library track objects across `await` calls.
4. Use `_library.track.getNextAllBatch()` for full-library scans.
5. Keep persistent settings as primitive values.
6. Do not serialize track objects into logs, files or storage.
7. Keep existing `0001* ` prefixes backward compatible unless a breaking change is explicitly approved.
8. Keep Number selected tracks and Continue selected numbering sorting behavior aligned.
9. Preserve Date Added calendar-day semantics unless the product decision is explicitly changed.
10. Preserve the Continue contract: highest library prefix, inherited width, no Start number and no configured width mode.

## Preset compatibility

The visible `Preset Name` setting is an accepted Lexicon compatibility workaround. It prevents preset markers from being written with the literal name `undefined`. Do not remove `settingsKey`, the config setting or the fallback without testing the complete preset lifecycle in Lexicon.

## Development process

- Start from the latest complete verified ZIP.
- Make one behavioral change at a time.
- Test the smallest code path that proves the change.
- Use code inspection to avoid an unnecessary full combination matrix.
- Test any changed Lexicon field with real runtime values.
- Test Continue against a real library whenever its scan, sorting or width behavior changes.
- Update `CHANGELOG.md` for every user-visible change.
- Update version labels in VERSION, About and documentation.
- Return complete replacement files and a complete plugin ZIP.

## Minimum regression gates

For a sorting change:

- Primary comparison.
- Secondary tie-break.
- Ascending or Descending branch affected by the change.
- Missing placement affected by the change.
- Number and Continue parity.

For a Date Added change:

- Different calendar dates.
- Same date with different hidden times.
- Secondary sorting across the full same-day group.
- Invalid or missing value count.

For a preset change:

- Save.
- Load.
- Save same name again.
- Delete.
- Restart persistence.
- No `undefined` or `null` marker.

For a width or Continue change:

- Existing one-digit prefix.
- Existing padded prefix.
- Digit-boundary expansion.
- Skip does not consume a number.

## Compatibility

A release must not rewrite existing prefixes automatically unless the user explicitly enables or runs that behavior.

## Pull requests

Describe:

- what changed
- why it changed
- how it was tested
- which files changed
- whether prefix compatibility changed
- whether Number and Continue remain aligned
- whether the clone-safety rules remain intact
- whether the accepted Lexicon Settings submenu changed
