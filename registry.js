/** Since I have no idea how to use a database, this module is for dictionaries of bills, accounts, and customers
 * with the ultimate purpose of reconstructing the missing links in the nessie database (i.e. you're supposed to be
 * able to go from customer to that customer's accounts, but the response is missing that section)
 * 
 * Stores only the relation between customers, accounts, and bills; for bill specifics check nessie
 */

module.exports = {
    addBill,
    addAccount,
    addCustomer,

    "printall": () => { console.log(customers); console.log(accounts); console.log(bills); }
};

const customers = {};
const accounts = {};
const bills = {};


function _touchCustomerEntry(customerID) {
    if (!customers[customerID]) {
        customers[customerID] = {
            "accountIDs": new Set(),
            "billIDs": new Set(),
        };
    }
}

function _touchAccountEntry(accountID) {
    if (!accounts[accountID]) {
        accounts[accountID] = {
            "customerID": "",
            "billIDs": new Set(),
        };
    }
}

function _touchBillEntry(billID) {
    if (!bills[billID]) {
        bills[billID] = {
            "accountID": "",
            // customer ID can be found through account
        };
    }
}

function _addBillToAccount(accountID, billID) {
    _touchAccountEntry(accountID);
    accounts[accountID].billIDs.add(billID);
    if (accounts[accountID].customerID) {
        _addBillToCustomer(customerID, billID);
    }

}

function _addBillToCustomer(customerID, billID) {
    _touchCustomerEntry(customerID);
    customers[customerID].billIDs.add(billID);

}

function _addAccountToCustomer(customerID, accountID) {
    _touchCustomerEntry(customerID);
    customers[customerID].accountIDs.add(accountID);
    accounts[accountID].billIDs.forEach(bill => {
        customers[customerID].billIDs.add(bill);
    });
}

/**
 * Adds a new bill to the registry from its nessie response
 * @param {Object} bill 
 */
function addBill(bill) {

    _touchBillEntry(bill._id);
    bills[bill._id].accountID = bill.account_id;

    _addBillToAccount(bill.account_id, bill._id);
}

/**
 * Adds a new account to the registry from its nessie response
 * @param {Object} account 
 */
function addAccount(account) {
    _touchAccountEntry(account._id);
    accounts[account._id].customerID = account.customer_id;
    _addAccountToCustomer(account.customer_id, account._id);
}

/**
 * adds a new customer to the registry from its nessie response
 * @param {Object} customer 
 */
function addCustomer(customer) {
    _touchCustomerEntry(customer._id);
}