const stockCategories = {
    'US': ['XSP', 'ZSP'],
    'CAN': ['XIU', 'XIC', 'XDIV', 'ZEB'],
    'INTL': ['ZEA', 'EWH', 'XEC'],
    'BOND': ['CBO', 'CLF'],
    'CASH': ['CASH'],
    'GOLD': ['XGD']
};

function findCategory(stock) {
    for( let category in stockCategories ) {
        if (stockCategories[category].includes(stock.Symbol)) return category;
    }
    return 'Unknown';
}

function readCsvFile(accountDataFile) {
    const lines = accountDataFile.getBlob().getDataAsString().split('\n');
    let isHeader = false;
    let stockProperties = null;
    let stocks = [];
    let accountName = ';'
    lines.forEach((line) => {
        const cells = line.split(',').filter((s) => !!s);

        if (cells[0] === 'Account') {
            accountName = cells[1];
            return;
        }

        if (cells[0] === 'Cash') {
            stocks.push({
                'Symbol': "CASH",
                'Market Value': parseFloat(cells[1]),
                'Category': 'CASH',
                'Account': accountName.split('-')[1].trim()
            });
            return;
        }

        if (cells.length === 0) {
            isHeader = true;
            return;
        }

        if (isHeader) {
            stockProperties = cells;
            isHeader = false;
            return;
        }

        if (stockProperties) {
            let stock = {};
            for( let i = 0; i < cells.length; i++) {
                if(stockProperties[i] === "Market Value" || stockProperties[i] === "Symbol") {
                  stock[stockProperties[i]] =  !isNaN(cells[i]) ? parseFloat(cells[i]) : cells[i];
                }
            }
            const category = findCategory(stock);
            stock['Category'] = category;
            stock['Account'] = accountName.split('-')[1].trim();
            stocks.push(stock);
            return;
        }
    });
    return stocks;
}

function getStockList(dataFolderName) {
  const folders = DriveApp.getFoldersByName(dataFolderName);
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