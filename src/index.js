const DATA_FOLDER_NAME = "PBv1-InvestmentData";

function getStockList(dataFolderName) {
  // Lookup folder by DATA_FOLDER_NAME
  const folders = DriveApp.getFoldersByName(dataFolderName || DATA_FOLDER_NAME);
  if (!folders.hasNext()) {
    return;
  }

  // Find the most recently created subfolder
  const investmentDataFolder = folders.next();
  const latestFolder = findMostRecentlyCreatedSubfolder(investmentDataFolder);
  if (!latestFolder)
    return;
  const newSheetName = latestFolder.getName();

  const accountDataFiles = latestFolder.getFiles();
  const masterStockList = new StockList();
  while(accountDataFiles.hasNext()) {
    masterStockList.append(readCsvFile(accountDataFiles.next()));
  }
  return {newSheetName, masterStockList};
}

function newPortfolioSnapshotSheet() {
  const {newSheetName, masterStockList} = getStockList(DATA_FOLDER_NAME);
  presentToSheet(masterStockList, newSheet(newSheetName));
}