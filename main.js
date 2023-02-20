const account = document.querySelector('[data-testid="account-detail-menu"]').querySelectorAll('span')[1].innerText.trim().replaceAll("-", "")


function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch (message.type) {
            case "getAccount":
                sendResponse({ number: account });
                break;
            case "drawDescription":
                drawDescription();
                sendResponse({ done: "ok" });
                break;
        }
    }
);

function drawDescription() {
    chrome.storage.sync.get(account, (results) => {

        const Account = document.querySelector('[data-testid="account-detail-menu"]').querySelectorAll('span')[1].innerText.trim().replaceAll("-", "")

        header = document.getElementById("aws-description-header");
        span = document.getElementById("aws-description-span");

        datos = results[account];
        if (datos) {
            if (!header) {
                header = document.createElement('div');
                span = document.createElement('span');

                header.id = "aws-description-header";
                header.style.backgroundColor = datos["color"];
                header.appendChild(span);

                span.id = "aws-description-span"
                span.style.marginLeft = "auto";
                span.style.marginRight = "auto";
                span.innerText = "Account: " + datos["description"];

                console.info("color:" + datos["color"]);
                document.getElementById("awsc-nav-header").children[0].style.backgroundColor = datos["color"];
                document.getElementById("awsc-concierge-input").style.setProperty('background-color', 'white', 'important');
                document.getElementById("awsc-concierge-input").style.setProperty('color', 'black', 'important');
                document.getElementById("awsc-concierge-input").style.setProperty('border-color', LightenDarkenColor(datos["color"], -40), 'important');
                document.getElementById("console-nav-footer-inner").style.borderColor = LightenDarkenColor(datos["color"], -40);
                document.getElementById("console-nav-footer-inner").style.backgroundColor = datos["color"];
                document.getElementById("awsc-nav-footer-content").insertBefore(header, document.getElementById("awsc-nav-footer-content").children[3]);
            } else {
                header.style.backgroundColor = datos["color"];
                span.innerText = "Account: " + datos["description"];
            }
        }
    });
}

drawDescription();