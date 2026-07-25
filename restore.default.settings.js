/*
TrackPrefixer v2.3.0

Created by AndersAxel.
Designed and developed by AndersAxel with AI-assisted development.
License: MIT
*/

/* TrackPrefixer v2.1 */

_storage.save("setting.targetField", "Title")
_storage.save("setting.primarySort", "Current Lexicon order")
_storage.save("setting.primaryDirection", "Ascending")
_storage.save("setting.secondarySort", "None")
_storage.save("setting.secondaryDirection", "Ascending")
_storage.save("setting.missingValues", "Last")
_storage.save("setting.prefixWidthMode", "Selected tracks")
_storage.save("setting.fixedPrefixWidth", "4")
_storage.save("setting.startNumber", "1")
_storage.save("setting.existingPrefixes", "Replace")

const settingsTimestamp = String(Date.now())
const settingsFilename = "tp-settings-" + settingsTimestamp + "-0-0-0-0-0-0-1-4-1-0.txt"
_files.write(settingsFilename, "TrackPrefixer shared settings marker")

const timestamp = String(Date.now())
const filename = "restore-default-settings-" + timestamp + ".txt"
const log =
  "TrackPrefixer run log\n" +
  "Action: Restore default settings\n" +
  "Timestamp: " + new Date().toString() + "\n" +
  "Target field: Title\n" +
  "Primary sort: Current Lexicon order\n" +
  "Primary direction: Ascending\n" +
  "Secondary sort: None\n" +
  "Secondary direction: Ascending\n" +
  "Missing values: Last\n" +
  "Prefix width mode: Selected tracks\n" +
  "Fixed prefix width: 4\n" +
  "Start number: 1\n" +
  "Existing prefixes: Replace\n"

_files.write(filename, log)

_helpers.Report("TrackPrefixer default settings restored")
_helpers.Report("Target field: Title")
_helpers.Report("Primary sort: Current Lexicon order")
_helpers.Report("Prefix width mode: Selected tracks")
_helpers.Report("Existing prefixes: Replace")
_helpers.Report("Log file: files/" + filename)
