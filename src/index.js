const DATA_FOLDER_NAME = "PBv1-InvestmentData";
function newPortfolioSnapshotSheet() {
  const {newSheetName, masterStockList} = getStockListFromDrive(DATA_FOLDER_NAME);
  presentToSheet(masterStockList, newSheet(newSheetName));
}