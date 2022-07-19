// Collection of utility functions to work with the Google Drive "filesystem"

function findMostRecentlyCreatedSubfolder(parentFolder) {
  var subfolders = parentFolder.getFolders();
  
  var latestFolder = null;
  while (subfolders.hasNext()) {
    var folder = subfolders.next();
    if (!latestFolder || latestFolder.getDateCreated().valueOf > folder.getDateCreated().valueOf()) {
      latestFolder = folder;
    }
  }
  return latestFolder;
}

function findSpreadsheet(title) {
  const files = DriveApp.searchFiles(`title = "${title}" and mimeType = "${MimeType.GOOGLE_SHEETS}"`);
  return (files.hasNext()) ? files.next() : null;
}

function newSheet(name, overwriteExisting=true) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const existingSheet = ss.getSheetByName(name);
  if (existingSheet) {
    if (overwriteExisting) {
      ss.deleteSheet(existingSheet);
    } else {
      SpreadsheetApp.getUi().alert(`Sheet ${name} already exists. Operation aborted.`);
      return;
    }
  }

  ss.insertSheet();
  const sheet = ss.getActiveSheet();
  sheet.setName(name);
  return sheet;
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    SpreadsheetApp.getUi().alert(`Cannot find sheet named: ${sheetName}. Operation aborted.`);
    return;
  }
  return sheet;
}

function readTable(sheet) {
  // Helper to read a single row
  const _readRow = (rowIndex, range) => {
    range = range || sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn());
    let col = 1;
    const result = [];
    while(range.getCell(1, col).getValue() !== "") {
      result.push(range.getCell(1, col).getValue());
      col++;
    } 
    return result;
  }

  const _createObject = (keys, values) => {
    const object = {};
    if (values.length < keys.length) return;
    for (let i = 0; i < keys.length; i++) {
      object[keys[i]] = values[i];
    }
    return object;
  };

  const keys = _readRow(1);
  const lastRow = sheet.getLastRow();
  const dataRows = sheet.getRange(2, 1, lastRow-1, keys.length).getValues();
  return dataRows.map(row => _createObject(keys, row));
}