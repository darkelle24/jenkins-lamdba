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
    'default e2e tests': browser => {
        browser
            .init()
            .waitForElementVisible('h1')
            .assert.title("JS-Nightwatch.js")
            .end()
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