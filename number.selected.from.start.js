/*
TrackPrefixer v2.3.0

Created by AndersAxel.
Designed and developed by AndersAxel with AI-assisted development.
License: MIT
*/

/*
TrackPrefixer v2.1

Runs immediately with persistent settings saved by Configure TrackPrefixer.
Only primitive settings and integer indexes are retained. Lexicon track arrays
are never sorted directly, and library track objects are not retained across awaits.
*/

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

const startNumber = Number(startNumberChoice)

if (isNaN(startNumber) || startNumber < 0 || Math.floor(startNumber) !== startNumber) {
  throw new Error("Start number must be a whole number that is zero or greater")
}

let mainLibraryTrackCount = 0
let tracksScanned = 0
let incomingTracksIgnored = 0

if (prefixWidthModeChoice === "Auto library size") {
  let batch = await _library.track.getNextAllBatch()

  while (batch.length > 0) {
    for (let batchIndex = 0; batchIndex < batch.length; batchIndex++) {
      const incoming =
        batch[batchIndex].incoming === 1 ||
        batch[batchIndex].incoming === "1" ||
        batch[batchIndex].incoming === true

      tracksScanned = tracksScanned + 1

      if (incoming) {
        incomingTracksIgnored = incomingTracksIgnored + 1
      } else {
        mainLibraryTrackCount = mainLibraryTrackCount + 1
      }
    }

    batch = []
    batch = await _library.track.getNextAllBatch()
  }
}

const selectedTracks = _vars.tracksSelected

if (!selectedTracks || selectedTracks.length === 0) {
  throw new Error("No tracks selected")
}

let targetField = "title"

if (targetFieldChoice === "Grouping") {
  targetField = "grouping"
}

if (targetFieldChoice === "Comment") {
  targetField = "comment"
}

function getSortField(choice) {
  if (choice === "Date Added") {
    return "dateAdded"
  }

  if (choice === "Year") {
    return "year"
  }

  if (choice === "Title") {
    return "title"
  }

  if (choice === "Artist") {
    return "artist"
  }

  if (choice === "BPM") {
    return "bpm"
  }

  if (choice === "Rating") {
    return "rating"
  }

  return ""
}

function dateAddedDayKey(year, monthIndex, day) {
  const numericYear = Number(year)
  const numericMonthIndex = Number(monthIndex)
  const numericDay = Number(day)

  if (isNaN(numericYear) || isNaN(numericMonthIndex) || isNaN(numericDay)) {
    return null
  }

  const validationDate = new Date(Date.UTC(numericYear, numericMonthIndex, numericDay))

  if (
    validationDate.getUTCFullYear() !== numericYear ||
    validationDate.getUTCMonth() !== numericMonthIndex ||
    validationDate.getUTCDate() !== numericDay
  ) {
    return null
  }

  return numericYear * 10000 + (numericMonthIndex + 1) * 100 + numericDay
}

function dateAddedDayKeyFromTimestamp(timestamp) {
  if (isNaN(timestamp)) {
    return null
  }

  const dateValue = new Date(timestamp)

  if (isNaN(dateValue.getTime())) {
    return null
  }

  return dateAddedDayKey(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate())
}

function parseDateAddedValue(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value.getTime === "function") {
    const directTimestamp = value.getTime()
    const directDayKey = dateAddedDayKeyFromTimestamp(directTimestamp)

    if (directDayKey !== null) {
      return directDayKey
    }
  }

  if (typeof value === "number") {
    const numericDayKey = dateAddedDayKeyFromTimestamp(value)

    if (numericDayKey !== null) {
      return numericDayKey
    }
  }

  const dateText = String(value).replace(/^\s+|\s+$/g, "")

  if (dateText === "") {
    return null
  }

  const isoDateMatch = dateText.match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (isoDateMatch) {
    return dateAddedDayKey(
      Number(isoDateMatch[1]),
      Number(isoDateMatch[2]) - 1,
      Number(isoDateMatch[3])
    )
  }

  const englishDateMatch = dateText.match(/^[A-Za-z]{3}\s+([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})/)

  if (englishDateMatch) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthIndex = monthNames.indexOf(englishDateMatch[1])

    if (monthIndex >= 0) {
      return dateAddedDayKey(
        Number(englishDateMatch[3]),
        monthIndex,
        Number(englishDateMatch[2])
      )
    }
  }

  let parsedTimestamp = Date.parse(dateText)
  let parsedDayKey = dateAddedDayKeyFromTimestamp(parsedTimestamp)

  if (parsedDayKey !== null) {
    return parsedDayKey
  }

  const localizedZoneStart = dateText.indexOf(" (")

  if (localizedZoneStart > 0) {
    const withoutLocalizedZone = dateText.substring(0, localizedZoneStart)
    parsedTimestamp = Date.parse(withoutLocalizedZone)
    parsedDayKey = dateAddedDayKeyFromTimestamp(parsedTimestamp)

    if (parsedDayKey !== null) {
      return parsedDayKey
    }
  }

  return null
}

function isMissingValue(value, field) {
  if (value === null || value === undefined || String(value).replace(/^\s+|\s+$/g, "") === "") {
    return true
  }

  if (field === "dateAdded") {
    return parseDateAddedValue(value) === null
  }

  if (field === "year" || field === "bpm" || field === "rating") {
    const numericValue = Number(value)

    if (isNaN(numericValue) || numericValue === 0) {
      return true
    }
  }

  return false
}

function normalizeSortValue(value, field) {
  if (field === "year" || field === "bpm" || field === "rating") {
    return Number(value)
  }

  if (field === "dateAdded") {
    return parseDateAddedValue(value)
  }

  return String(value).toLowerCase()
}

function compareTrackValues(valueA, valueB, field, direction, missingPlacement) {
  if (field === "") {
    return 0
  }

  const missingA = isMissingValue(valueA, field)
  const missingB = isMissingValue(valueB, field)

  if (missingA && missingB) {
    return 0
  }

  if (missingA) {
    if (missingPlacement === "First") {
      return -1
    }

    return 1
  }

  if (missingB) {
    if (missingPlacement === "First") {
      return 1
    }

    return -1
  }

  const normalizedA = normalizeSortValue(valueA, field)
  const normalizedB = normalizeSortValue(valueB, field)
  let comparison = 0

  if (normalizedA < normalizedB) {
    comparison = -1
  }

  if (normalizedA > normalizedB) {
    comparison = 1
  }

  if (direction === "Descending") {
    comparison = comparison * -1
  }

  return comparison
}

const primarySortField = getSortField(primarySortChoice)
const secondarySortField = getSortField(secondarySortChoice)
let unparsedDateAddedValues = 0

if (primarySortField === "dateAdded" || secondarySortField === "dateAdded") {
  for (let dateIndex = 0; dateIndex < selectedTracks.length; dateIndex++) {
    if (parseDateAddedValue(selectedTracks[dateIndex].dateAdded) === null) {
      unparsedDateAddedValues = unparsedDateAddedValues + 1
    }
  }
}

const selectedIndexes = []

for (let selectedIndex = 0; selectedIndex < selectedTracks.length; selectedIndex++) {
  selectedIndexes.push(selectedIndex)
}

if (primarySortField !== "") {
  selectedIndexes.sort(function(indexA, indexB) {
    const primaryResult = compareTrackValues(
      selectedTracks[indexA][primarySortField],
      selectedTracks[indexB][primarySortField],
      primarySortField,
      primaryDirectionChoice,
      missingValuesChoice
    )

    if (primaryResult !== 0) {
      return primaryResult
    }

    if (secondarySortField !== "") {
      const secondaryResult = compareTrackValues(
        selectedTracks[indexA][secondarySortField],
        selectedTracks[indexB][secondarySortField],
        secondarySortField,
        secondaryDirectionChoice,
        missingValuesChoice
      )

      if (secondaryResult !== 0) {
        return secondaryResult
      }
    }

    return indexA - indexB
  })
}

const plannedLastNumber = startNumber + selectedTracks.length - 1
let prefixWidth = 1

if (prefixWidthModeChoice === "Auto library size") {
  prefixWidth = String(mainLibraryTrackCount).length
}

if (prefixWidthModeChoice === "Selected tracks") {
  prefixWidth = String(plannedLastNumber).length
}

if (prefixWidthModeChoice === "Fixed width") {
  prefixWidth = Number(fixedPrefixWidthChoice)
}

const requiredWidth = String(plannedLastNumber).length

if (prefixWidth < requiredWidth) {
  prefixWidth = requiredWidth
}

if (prefixWidth < 1) {
  prefixWidth = 1
}

let nextNumber = startNumber
let changed = 0
let skippedExistingPrefixes = 0
let existingPrefixesReplaced = 0

for (let orderIndex = 0; orderIndex < selectedIndexes.length; orderIndex++) {
  const selectedIndex = selectedIndexes[orderIndex]
  const currentValue = String(selectedTracks[selectedIndex][targetField] || "")
  const prefixMatch = currentValue.match(/^[0-9]+\*\s/)

  if (prefixMatch && existingPrefixChoice === "Skip") {
    skippedExistingPrefixes = skippedExistingPrefixes + 1
  } else {
    let cleanValue = currentValue

    if (prefixMatch) {
      cleanValue = currentValue.substring(prefixMatch[0].length)
      existingPrefixesReplaced = existingPrefixesReplaced + 1
    }

    let numberText = String(nextNumber)

    while (numberText.length < prefixWidth) {
      numberText = "0" + numberText
    }

    selectedTracks[selectedIndex][targetField] = numberText + "* " + cleanValue
    nextNumber = nextNumber + 1
    changed = changed + 1
  }
}

let lastAssignedNumber = startNumber - 1

if (changed > 0) {
  lastAssignedNumber = nextNumber - 1
}

_storage.save("lastNumber", lastAssignedNumber)
_storage.save("prefixWidth", prefixWidth)

const timestamp = String(Date.now())
const filename = "number-selected-v2.1-" + timestamp + ".txt"
const log =
  "TrackPrefixer run log\n" +
  "Action: Number selected tracks v2.1\n" +
  "Timestamp: " + new Date().toString() + "\n" +
  "Target field: " + targetFieldChoice + "\n" +
  "Primary sort: " + primarySortChoice + "\n" +
  "Primary direction: " + primaryDirectionChoice + "\n" +
  "Secondary sort: " + secondarySortChoice + "\n" +
  "Secondary direction: " + secondaryDirectionChoice + "\n" +
  "Missing values: " + missingValuesChoice + "\n" +
  "Prefix width mode: " + prefixWidthModeChoice + "\n" +
  "Prefix width used: " + prefixWidth + "\n" +
  "Start number: " + startNumber + "\n" +
  "Existing prefix handling: " + existingPrefixChoice + "\n" +
  "Library tracks scanned: " + tracksScanned + "\n" +
  "Incoming tracks ignored: " + incomingTracksIgnored + "\n" +
  "Main library tracks counted: " + mainLibraryTrackCount + "\n" +
  "Selected tracks: " + selectedTracks.length + "\n" +
  "Tracks numbered: " + changed + "\n" +
  "Existing prefixes replaced: " + existingPrefixesReplaced + "\n" +
  "Existing prefixes skipped: " + skippedExistingPrefixes + "\n" +
  "Unparsed Date Added values: " + unparsedDateAddedValues + "\n" +
  "Last assigned number: " + lastAssignedNumber + "\n"

_files.write(filename, log)

_helpers.Report("Target field: " + targetFieldChoice)
_helpers.Report("Primary sort: " + primarySortChoice)
_helpers.Report("Secondary sort: " + secondarySortChoice)
_helpers.Report("Prefix width mode: " + prefixWidthModeChoice)
_helpers.Report("Prefix width used: " + prefixWidth)
_helpers.Report("Tracks numbered: " + changed)
_helpers.Report("Existing prefixes replaced: " + existingPrefixesReplaced)
_helpers.Report("Existing prefixes skipped: " + skippedExistingPrefixes)
_helpers.Report("Unparsed Date Added values: " + unparsedDateAddedValues)
_helpers.Report("Last assigned number: " + lastAssignedNumber)
_helpers.Report("Log file: files/" + filename)
