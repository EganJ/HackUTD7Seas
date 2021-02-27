const nessie = require("./nessie");

// Refresh information from nessie
nessie.getCustomerList().then((customerList)=>{
    let customer = customerList[0];
    console.log(customer);
    let id= customer._id;
    nessie.getCustomerData(id).then(console.log);
})
nessie.getMerchantList().then((merchantList)=>{
    let merchant = merchantList[0];
    console.log(merchant);
    let id= merchant._id;
    nessie.getMerchantData(id).then(console.log);
})

