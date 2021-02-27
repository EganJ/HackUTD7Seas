/** Module for interfacing with Capitol One's Nessie API
 *  API Documentation: api.nessieisreal.com
 * 
 *  Module exports:
 * 
 */
const http = require("http");
const fs = require("fs");

const KEY = require("./config").NESSIE_KEY;

module.exports = {
    "downloadCustomerData": downloadCustomerData,
    "getCustomerList": getCustomerList,
    "getCustomerData": getCustomerData,

    "downloadMerchantData": downloadMerchantData,
    "getMerchantList": getMerchantList,
    "getMerchantData": getMerchantData,

    "downloadAccountData": downloadAccountData,
    "getAccountList": getAccountList,
    "getAccountData": getAccountData,

    "downloadBillData": downloadBillData,
    "getBillList": getBillList,
    "getBillData": getBillData,
}

/** 
 * Internal helper function: makes a http request to given url and pipes to given file
 * @param urlpath {String} path to make request to
 * @param filepath path to pipe to
 */
function _pipeToFile(urlpath, filepath) {
    return new Promise((resolve, reject) => {
        var savefile = fs.createWriteStream(filepath);
        savefile.on("error", () => { savefile.close() })

        http.get(urlpath, function (response) {
            response.pipe(savefile).on("finish", resolve).on("error", reject);
        });
    });
}

/** Returns a promise containing request body
 * @param {String} urlpath 
 */
function _fetchToObject(urlpath) {
    return new Promise((resolve, reject) => {
        let responseData = "";
        http.get(urlpath, (response) => {
            response.on("data", (chunk) => {
                responseData += chunk;
            }).on("end", () => {
                resolve(JSON.parse(responseData));
            }).on("error", reject);
        });
    });
}

/** Requests all customer data from the Nessie API and pipes it to a file
 */
function downloadCustomerData() {
    return _pipeToFile(`http://api.nessieisreal.com/enterprise/customers?key=${KEY}`, "./save/customerData.json");
}

/** Returns a list of customer data objects
 * 
 * Since the number of customers is potentially to large to reasonably fetch every time, this
 * will, if possible, fetch from a saved request on disk; to update the request on disk, call
 * downloadCustomerData();
 * 
 * @returns an array of customer data objects
 * 
 */
async function getCustomerList() {
    if (!fs.existsSync("./save/customerData.json")) {
        await downloadCustomerData();
    }
    return JSON.parse(fs.readFileSync("./save/customerData.json")).results;
}


/** Returns a list of customer data objects
 * 
 * Since the number of customers is potentially to large to reasonably fetch every time, this
 * will, if possible, fetch from a saved request on disk; to update the request on disk, call
 * downloadCustomerData();
 * 
 * @returns an array of customer data objects
 * 
 */
async function getCustomerList() {
    if (!fs.existsSync("./save/customerData.json")) {
        await downloadCustomerData();
    }
    return JSON.parse(fs.readFileSync("./save/customerData.json")).results;
}

/** Returns the data for a single customer, fetched by ID
 * 
 * @param {String} customerID 
 */
function getCustomerData(customerID) {
    return _fetchToObject(`http://api.nessieisreal.com/enterprise/customers/${customerID}?key=${KEY}`);
}

/** Requests all merchant data from the Nessie API and pipes it to a file
 */
function downloadMerchantData() {
    return _pipeToFile(`http://api.nessieisreal.com/enterprise/merchants?key=${KEY}`, "./save/merchantData.json");
}

/** Returns a list of merchant data objects
 * 
 * Since the number of merchants is potentially to large to reasonably fetch every time, this
 * will, if possible, fetch from a saved request on disk; to update the request on disk, call
 * downloadMerchantData();
 * 
 * @returns an array of  merchant data objects
 * 
 */
async function getMerchantList() {
    if (!fs.existsSync("./save/merchantData.json")) {
        await downloadMerchantData();
    }
    return JSON.parse(fs.readFileSync("./save/merchantData.json")).results;
}

/** Returns the data for a single customer, fetched by ID
 * 
 * @param {String} customerID 
 */
function getMerchantData(merchantID) {
    return _fetchToObject(`http://api.nessieisreal.com/enterprise/merchants/${merchantID}?key=${KEY}`);
}

/** Requests all customer data from the Nessie API and pipes it to a file
 */
function downloadAccountData() {
    return _pipeToFile(`http://api.nessieisreal.com/enterprise/accounts?key=${KEY}`, "./save/accountData.json");
}

/** Returns a list of account data objects
 * 
 * Since the number of accounts is potentially to large to reasonably fetch every time, this
 * will, if possible, fetch from a saved request on disk; to update the request on disk, call
 * downloadAccountData();
 * 
 * @returns an array of account data objects
 * 
 */
async function getAccountList() {
    if (!fs.existsSync("./save/accountData.json")) {
        await downloadAccountData();
    }
    return JSON.parse(fs.readFileSync("./save/accountData.json")).results;
}


/** Returns a list of account data objects
 * 
 * Since the number of accounts is potentially to large to reasonably fetch every time, this
 * will, if possible, fetch from a saved request on disk; to update the request on disk, call
 * downloadAccountData();
 * 
 * @returns an array of account data objects
 * 
 */
async function getAccountList() {
    if (!fs.existsSync("./save/accountData.json")) {
        await downloadAccountData();
    }
    return JSON.parse(fs.readFileSync("./save/accountData.json")).results;
}

/** Returns the data for a single account, fetched by ID
 * 
 * @param {String} accountID 
 */
function getAccountData(accountID) {
    return _fetchToObject(`http://api.nessieisreal.com/enterprise/accounts/${accountID}?key=${KEY}`);
}


/** Requests all customer data from the Nessie API and pipes it to a file
 */
function downloadBillData() {
    return _pipeToFile(`http://api.nessieisreal.com/enterprise/bills?key=${KEY}`, "./save/billData.json");
}

/** Returns a list of bill data objects
 * 
 * Since the number of bills is potentially to large to reasonably fetch every time, this
 * will, if possible, fetch from a saved request on disk; to update the request on disk, call
 * downloadBillData();
 * 
 * @returns an array of bill data objects
 * 
 */
async function getBillList() {
    if (!fs.existsSync("./save/billData.json")) {
        await downloadBillData();
    }
    return JSON.parse(fs.readFileSync("./save/billData.json")).results;
}


/** Returns a list of bill data objects
 * 
 * Since the number of bills is potentially to large to reasonably fetch every time, this
 * will, if possible, fetch from a saved request on disk; to update the request on disk, call
 * downloadBillData();
 * 
 * @returns an array of bill data objects
 * 
 */
async function getBillList() {
    if (!fs.existsSync("./save/billData.json")) {
        await downloadBillData();
    }
    return JSON.parse(fs.readFileSync("./save/billData.json")).results;
}

/** Returns the data for a single bill, fetched by ID
 * 
 * @param {String} billID 
 */
function getBillData(billID) {
    return _fetchToObject(`http://api.nessieisreal.com/enterprise/bills/${billID}?key=${KEY}`);
}
