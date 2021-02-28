const nessie = require("./nessie");
const registry = require("./registry");

// fetch and prepare information

nessie.downloadBillData().then(() => {

    nessie.getBillList().then((billList) => {
        billList.forEach(bill => {
            registry.addBill(bill);
        });
    });
});

nessie.downloadAccountData().then(() => {
    nessie.getAccountList().then((accountList) => {
        accountList.forEach(account => {
            registry.addAccount(account);
        });
    });
});

nessie.downloadCustomerData().then(() => {
    nessie.getCustomerList().then((customerList) => {
        customerList.forEach(customer => {
            registry.addCustomer(customer);
        });
    });
});