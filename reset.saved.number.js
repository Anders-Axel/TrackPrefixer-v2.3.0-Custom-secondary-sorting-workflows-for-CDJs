/*
TrackPrefixer v2.3.0

Created by AndersAxel.
Designed and developed by AndersAxel with AI-assisted development.
License: MIT
*/

const previousNumber = _storage.load("lastNumber")

_storage.save("lastNumber", 0)

const timestamp = String(Date.now())
const filename = "reset-saved-number-" + timestamp + ".txt"

const log =
  "TrackPrefixer run log\n" +
  "Action: Reset saved number\n" +
  "Timestamp: " + new Date().toString() + "\n" +
  "Previous saved value: " + String(previousNumber) + "\n" +
  "New saved value: 0\n"

_files.write(filename, log)

_helpers.Report("Previous saved number: " + String(previousNumber))
_helpers.Report("Saved number reset to 0")
_helpers.Report("Log file: files/" + filename)