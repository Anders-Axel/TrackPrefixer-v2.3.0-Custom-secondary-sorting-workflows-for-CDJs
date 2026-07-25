/*
TrackPrefixer v2.3.0

Created by AndersAxel.
Designed and developed by AndersAxel with AI-assisted development.
License: MIT
*/

/* TrackPrefixer v2.1 */

function loadSharedSettings() {
  let targetFieldChoice = "Title"
  let primarySortChoice = "Current Lexicon order"
  let primaryDirectionChoice = "Ascending"
  let secondarySortChoice = "None"
  let secondaryDirectionChoice = "Ascending"
  let missingValuesChoice = "Last"
  let prefixWidthModeChoice = "Selected tracks"
  let fixedPrefixWidthChoice = "4"
  let startNumberChoice = "1"
  let existingPrefixChoice = "Replace"
  let newestTimestamp = -1
  let newestParts = null
  const filenames = _files.list()

  for (let fileIndex = 0; fileIndex < filenames.length; fileIndex++) {
    const filename = String(filenames[fileIndex])

    if (filename.indexOf("tp-settings-") === 0 && filename.substring(filename.length - 4) === ".txt") {
      const parts = filename.substring(0, filename.length - 4).split("-")

      if (parts.length === 13) {
        const timestamp = Number(parts[2])

        if (!isNaN(timestamp) && timestamp > newestTimestamp) {
          newestTimestamp = timestamp
          newestParts = parts
        }
      }
    }
  }

  if (newestParts !== null) {
    const targetFields = ["Title", "Grouping", "Comment"]
    const primarySorts = ["Current Lexicon order", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"]
    const primaryDirections = ["Ascending", "Descending"]
    const secondarySorts = ["None", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"]
    const secondaryDirections = ["Ascending", "Descending"]
    const missingValues = ["Last", "First"]
    const prefixWidthModes = ["Auto library size", "Selected tracks", "Fixed width"]
    const existingPrefixes = ["Replace", "Skip"]
    const targetIndex = Number(newestParts[3])
    const primarySortIndex = Number(newestParts[4])
    const primaryDirectionIndex = Number(newestParts[5])
    const secondarySortIndex = Number(newestParts[6])
    const secondaryDirectionIndex = Number(newestParts[7])
    const missingValuesIndex = Number(newestParts[8])
    const prefixWidthModeIndex = Number(newestParts[9])
    const fixedWidth = Number(newestParts[10])
    const startNumber = Number(newestParts[11])
    const existingPrefixIndex = Number(newestParts[12])

    if (targetIndex >= 0 && targetIndex < targetFields.length) {
      targetFieldChoice = targetFields[targetIndex]
    }

    if (primarySortIndex >= 0 && primarySortIndex < primarySorts.length) {
      primarySortChoice = primarySorts[primarySortIndex]
    }

    if (primaryDirectionIndex >= 0 && primaryDirectionIndex < primaryDirections.length) {
      primaryDirectionChoice = primaryDirections[primaryDirectionIndex]
    }

    if (secondarySortIndex >= 0 && secondarySortIndex < secondarySorts.length) {
      secondarySortChoice = secondarySorts[secondarySortIndex]
    }

    if (secondaryDirectionIndex >= 0 && secondaryDirectionIndex < secondaryDirections.length) {
      secondaryDirectionChoice = secondaryDirections[secondaryDirectionIndex]
    }

    if (missingValuesIndex >= 0 && missingValuesIndex < missingValues.length) {
      missingValuesChoice = missingValues[missingValuesIndex]
    }

    if (prefixWidthModeIndex >= 0 && prefixWidthModeIndex < prefixWidthModes.length) {
      prefixWidthModeChoice = prefixWidthModes[prefixWidthModeIndex]
    }

    if (!isNaN(fixedWidth) && fixedWidth >= 1 && fixedWidth <= 12 && Math.floor(fixedWidth) === fixedWidth) {
      fixedPrefixWidthChoice = String(fixedWidth)
    }

    if (!isNaN(startNumber) && startNumber >= 0 && Math.floor(startNumber) === startNumber) {
      startNumberChoice = String(startNumber)
    }

    if (existingPrefixIndex >= 0 && existingPrefixIndex < existingPrefixes.length) {
      existingPrefixChoice = existingPrefixes[existingPrefixIndex]
    }
  }

  return {
    targetFieldChoice: targetFieldChoice,
    primarySortChoice: primarySortChoice,
    primaryDirectionChoice: primaryDirectionChoice,
    secondarySortChoice: secondarySortChoice,
    secondaryDirectionChoice: secondaryDirectionChoice,
    missingValuesChoice: missingValuesChoice,
    prefixWidthModeChoice: prefixWidthModeChoice,
    fixedPrefixWidthChoice: fixedPrefixWidthChoice,
    startNumberChoice: startNumberChoice,
    existingPrefixChoice: existingPrefixChoice
  }
}

const sharedSettings = loadSharedSettings()
const targetFieldChoice = sharedSettings.targetFieldChoice
const primarySortChoice = sharedSettings.primarySortChoice
const primaryDirectionChoice = sharedSettings.primaryDirectionChoice
const secondarySortChoice = sharedSettings.secondarySortChoice
const secondaryDirectionChoice = sharedSettings.secondaryDirectionChoice
const missingValuesChoice = sharedSettings.missingValuesChoice
const prefixWidthModeChoice = sharedSettings.prefixWidthModeChoice
const fixedPrefixWidthChoice = sharedSettings.fixedPrefixWidthChoice
const startNumberChoice = sharedSettings.startNumberChoice
const existingPrefixChoice = sharedSettings.existingPrefixChoice

let targetField = "title"

if (targetFieldChoice === "Grouping") {
  targetField = "grouping"
}

if (targetFieldChoice === "Comment") {
  targetField = "comment"
}

const selectedTracks = _vars.tracksSelected

if (!selectedTracks || selectedTracks.length === 0) {
  throw new Error("No tracks selected")
}

let changed = 0
let skipped = 0

for (let selectedIndex = 0; selectedIndex < selectedTracks.length; selectedIndex++) {
  const currentValue = String(selectedTracks[selectedIndex][targetField] || "")
  const prefixMatch = currentValue.match(/^[0-9]+\*\s/)

  if (prefixMatch) {
    selectedTracks[selectedIndex][targetField] = currentValue.substring(prefixMatch[0].length)
    changed = changed + 1
  } else {
    skipped = skipped + 1
  }
}

const timestamp = String(Date.now())
const filename = "remove-prefixes-v2.1-" + timestamp + ".txt"
const log =
  "TrackPrefixer run log\n" +
  "Action: Remove selected prefixes v2.1\n" +
  "Timestamp: " + new Date().toString() + "\n" +
  "Target field: " + targetFieldChoice + "\n" +
  "Selected tracks: " + selectedTracks.length + "\n" +
  "Prefixes removed: " + changed + "\n" +
  "Tracks without matching prefix: " + skipped + "\n"

_files.write(filename, log)

_helpers.Report("Target field: " + targetFieldChoice)
_helpers.Report("Prefixes removed: " + changed)
_helpers.Report("Tracks without matching prefix: " + skipped)
_helpers.Report("Saved last number was not changed")
_helpers.Report("Log file: files/" + filename)
