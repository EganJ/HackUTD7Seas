const nessie = require("./nessie");

// Refresh information from nessie
nessie.getCustomerList().then((customerList)=>{
    let customer = customerList[0];
    console.log(customer);
    let id= customer._id;
    nessie.getCustomerData(id).then(console.log);
});
nessie.getMerchantList().then((merchantList)=>{
    let merchant = merchantList[0];
    console.log(merchant);
    let id= merchant._id;
    nessie.getMerchantData(id).then(console.log);
});

nessie.getAccountList().then((AccountList)=>{
    let Account = AccountList[0];
    console.log(Account);
    let id= Account._id;
    nessie.getAccountData(id).then(console.log);
})

nessie.getBillList().then((BillList)=>{
    let Bill = BillList[0];
    console.log(Bill);
    let id= Bill._id;
    nessie.getBillData(id).then(console.log);
})

