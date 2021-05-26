var https = require("https");
var lambdaRestClient = require("@lambdatest/node-rest-client");
var lambdaCredentials = {
    username: "djilani@deepbloo.com",
    accessKey: "ALJIpRO9gXgEgnpwP2iKomHotn5sHG9Yu9WK33Xz0YWxvsZWnJ"
};
var lambdaAutomationClient = lambdaRestClient.AutomationClient(
    lambdaCredentials
);
module.exports = {
    "@tags": ["test"],
    Wikipedia: function(client) {
        client
            .url("https://fr.wikipedia.org/wiki/Dab#:~:text=Le%20dab%20est%20un%20mouvement,avec%20les%20deux%20bras%20parall%C3%A8les.")
            .waitForElementPresent("body", 10000)
            .assert.title("Dab --- Wikipédia")
            .end();
    },
    after: function(browser) {
        console.log("Closing down...");
    },
    afterEach: function(client, done) {
        if (
            process.env.LT_USERNAME &&
            process.env.LT_ACCESS_KEY &&
            client.capabilities &&
            client.capabilities["webdriver.remote.sessionid"]
        ) {

            lambdaAutomationClient.updateSessionById(
                client.capabilities["webdriver.remote.sessionid"], { status_ind: client.currentTest.results.failed ? "failed" : "passed" },
                function(error, session) {
                    console.log(error)
                    if (!error) {
                        client.pause(10000)
                        done();
                    }
                }
            );
        } else {
            client.pause(10000)
            done();
        }
    }
};