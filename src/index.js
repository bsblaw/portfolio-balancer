function createNewSheet(dataFolderName) {
  const {newSheetName, masterStockList} = getStockListFromDrive(dataFolderName);
  presentToSheet(masterStockList, newSheet(newSheetName));
}

function hello() { Logger.log("hello"); }
