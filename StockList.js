/*
 * Encapsulation of a list of stocks, with methods that returns helpful information
 * about the investment portfolio. 
 */
class StockList {
  constructor() {
    this._data = [];
  }
  
  append(list) {
    this._data = this._data.concat(list);
  }

  print() {
    Logger.log(JSON.stringify(this._data, null, 2));
  }

  _getUniquePropertyValues(list, propertyName) {
    let uniqueValues = [];
    list.forEach((item) => {
      const value = item[propertyName];
      if (!uniqueValues.includes(value))
        uniqueValues.push(value);
    });
    return uniqueValues;
  }

  getAccountList() {
    return this._getUniquePropertyValues(this._data, "Account")
  }

  getCategories() {
    return this._getUniquePropertyValues(this._data, "Category");
  }

  getUniqueSymbolsForCategory(category) {
    const stocks = this._data.filter(stock => stock["Category"] === category);
    return this._getUniquePropertyValues(stocks, "Symbol");
  }

  getMarketValue(account, stockSymbol) {
    let sum = 0;
    this._data.filter((stock) => stock["Account"] === account && stock["Symbol"] === stockSymbol).forEach(stock => sum += stock["Market Value"]);
    return sum;
  }

  calculateAccountTotal(account) {
    let sum = 0;
    this._data.filter(stock => stock["Account"] === account).forEach((stock) => {
      sum += stock["Market Value"];
    });
    return sum;
  }

  calculateTotal() {
    let sum = 0;
    this._data.forEach((stock) => {
      sum += stock["Market Value"];
    });
    return sum;
  }

  calculateCategoryTotal(category) {
    let sum = 0;
    this._data.filter(stock => stock["Category"] === category).forEach((stock) => {
      sum += stock["Market Value"];
    });
    return sum;
  }

  calculateCategoryPercentage(category) {
    return this.calculateCategoryTotal(category)/this.calculateTotal();
  }
}
