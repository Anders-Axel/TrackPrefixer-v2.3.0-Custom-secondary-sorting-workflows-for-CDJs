/*
TrackPrefixer v2.3.0

Created by AndersAxel.
Designed and developed by AndersAxel with AI-assisted development.
License: MIT
*/

/*
Configure TrackPrefixer uses a menu-based dialog flow.
The main menu is always the safe exit point. Each settings section returns
straight to the menu when its Menu button is used. Changes remain temporary
until Review and save is confirmed.

Preset storage follows the same Lexicon-safe marker-file pattern as shared
settings. Preset names and values are reconstructed from filenames only.
No preset database object is stored, and _files.read() is not used.
*/

function loadText(key, fallback) {
  const value = _storage.load(key)

  if (value === null || value === undefined || String(value) === "") {
    return fallback
  }

  return String(value)
}

function loadSharedSettingsForDialog() {
  const settings = {
    targetField: loadText("setting.targetField", "Title"),
    primarySort: loadText("setting.primarySort", "Current Lexicon order"),
    primaryDirection: loadText("setting.primaryDirection", "Ascending"),
    secondarySort: loadText("setting.secondarySort", "None"),
    secondaryDirection: loadText("setting.secondaryDirection", "Ascending"),
    missingValues: loadText("setting.missingValues", "Last"),
    prefixWidthMode: loadText("setting.prefixWidthMode", "Selected tracks"),
    fixedPrefixWidth: loadText("setting.fixedPrefixWidth", "4"),
    startNumber: loadText("setting.startNumber", "1"),
    existingPrefixes: loadText("setting.existingPrefixes", "Replace")
  }
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
    const directions = ["Ascending", "Descending"]
    const secondarySorts = ["None", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"]
    const missingValues = ["Last", "First"]
    const prefixWidthModes = ["Auto library size", "Selected tracks", "Fixed width"]
    const existingPrefixes = ["Replace", "Skip"]
    const values = [
      ["targetField", targetFields, 3],
      ["primarySort", primarySorts, 4],
      ["primaryDirection", directions, 5],
      ["secondarySort", secondarySorts, 6],
      ["secondaryDirection", directions, 7],
      ["missingValues", missingValues, 8],
      ["prefixWidthMode", prefixWidthModes, 9],
      ["existingPrefixes", existingPrefixes, 12]
    ]

    for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
      const settingName = values[valueIndex][0]
      const options = values[valueIndex][1]
      const partIndex = values[valueIndex][2]
      const optionIndex = Number(newestParts[partIndex])

      if (optionIndex >= 0 && optionIndex < options.length) {
        settings[settingName] = options[optionIndex]
      }
    }

    const fixedWidth = Number(newestParts[10])
    const startNumber = Number(newestParts[11])

    if (!isNaN(fixedWidth) && fixedWidth >= 1 && fixedWidth <= 12 && Math.floor(fixedWidth) === fixedWidth) {
      settings.fixedPrefixWidth = String(fixedWidth)
    }

    if (!isNaN(startNumber) && startNumber >= 0 && Math.floor(startNumber) === startNumber) {
      settings.startNumber = String(startNumber)
    }
  }

  return settings
}

const SYSTEM_PRESET_NAME = "System Default"

function normalizeDialogValue(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (value.value !== null && value.value !== undefined) {
    return String(value.value)
  }

  if (value.text !== null && value.text !== undefined) {
    return String(value.text)
  }

  if (value.label !== null && value.label !== undefined) {
    return String(value.label)
  }

  return null
}

function systemDefaultSettings() {
  return {
    targetField: "Title",
    primarySort: "Current Lexicon order",
    primaryDirection: "Ascending",
    secondarySort: "None",
    secondaryDirection: "Ascending",
    missingValues: "Last",
    prefixWidthMode: "Selected tracks",
    fixedPrefixWidth: "4",
    startNumber: "1",
    existingPrefixes: "Replace"
  }
}

function copySettingsInto(target, source) {
  target.targetField = String(source.targetField)
  target.primarySort = String(source.primarySort)
  target.primaryDirection = String(source.primaryDirection)
  target.secondarySort = String(source.secondarySort)
  target.secondaryDirection = String(source.secondaryDirection)
  target.missingValues = String(source.missingValues)
  target.prefixWidthMode = String(source.prefixWidthMode)
  target.fixedPrefixWidth = String(source.fixedPrefixWidth)
  target.startNumber = String(source.startNumber)
  target.existingPrefixes = String(source.existingPrefixes)
}

function encodePresetName(name) {
  let encoded = ""
  const text = String(name)

  for (let index = 0; index < text.length; index++) {
    let hex = text.charCodeAt(index).toString(16)

    while (hex.length < 4) {
      hex = "0" + hex
    }

    encoded += hex
  }

  return encoded
}

function decodePresetName(encoded) {
  let decoded = ""
  const text = String(encoded)

  if (text.length === 0 || text.length % 4 !== 0) {
    return ""
  }

  for (let index = 0; index < text.length; index += 4) {
    const code = Number("0x" + text.substring(index, index + 4))

    if (isNaN(code)) {
      return ""
    }

    decoded += String.fromCharCode(code)
  }

  return decoded
}

function settingsToPresetParts(settings) {
  return [
    ["Title", "Grouping", "Comment"].indexOf(String(settings.targetField)),
    ["Current Lexicon order", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"].indexOf(String(settings.primarySort)),
    ["Ascending", "Descending"].indexOf(String(settings.primaryDirection)),
    ["None", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"].indexOf(String(settings.secondarySort)),
    ["Ascending", "Descending"].indexOf(String(settings.secondaryDirection)),
    ["Last", "First"].indexOf(String(settings.missingValues)),
    ["Auto library size", "Selected tracks", "Fixed width"].indexOf(String(settings.prefixWidthMode)),
    String(settings.fixedPrefixWidth),
    String(settings.startNumber),
    ["Replace", "Skip"].indexOf(String(settings.existingPrefixes))
  ]
}

function presetPartsToSettings(parts, startIndex) {
  const targetFields = ["Title", "Grouping", "Comment"]
  const primarySorts = ["Current Lexicon order", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"]
  const directions = ["Ascending", "Descending"]
  const secondarySorts = ["None", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"]
  const missingValues = ["Last", "First"]
  const prefixWidthModes = ["Auto library size", "Selected tracks", "Fixed width"]
  const existingPrefixes = ["Replace", "Skip"]
  const result = systemDefaultSettings()
  const targetFieldIndex = Number(parts[startIndex])
  const primarySortIndex = Number(parts[startIndex + 1])
  const primaryDirectionIndex = Number(parts[startIndex + 2])
  const secondarySortIndex = Number(parts[startIndex + 3])
  const secondaryDirectionIndex = Number(parts[startIndex + 4])
  const missingValuesIndex = Number(parts[startIndex + 5])
  const prefixWidthModeIndex = Number(parts[startIndex + 6])
  const fixedWidth = Number(parts[startIndex + 7])
  const startNumber = Number(parts[startIndex + 8])
  const existingPrefixIndex = Number(parts[startIndex + 9])

  if (targetFieldIndex >= 0 && targetFieldIndex < targetFields.length) {
    result.targetField = targetFields[targetFieldIndex]
  }
  if (primarySortIndex >= 0 && primarySortIndex < primarySorts.length) {
    result.primarySort = primarySorts[primarySortIndex]
  }
  if (primaryDirectionIndex >= 0 && primaryDirectionIndex < directions.length) {
    result.primaryDirection = directions[primaryDirectionIndex]
  }
  if (secondarySortIndex >= 0 && secondarySortIndex < secondarySorts.length) {
    result.secondarySort = secondarySorts[secondarySortIndex]
  }
  if (secondaryDirectionIndex >= 0 && secondaryDirectionIndex < directions.length) {
    result.secondaryDirection = directions[secondaryDirectionIndex]
  }
  if (missingValuesIndex >= 0 && missingValuesIndex < missingValues.length) {
    result.missingValues = missingValues[missingValuesIndex]
  }
  if (prefixWidthModeIndex >= 0 && prefixWidthModeIndex < prefixWidthModes.length) {
    result.prefixWidthMode = prefixWidthModes[prefixWidthModeIndex]
  }
  if (!isNaN(fixedWidth) && fixedWidth >= 1 && fixedWidth <= 12 && Math.floor(fixedWidth) === fixedWidth) {
    result.fixedPrefixWidth = String(fixedWidth)
  }

  if (!isNaN(startNumber) && startNumber >= 0 && Math.floor(startNumber) === startNumber) {
    result.startNumber = String(startNumber)
  }
  if (existingPrefixIndex >= 0 && existingPrefixIndex < existingPrefixes.length) {
    result.existingPrefixes = existingPrefixes[existingPrefixIndex]
  }

  return result
}

function listPresetNames() {
  const names = []
  const timestamps = []
  const actions = []
  const filenames = _files.list()

  for (let fileIndex = 0; fileIndex < filenames.length; fileIndex++) {
    const filename = String(filenames[fileIndex])

    if (filename.indexOf("tp-preset-v1-") === 0 && filename.substring(filename.length - 4) === ".txt") {
      const parts = filename.substring(0, filename.length - 4).split("-")

      if (parts.length >= 6) {
        const timestamp = Number(parts[3])
        const action = String(parts[4])
        const name = decodePresetName(parts[5])

        if (!isNaN(timestamp) && name !== "" && (action === "save" || action === "delete")) {
          let nameIndex = names.indexOf(name)

          if (nameIndex < 0) {
            names.push(name)
            timestamps.push(-1)
            actions.push("")
            nameIndex = names.length - 1
          }

          if (timestamp > timestamps[nameIndex]) {
            timestamps[nameIndex] = timestamp
            actions[nameIndex] = action
          }
        }
      }
    }
  }

  const activeNames = [SYSTEM_PRESET_NAME]

  for (let nameIndex = 0; nameIndex < names.length; nameIndex++) {
    if (actions[nameIndex] === "save" && names[nameIndex] !== SYSTEM_PRESET_NAME && names[nameIndex] !== "undefined" && names[nameIndex] !== "null") {
      activeNames.push(String(names[nameIndex]))
    }
  }

  const userNames = activeNames.slice(1)
  userNames.sort()
  return [SYSTEM_PRESET_NAME].concat(userNames)
}

function loadPresetByName(name) {
  if (String(name) === SYSTEM_PRESET_NAME) {
    return systemDefaultSettings()
  }

  const encodedName = encodePresetName(name)
  const filenames = _files.list()
  let newestTimestamp = -1
  let newestSettings = null
  let newestAction = ""

  for (let fileIndex = 0; fileIndex < filenames.length; fileIndex++) {
    const filename = String(filenames[fileIndex])

    if (filename.indexOf("tp-preset-v1-") === 0 && filename.substring(filename.length - 4) === ".txt") {
      const parts = filename.substring(0, filename.length - 4).split("-")

      if (parts.length >= 6 && parts[5] === encodedName) {
        const timestamp = Number(parts[3])
        const action = String(parts[4])

        if (!isNaN(timestamp) && timestamp > newestTimestamp) {
          newestTimestamp = timestamp
          newestAction = action
          newestSettings = action === "save" && parts.length === 16 ? presetPartsToSettings(parts, 6) : null
        }
      }
    }
  }

  if (newestAction !== "save") {
    return null
  }

  return newestSettings
}

function validatePresetName(value) {
  const name = String(value).replace(/^\s+|\s+$/g, "")

  if (name === "") {
    throw new Error("Preset name cannot be empty")
  }

  if (name === "undefined" || name === "null") {
    throw new Error("Lexicon did not return the entered preset name. Please try again.")
  }

  if (name === SYSTEM_PRESET_NAME) {
    throw new Error("System Default is a protected preset name")
  }

  if (name.length > 60) {
    throw new Error("Preset name must be 60 characters or fewer")
  }

  return name
}

function writePresetSave(name, settings) {
  const parts = settingsToPresetParts(settings)
  const filename = "tp-preset-v1-" + String(Date.now()) + "-save-" + encodePresetName(name) + "-" + parts.join("-") + ".txt"
  _files.write(filename, "TrackPrefixer preset marker")
}

function writePresetDelete(name) {
  const filename = "tp-preset-v1-" + String(Date.now()) + "-delete-" + encodePresetName(name) + ".txt"
  _files.write(filename, "TrackPrefixer preset delete marker")
}

async function runPresetManager(settings) {
  let leavePresetManager = false

  while (!leavePresetManager) {
    const presetChoice = await _ui.showInputDialog({
      input: "select",
      message: "Preset Manager\nLoad a saved preset, save the current temporary settings, or delete a user preset. System Default is protected. Loaded settings remain temporary until Review and save is confirmed.",
      default: "Load preset",
      options: ["Load preset", "Save current settings", "Delete preset"],
      type: "primary",
      confirmLabel: "Open",
      skipLabel: "Menu"
    })

    if (presetChoice === null) {
      leavePresetManager = true
    } else if (String(presetChoice) === "Load preset") {
      const presetNames = listPresetNames()
      const backChoice = "Back to Preset Manager"
      const loadOptions = presetNames.slice(0)

      loadOptions.push(backChoice)

      const selectedValue = await _ui.showInputDialog({
        input: "select",
        message: "Load preset\nChoose a preset to load into the temporary Configure session.",
        default: presetNames[0],
        options: loadOptions,
        type: "primary",
        confirmLabel: "Load",
        skipLabel: "Preset Manager"
      })
      const selectedName = normalizeDialogValue(selectedValue)

      if (selectedName !== null && selectedName !== backChoice) {
        const loadedSettings = loadPresetByName(selectedName)

        if (loadedSettings === null) {
          throw new Error("The selected preset could not be loaded")
        }

        copySettingsInto(settings, loadedSettings)
        _helpers.Report("Preset loaded: " + selectedName)
      }
    } else if (String(presetChoice) === "Save current settings") {
      let presetNameDefault = "New preset"
      const storedPresetName = _settings["Preset Name"]

      if (storedPresetName !== null && storedPresetName !== undefined && String(storedPresetName).replace(/^\s+|\s+$/g, "") !== "") {
        presetNameDefault = String(storedPresetName)
      }

      const enteredName = await _ui.showInputDialog({
        input: "text",
        message: "Save current settings as preset\nEnter a name. Saving an existing name creates a newer replacement marker.",
        default: presetNameDefault,
        settingsKey: "Preset Name",
        type: "primary"
      })

      if (enteredName !== null) {
        let presetNameValue = enteredName

        if (presetNameValue === undefined || String(presetNameValue).replace(/^\s+|\s+$/g, "") === "") {
          presetNameValue = _settings["Preset Name"]
        }

        if (presetNameValue === null || presetNameValue === undefined || String(presetNameValue).replace(/^\s+|\s+$/g, "") === "") {
          throw new Error("Lexicon did not return the entered preset name. Please enter a name and try again.")
        }

        const presetName = validatePresetName(presetNameValue)
        const saveConfirmation = await _ui.showInputDialog({
          input: "select",
          message: "Save preset?\n\nName: " + presetName,
          default: "Save preset",
          options: ["Save preset", "Back to Preset Manager"],
          type: "primary",
          confirmLabel: "Confirm",
          skipLabel: "Preset Manager"
        })

        if (saveConfirmation !== null && String(saveConfirmation) === "Save preset") {
          writePresetSave(presetName, settings)
          _helpers.Report("Preset saved: " + presetName)
        }
      }
    } else if (String(presetChoice) === "Delete preset") {
      const presetNames = listPresetNames().slice(1)

      if (presetNames.length === 0) {
        _helpers.Report("No user presets are available.")
      } else {
        const backChoice = "Back to Preset Manager"
        const deleteOptions = presetNames.slice(0)

        deleteOptions.push(backChoice)

        const selectedName = await _ui.showInputDialog({
          input: "select",
          message: "Delete preset\nChoose a user preset to remove.",
          default: presetNames[0],
          options: deleteOptions,
          type: "primary",
          confirmLabel: "Continue",
          skipLabel: "Preset Manager"
        })

        if (selectedName !== null && String(selectedName) !== backChoice) {
          const confirmation = await _ui.showInputDialog({
            input: "select",
            message: "Delete preset?\n\n" + String(selectedName),
            default: "Keep preset",
            options: ["Keep preset", "Delete preset"],
            type: "primary",
            confirmLabel: "Confirm",
            skipLabel: "Preset Manager"
          })

          if (confirmation !== null && String(confirmation) === "Delete preset") {
            writePresetDelete(String(selectedName))
            _helpers.Report("Preset deleted: " + String(selectedName))
          }
        }
      }
    }
  }
}

async function showSetting(settings, definition, confirmLabel) {
  const dialogOptions = {
    input: definition.input,
    message: definition.message,
    default: String(settings[definition.key]),
    type: "primary",
    confirmLabel: confirmLabel,
    skipLabel: "Menu"
  }

  if (definition.options !== null) {
    dialogOptions.options = definition.options
  }

  const choice = await _ui.showInputDialog(dialogOptions)

  if (choice === null) {
    return false
  }

  if (definition.key === "startNumber") {
    const checkedNumber = Number(choice)

    if (isNaN(checkedNumber) || checkedNumber < 0 || Math.floor(checkedNumber) !== checkedNumber) {
      throw new Error("Start number must be a whole number that is zero or greater")
    }

    settings.startNumber = String(checkedNumber)
  } else {
    settings[definition.key] = String(choice)
  }

  return true
}

async function runSection(settings, definitions) {
  for (let index = 0; index < definitions.length; index++) {
    const confirmLabel = index === definitions.length - 1 ? "Done" : "Next"
    const completed = await showSetting(settings, definitions[index], confirmLabel)

    if (!completed) {
      return
    }
  }
}

const dialogSettings = loadSharedSettingsForDialog()
const generalSettings = [
  {
    key: "targetField",
    input: "select",
    message: "General settings - Target field\nChoose where the TrackPrefixer prefix is written. Title is recommended for most DJ libraries and CDJ players.",
    options: ["Title", "Grouping", "Comment"]
  },
  {
    key: "existingPrefixes",
    input: "select",
    message: "General settings - Existing prefixes\nReplace removes the old TrackPrefixer prefix and writes a new one. Skip leaves already prefixed tracks unchanged.",
    options: ["Replace", "Skip"]
  }
]
const sortingSettings = [
  {
    key: "primarySort",
    input: "select",
    message: "Sorting - Primary sort field\nControls the main order before numbering. Date Added compares calendar dates only and ignores the time of day. Current Lexicon order keeps the order currently shown in Lexicon.",
    options: ["Current Lexicon order", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"]
  },
  {
    key: "primaryDirection",
    input: "select",
    message: "Sorting - Primary direction\nAscending sorts A to Z or low to high. Descending sorts Z to A or high to low.",
    options: ["Ascending", "Descending"]
  },
  {
    key: "secondarySort",
    input: "select",
    message: "Sorting - Secondary sort field\nUsed when tracks have the same primary sort value. Choose None when no extra sorting is needed.",
    options: ["None", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"]
  },
  {
    key: "secondaryDirection",
    input: "select",
    message: "Sorting - Secondary direction\nControls the order used by the secondary sort field.",
    options: ["Ascending", "Descending"]
  },
  {
    key: "missingValues",
    input: "select",
    message: "Sorting - Missing values\nChoose whether tracks without a value, such as BPM or Year, are placed last or first.",
    options: ["Last", "First"]
  }
]
const prefixSettings = [
  {
    key: "prefixWidthMode",
    input: "select",
    message: "Prefix and numbering - Prefix width mode\nUsed by Number selected tracks. Auto library size uses the library size, Selected tracks adapts to the selection, and Fixed width uses the chosen digits. Continue preserves the width of the highest existing prefix.",
    options: ["Auto library size", "Selected tracks", "Fixed width"]
  },
  {
    key: "startNumber",
    input: "text",
    message: "Prefix and numbering - Start number\nFirst number used by Number selected tracks. Continue selected numbering ignores this and starts after the highest library prefix.",
    options: null
  }
]

let saveRequested = false
let exitRequested = false

while (!saveRequested && !exitRequested) {
  const menuChoice = await _ui.showInputDialog({
    input: "select",
    message: "Configure TrackPrefixer\nChoose a settings section. Changes are temporary until Review and save is confirmed. Cancel exits without saving.",
    default: "General settings",
    options: ["Preset Manager", "General settings", "Sorting settings", "Prefix and numbering", "Review and save"],
    type: "primary",
    confirmLabel: "Open",
    skipLabel: "Cancel"
  })

  if (menuChoice === null) {
    exitRequested = true
  } else if (String(menuChoice) === "Preset Manager") {
    await runPresetManager(dialogSettings)
  } else if (String(menuChoice) === "General settings") {
    await runSection(dialogSettings, generalSettings)
  } else if (String(menuChoice) === "Sorting settings") {
    await runSection(dialogSettings, sortingSettings)
  } else if (String(menuChoice) === "Prefix and numbering") {
    await runSection(dialogSettings, prefixSettings)

    if (dialogSettings.prefixWidthMode === "Fixed width") {
      await runSection(dialogSettings, [
        {
          key: "fixedPrefixWidth",
          input: "select",
          message: "Prefix and numbering - Fixed prefix width\nChoose the exact number of digits in every prefix. Example: width 4 creates 0001*.",
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
        }
      ])
    }
  } else if (String(menuChoice) === "Review and save") {
    const reviewMessage =
      "Review settings\n\n" +
      "Target field: " + dialogSettings.targetField + "\n" +
      "Existing prefixes: " + dialogSettings.existingPrefixes + "\n\n" +
      "Primary sort: " + dialogSettings.primarySort + "\n" +
      "Primary direction: " + dialogSettings.primaryDirection + "\n" +
      "Secondary sort: " + dialogSettings.secondarySort + "\n" +
      "Secondary direction: " + dialogSettings.secondaryDirection + "\n" +
      "Missing values: " + dialogSettings.missingValues + "\n\n" +
      "Prefix width mode: " + dialogSettings.prefixWidthMode + "\n" +
      "Fixed prefix width: " + dialogSettings.fixedPrefixWidth + "\n" +
      "Start number: " + dialogSettings.startNumber
    const saveChoice = await _ui.showInputDialog({
      input: "select",
      message: reviewMessage,
      default: "Save these settings",
      options: ["Save these settings", "Back to menu"],
      type: "primary",
      confirmLabel: "Save",
      skipLabel: "Menu"
    })

    if (saveChoice !== null && String(saveChoice) === "Save these settings") {
      saveRequested = true
    }
  }
}

if (exitRequested) {
  throw new Error("Action cancelled")
}

const targetFieldChoice = dialogSettings.targetField
const primarySortChoice = dialogSettings.primarySort
const primaryDirectionChoice = dialogSettings.primaryDirection
const secondarySortChoice = dialogSettings.secondarySort
const secondaryDirectionChoice = dialogSettings.secondaryDirection
const missingValuesChoice = dialogSettings.missingValues
const prefixWidthModeChoice = dialogSettings.prefixWidthMode
const fixedPrefixWidthChoice = dialogSettings.fixedPrefixWidth
const startNumber = Number(dialogSettings.startNumber)
const existingPrefixChoice = dialogSettings.existingPrefixes

_storage.save("setting.targetField", String(targetFieldChoice))
_storage.save("setting.primarySort", String(primarySortChoice))
_storage.save("setting.primaryDirection", String(primaryDirectionChoice))
_storage.save("setting.secondarySort", String(secondarySortChoice))
_storage.save("setting.secondaryDirection", String(secondaryDirectionChoice))
_storage.save("setting.missingValues", String(missingValuesChoice))
_storage.save("setting.prefixWidthMode", String(prefixWidthModeChoice))
_storage.save("setting.fixedPrefixWidth", String(fixedPrefixWidthChoice))
_storage.save("setting.startNumber", String(startNumber))
_storage.save("setting.existingPrefixes", String(existingPrefixChoice))

const targetFieldIndex = ["Title", "Grouping", "Comment"].indexOf(String(targetFieldChoice))
const primarySortIndex = ["Current Lexicon order", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"].indexOf(String(primarySortChoice))
const primaryDirectionIndex = ["Ascending", "Descending"].indexOf(String(primaryDirectionChoice))
const secondarySortIndex = ["None", "Date Added", "Year", "Title", "Artist", "BPM", "Rating"].indexOf(String(secondarySortChoice))
const secondaryDirectionIndex = ["Ascending", "Descending"].indexOf(String(secondaryDirectionChoice))
const missingValuesIndex = ["Last", "First"].indexOf(String(missingValuesChoice))
const prefixWidthModeIndex = ["Auto library size", "Selected tracks", "Fixed width"].indexOf(String(prefixWidthModeChoice))
const existingPrefixIndex = ["Replace", "Skip"].indexOf(String(existingPrefixChoice))
const settingsTimestamp = String(Date.now())
const settingsFilename =
  "tp-settings-" + settingsTimestamp +
  "-" + targetFieldIndex +
  "-" + primarySortIndex +
  "-" + primaryDirectionIndex +
  "-" + secondarySortIndex +
  "-" + secondaryDirectionIndex +
  "-" + missingValuesIndex +
  "-" + prefixWidthModeIndex +
  "-" + String(fixedPrefixWidthChoice) +
  "-" + String(startNumber) +
  "-" + existingPrefixIndex +
  ".txt"

_files.write(settingsFilename, "TrackPrefixer shared settings marker")

const timestamp = String(Date.now())
const filename = "configure-trackprefixer-" + timestamp + ".txt"
const log =
  "TrackPrefixer run log\n" +
  "Action: Configure TrackPrefixer\n" +
  "Timestamp: " + new Date().toString() + "\n" +
  "Target field: " + targetFieldChoice + "\n" +
  "Primary sort: " + primarySortChoice + "\n" +
  "Primary direction: " + primaryDirectionChoice + "\n" +
  "Secondary sort: " + secondarySortChoice + "\n" +
  "Secondary direction: " + secondaryDirectionChoice + "\n" +
  "Missing values: " + missingValuesChoice + "\n" +
  "Prefix width mode: " + prefixWidthModeChoice + "\n" +
  "Fixed prefix width: " + fixedPrefixWidthChoice + "\n" +
  "Start number: " + startNumber + "\n" +
  "Existing prefixes: " + existingPrefixChoice + "\n"

_files.write(filename, log)

_helpers.Report("TrackPrefixer settings saved")
_helpers.Report("Target field: " + targetFieldChoice)
_helpers.Report("Primary sort: " + primarySortChoice)
_helpers.Report("Prefix width mode: " + prefixWidthModeChoice)
_helpers.Report("Existing prefixes: " + existingPrefixChoice)
_helpers.Report("Log file: files/" + filename)
