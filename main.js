const account = document.querySelector("div.globalNav-0336").children[0].innerText.split(":")[1].trim().replaceAll("-", "")

chrome.storage.sync.get(account, (results) => {

    const Account = document.querySelector("div.globalNav-0336").children[0].innerText.split(":")[1].trim()
    let header = document.createElement('div');
    let span = document.createElement('span');
    let datos = results[account];

    header.className = "globalNav-033";
    header.style.fontFamily = '"Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif';
    header.style.fontSize = "18px";
    header.style.color = "white";
    header.style.backgroundColor = datos["color"];
    header.appendChild(span);


    span.style.marginLeft = "19px";
    span.innerText = "Account: " + datos["description"];

    document.querySelector("nav.globalNav-032").children[0].insertBefore(header, document.querySelector("nav.globalNav-032").children[0].firstChild);



})