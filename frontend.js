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
        try {
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
        } catch (e) {
            reject(e);
        }
    }).then((processedInfo) => {
        res.render("analysis", processedInfo);
        res.end();
        next();
    }).catch((e) => {
        console.error(e);
        res.sendStatus(500);
    });
});


app.get("/conclusion/", (req, res) => {
    let formdata = req.query;

    const categoryNames = [
        "--",
        "Housing and Transportation",
        "Education or Professional",
        "Food",
        "Medical and Insurance",
        "Entertainment",
        "Investment and Debt Repayment",
        "Household and Necessities"
    ];

    let n = parseInt(formdata.numberOfBills);

    let totalSavings = parseFloat(formdata.totalSaved);

    let sumTotal = {
        "true": 0, // necessary
        "false": 0,// unecessary
        "unknown": 0,
    };
    let sumCategory = {
        "true": {}, // necessary
        "false": {},// unecessary
        "unknown": {},
        "all": {}
    };

    for (category of categoryNames) {
        sumCategory["true"][category] = 0;
        sumCategory["false"][category] = 0;
        sumCategory["unknown"][category] = 0;
        sumCategory["all"][category] = 0;

    }


    for (let i = 1; i < n + 1; i++) {
        // form is not indexed zero
        let necessity = formdata["isNecessary" + i];
        let category = formdata["category" + i];
        let amount = parseFloat(formdata["amount" + i]) || 0;

        sumTotal[necessity] += amount;
        sumCategory[necessity][category] += amount;
        sumCategory["all"][category] += amount;

    }

    let totalExpenses = sumTotal["true"] + sumTotal["false"] + sumTotal["unknown"];

    let advice = []

    // go through common pieces of financial advice and check if they apply
    // I am a college kid not a financial expert: really, look elsewhere for real advice.

    if (totalSavings < (3 * totalExpenses)) {
        advice.push("If these expenses represent a typical month, you might want to add to your emergency savings: most experts recommend having at least 3 months living expenses. If you can, try to save up for six!");
    }

    if (sumCategory["all"]["Investment and Debt Repayment"] < 0.2 * totalExpenses) {
        advice.push("You might want to put more of your income to repaying debts and building long-term saving! One rule of thumb is to save or invest at least 20% of your income.");
    }

    if (sumTotal["false"] > (0.3 * totalExpenses)) {

        excessCats = [];
        for (cat of categoryNames) {
            if (sumCategory["false"][cat] > 0.05 * totalExpenses) {
                excessCats.push(cat);
            }
        }

        catString = ""

        if (excessCats.length > 0) {
            catString = " It looks like you are spending more than you need to on " + excessCats[0];
            if (excessCats.length > 1) {
                for (let i = 1; i < excessCats.length - 1; i++) {
                    catString += ", " + excessCats[i];
                }
                catString += " and " + excessCats[excessCats.length - 1];
            }
        }
        catString = catString.replace("--", "Uncategorized");

        advice.push("It looks like you are spending a lot of your income on unnecessary expenses! Try to keep these below 30% of your income at most." + catString);
    }


    let sumNecessities =
        sumCategory["true"]["Housing and Transportation"] +
        sumCategory["true"]["Food"] +
        sumCategory["true"]["Medical and Insurance"] +
        sumCategory["true"]["Household and Necessities"];

    if (sumNecessities > (0.5 * totalExpenses)) {
        advice.push("It looks like a lot of your income is going to necessities! If this is because you're spending very little on other things, good job; if not, you may need to reconsider what is truly necessary. Ideally, no more than 50% of your income goes to necessities: try to put some in savings.");
    }

    if (sumTotal["unknown"] > (0.2 * totalExpenses)) {
        advice.push("It looks like you're unsure about the necessity of a lot of your expenses! Try to reflect on what you truly need when you make a purchase.");
    }

    if (sumCategory["all"]["--"] > (0.2 * totalExpenses)) {
        advice.push("It looks like you're unsure about the categorization of a lot of your expenses! When making a purchase, try to keep track of where it fits in on your budget. It helps to keep notes.");
    }

    res.render("conclusion", {
        "advice": advice,
        "categorySpending":sumCategory, 
    });

});

module.exports.start = function () {
    app.listen(config.EXPRESS_PORT, () => {
        console.log(`Example launched on http://localhost:${config.EXPRESS_PORT}`);
    });
}
