const nessie = require("./nessie");
const registry = require("./registry");
const frontend = require("./frontend");

// fetch and prepare information

let billDownload = nessie.downloadBillData().then(() => {
    nessie.getBillList().then((billList) => {
        billList.forEach(bill => {
            registry.addBill(bill);
        });
    });
});

let accountDownload = nessie.downloadAccountData().then(() => {
    nessie.getAccountList().then((accountList) => {
        accountList.forEach(account => {
            registry.addAccount(account);
        });
    });
});

let customerDownload = nessie.downloadCustomerData().then(() => {
    nessie.getCustomerList().then((customerList) => {
        customerList.forEach(customer => {
            registry.addCustomer(customer);
        });
    });
});

new Promise(async function (resolve, reject) {
    await billDownload;
    await accountDownload;
    await customerDownload;

    resolve();
}).then(frontend.start);