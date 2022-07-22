# portfolio-balancer

## Project Description

Google Apps Script project that takes bank statements (in CSV format) and generate a Google Sheet showing a consolidated view of the entire portfolio. The consolidated view contains information on how investments are distributed between configurable investment categories. 

### Why?

For investors with funds scattered across multiple financial institutions and/or accounts, a consolidated view of one's portfolio is often difficult to obtain. Knowing how the entire pool of money is distributed between investment categories is of special interest for passive investors, whose investment strategy involves continually monitoring and rebalancing the portfolio in order to maintain proper diversitification. This tool aimed at making this information readily available, which in turn informs buy/sell decisions, especially for passive investors primarily concerned with maintaining a balanced portfolio.

## How to use it

1. Download bank statements in CSV format to a Google Drive folder of your choice. You must group CSV files with the same timestamp into a subfolder. Each subfolder essentially represents a snapshot of your porfolio in time. For example, you may designated "/PorfolioBalanceData" as the main folder, then download CSV files for "Jan 1, 2023" into a subfolder named "/PorfolioBalanceData/2023-01-01/".

2. Open the Google Spreadsheet where you would like portfolio information to be displayed. Install the Apps Script by clicking on "Extensions -> Apps Script", then click on the "+" button next to "Library". Install the PortfolioBalance library by searching the script ID: `13qknmTXWz8jjsjW-eaGxdLmusTN0NBHxtsy4umHLleQocUknR6wBO7_s`. Replace auto-generated content of "Code.gs" with the following:

```
function onOpen() {
  const ui = SpreadsheetApp.getUi()
    .createMenu('Automations')
    .addItem('Get portfolio snapshot', 'getSnapshot')
    .addToUi();
}

function getSnapshot() {
  PortfolioBalancer.createNewSheet("PorfolioBalancerData"); // Change argument to match your folder name
}
```

3. Reload the spread sheet. After a few seconds, you should see a new "Automation" menu.

4. Click on "Automation -> Get portfolio snapshot" to create a portfolio snapshot. When you want to create more snapshots later, simply collect CSV files into a new subfolder in your data folder, then select the same menu option again to create a new snapshot.