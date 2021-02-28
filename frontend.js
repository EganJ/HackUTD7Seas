/**
 * Module for serving frontend files using express
 */
const express = require("express");

const config = require("./config");
const registry = require("./registry");
const nessie = require("./nessie");

var app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use("/analysis/", function (req, res, next) {
    // we want at least 10 bills, every bill's account, and every bill in those accounts
    let billIDs = new Set();
    let accountIDS = new Set();

    let billGenerator = registry.billIDGenerator();
    while (billIDs.size < 10) {
        let bill = billGenerator.next().value;
        billIDs.add(bill);
        let account = registry.getBill(bill).accountID;
        accountIDS.add(account);
        let otherbillIDs = Array.from(registry.getAccount(account).billIDs);
        for (let i = 0; i < otherbillIDs.length; i++) {
            billIDs.add(otherbillIDs[i]);
            if (billIDs.size > 15) {
                break
            }
        }
    }
    // condense bill and account information into usable values:
    // account information: total savings
    // bill info: amount, payee, and date


    new Promise(async function (resolve, reject) {
        let processedInfo = {
            "totalSavings": 0,
            "billList": []
        }

        awaitlist = [];

        // start all async requests

        for (id of accountIDS) {
            awaitlist.push(nessie.getAccountData(id).then(accountInfo => {
                processedInfo.totalSavings += accountInfo.balance || 0;
            }));
        }

        for (id of billIDs) {
            awaitlist.push(nessie.getBillData(id).then(billInfo => {
                processedBillInfo = {
                    "id": billInfo._id,
                    "amount": billInfo.payment_amount,
                    "payee": billInfo.payee,
                    "date": billInfo.payment_date || billInfo.creation_date || "Unknown"
                };
                if (billInfo.payee == "string" || !billInfo.payee) {
                    if (billInfo.nickname && (billInfo.nickname != "string")) {
                        console.log(billInfo.nickname);
                        processedBillInfo.payee = billInfo.nickname;
                    } else {
                        processedBillInfo.payee = "Unlabeled";
                    }
                }
                processedInfo.billList.push(processedBillInfo);
            }));
        };

        // wait for all processes to finish

        for (process of awaitlist) {
            await process;
        }

        resolve(processedInfo);
    }).then((processedInfo) => {
        res.render("analysis", processedInfo);
        next();
    });
});


module.exports.start = function () {
    app.listen(config.EXPRESS_PORT, () => {
        console.log(`Example launched on http://localhost:${config.EXPRESS_PORT}`);
    });
}
