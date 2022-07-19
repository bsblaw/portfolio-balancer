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