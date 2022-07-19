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
