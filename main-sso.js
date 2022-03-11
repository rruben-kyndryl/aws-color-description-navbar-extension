/*
window.addEventListener("load", function() {
    const { hostname, pathname } = window.location;
    if (hostname.endsWith(".awsapps.com") && pathname.startsWith("/start")) {
        // AWS SSO portal
        saveDataOnSSOAppExpansion();
    }
});*/

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



const xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://portal.sso.eu-west-1.amazonaws.com/instance/appinstances");
xhttp.responseType = 'json';
xhttp.setRequestHeader("x-amz-sso-bearer-token", getCookie("x-amz-sso_authn"));
xhttp.setRequestHeader("x-amz-sso_bearer_token", getCookie("x-amz-sso_authn"));
xhttp.send();

xhttp.onload = function() {
    console.log(this.response);

    len = this.response.result.length

    newData = [];

    for (i = 0; i < len; i += 1) {

        if (this.response.result[i].applicationName == "AWS Account") {
            var obj = new Object();
            obj.AccountId = this.response.result[i].searchMetadata.AccountId
            obj.AccountName = this.response.result[i].searchMetadata.AccountName
            newData.push(obj);
        }
    }

    chrome.runtime.sendMessage({ type: "SetSSOAccounts", data: JSON.parse(JSON.stringify(newData)) },
        function(response) {
            console.log("Saved SSO data to LocalStorage for Console augmentation.");
        }
    );
}

/*
function onElementReady(selectorFn, fn) {
    let timedOut = false;
    setTimeout(function() {
        timedOut = true;
    }, 30000);
    const waitForElement = function() {
        if (timedOut) {
            fn(new Error("Element selection timed out."));
        }
        const selection = selectorFn();
        const firstEl = Array.isArray(selection) ? selection[0] : selection;
        firstEl
            ?
            fn(undefined, selection) :
            window.requestAnimationFrame(waitForElement);
    };
    waitForElement();
}

function saveDataOnSSOAppExpansion() {
    // Finds the SSO portal app for AWS account selection and adds a click
    // handler that will save the account names and profiles to local storage.
    const awsAccountsAppSelector = () =>
        Array.from(document.querySelectorAll("portal-application")).find((el) => {
            return el.textContent.trim().startsWith("AWS Account");
        });
    onElementReady(awsAccountsAppSelector, function(err, awsAccountsApp) {
        if (err) {
            console.error(err);
            return;
        }

        function onClickHandler() {
            saveAccountNames();
            awsAccountsApp.removeEventListener("click", onClickHandler);
        }
        awsAccountsApp.addEventListener("click", onClickHandler);
    });
}

function saveAccountNames() {
    const accountsSelector = () =>
        Array.from(document.querySelectorAll("sso-expander .instance-block"));
    onElementReady(accountsSelector, function(err, accountElements) {
        if (err) {
            console.error(err);
            return;
        }
        const accountMap = accountElements.reduce((map, el) => {
            const name = el.querySelector(".name").textContent;
            const accountId = el
                .querySelector(".accountId")
                .textContent.replace("#", "");
            map[accountId] = name;
            return map;
        }, {});

        chrome.runtime.sendMessage({ type: "SetSSOAccounts", data: accountMap },
            function(response) {
                console.log("Saved SSO data to LocalStorage for Console augmentation.");
            }
        );
    });
}*/