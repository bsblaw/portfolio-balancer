/**
 * Stock list presentation consists of a table with 3 parts:
 * - Header 
 * - Body with 1 secton per stock category such as "Canadian" or "US"
 * - Foot where sum totals are calculated for each column
 * 
 * This presenter is in carge of presenting the "Body" part of the table 
 * described above.
 */
class StockCategoryPresenter {
  constructor(stocks, category) {
    this._stocks = stocks;
    this._category = category;
  }

  appendToSheet(sheet) {
    let numRowsAdded = 0;
    numRowsAdded += this._appendCategoryHeaderRow(sheet);
    this._stockSymbolsInCategory().forEach(stockSymbol => {
      numRowsAdded += this._appendCategoryConstituentRow(sheet, stockSymbol);
    });
    return numRowsAdded;
  }

  // Apply numeric formatting to the specified row in the specified sheet
  _formatNumbersInRow(sheet, rowIndex) {
    const numAccounts = this._stocks.getAccountList().length; 

    const currencyRange = sheet.getRange(rowIndex, 2, 1, numAccounts + 1);
    currencyRange.setNumberFormat("$#,##0.00;$(#,##0.00)");

    const percentageRange = sheet.getRange(rowIndex, numAccounts + 3, 1, 2);
    percentageRange.setNumberFormat("##.#%");
  }

  _stockSymbolsInCategory() {
    return this._stocks.getUniqueSymbolsForCategory(this._category);
  }

  _appendCategoryHeaderRow(sheet) {
    const numStocksInCategory = this._stockSymbolsInCategory().length;
    if (numStocksInCategory < 2) 
      return 0; // If there's no stock, leave out the header. If there's 1 stock leave out header as well, but there will be a single constituent row.

    let row = [];

    // Col 1
    row.push(this._category);

    // Col 2.. N+1 are empty cells for each of the N accounts
    this._stocks.getAccountList().forEach(() => {
      row.push('');
    });

    // Col N+2 is the category total
    row.push(this._stocks.calculateCategoryTotal(this._category));

    // Col N+3 is the category percentage
    row.push(this._stocks.calculateCategoryPercentage(this._category));

    sheet.appendRow(row);
    this._formatNumbersInRow(sheet, sheet.getLastRow());
    return 1;
  }

  _appendCategoryConstituentRow(sheet, stockSymbol) {
    let row = [];  

    // Col 1 - Symbol
    row.push(stockSymbol);

    // Col 2.. N+1 Market value of each symbol in each account
    let total = 0;
    this._stocks.getAccountList().forEach((accountName) => {
      const mv = this._stocks.getMarketValue(accountName, stockSymbol);
      row.push(mv);
      total += mv;
    });

    // Col N+2: Add symbol total
    row.push(total);

    // Col N+3: For single stock category, add category percentage, otherwise, leave blank
    const percentage = total/this._stocks.calculateTotal();
    row.push((this._stockSymbolsInCategory().length === 1) ? percentage : '');

    // Col N+4: Add symbol %
    row.push(percentage);

    sheet.appendRow(row);
    this._formatNumbersInRow(sheet, sheet.getLastRow());
    return 1;
  }
}