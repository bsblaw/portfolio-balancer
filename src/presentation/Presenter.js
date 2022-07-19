/**
 * Present a list of stocks to a sheet. It creates a table with 3 parts:
 * - Header 
 * - Body with 1 secton per stock category such as "Canadian" or "US"
 * - Foot where sum totals are calculated for each column
 * 
 * Finally it creates a pie chart that shows the allocation of funds
 * between the stock categories.
 */
function presentToSheet(stocks, sheet) {
  // Helper
  const _appendHeaderRow = () => {
    let headerRow = [''];
    stocks.getAccountList().forEach(a => headerRow.push(a));
    headerRow.push("Total");
    headerRow.push("% by Category");
    headerRow.push("% by Symbol");
    
    sheet.appendRow(headerRow);
  }

  // Helper
  const _appendFooterRow = () => {
    let row = ['Total'];
    
    stocks.getAccountList().forEach((accountName) => {
      row.push(stocks.calculateAccountTotal(accountName));
    });

    row.push(stocks.calculateTotal());
    sheet.appendRow(row);

    const rowIndex = sheet.getLastRow();
    const numAccounts = stocks.getAccountList().length; 
    const currencyRange = sheet.getRange(rowIndex, 2, 1, numAccounts + 1);
    currencyRange.setNumberFormat("$#,##0.00;$(#,##0.00)");
  }

  // Helper
  const _createCharts = (numBodyRows) => {
    // Create charts
    const N = stocks.getAccountList().length;
    let labelRange = sheet.getRange(2, 1, numBodyRows, 1);
    let categoryPercentageRange = sheet.getRange(2, N + 3, numBodyRows, 1);
    let symbolPercentageRange = sheet.getRange(2, N + 4, numBodyRows, 1);
    let chartBuilder = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(labelRange)
      .addRange(categoryPercentageRange)
      .setOption('title', 'Overall investment distribution')
      .setPosition(sheet.getLastRow() + 1, 1, 0, 0);
    
    const chart = chartBuilder.build();
    sheet.insertChart(chart);
  }

  // Main control flow
  _appendHeaderRow(stocks, sheet);
  let numBodyRows = 0;
  stocks.getCategories().forEach(category => {
    const p = new StockCategoryPresenter(stocks, category);
    numBodyRows += p.appendToSheet(sheet);
  });
  _appendFooterRow();
  _createCharts(numBodyRows);
}




