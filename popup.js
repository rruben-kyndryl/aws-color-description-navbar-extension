const addbutton = document.getElementById('add-account');

document.querySelectorAll('input').forEach(input => {
    if (window.browser !== undefined) {
        // On Firefox
        // Workaround for a bug in their color picker
        input.type = "text";
    }
});

function delete_account(o) {


    console.log(o);

    var p = o.srcElement.parentNode.parentNode;
    p.parentNode.removeChild(p);

    console.log("remove id:" + p.id);
    chrome.storage.sync.remove(p.id);
}

function change_color(o) {

    var p = o.srcElement.parentNode.parentNode;
    console.log("change id:" + p.id + " to :" +
        o.srcElement.value);

    chrome.storage.sync.get(p.id, (results) => {

        datos = results[p.id];
        datos["color"] = o.srcElement.value;
        console.log(datos);
        chrome.storage.sync.set({
            [p.id]: datos
        });
    });
}


function change_description(o) {

    var p = o.srcElement.parentNode.parentNode;
    console.log("change id:" + p.id + " to :" +
        o.srcElement.value);

    chrome.storage.sync.get(p.id, (results) => {

        datos = results[p.id];
        datos["description"] = o.srcElement.value;
        console.log(datos);

        chrome.storage.sync.set({
            [p.id]: datos
        });
    });
}


addbutton.addEventListener('click', () => {
    const account = document.getElementById('input_account').value;
    const description = document.getElementById('input_description').value;
    const color = document.getElementById('input_color').value;

    record = { "description": description, "color": color };

    console.log("record:" + record);
    chrome.storage.sync.set({
        [account]: record
    });


    var table = document.getElementById('aws_accounts');
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    row.id = account
    cell = row.insertCell(0);
    cell.innerHTML = account;

    cell = row.insertCell(1);
    const input_description = document.createElement("input");
    input_description.type = "text"
    input_description.value = description;
    input_description.addEventListener("change", change_description)
    cell.appendChild(input_description);

    cell = row.insertCell(2);
    const input_color = document.createElement("input");
    input_color.type = "color"
    input_color.value = color
    input_color.addEventListener("change", change_color)
    cell.appendChild(input_color);

    cell = row.insertCell(3);
    const remove_button = document.createElement("button");
    remove_button.className = "button";
    remove_button.innerText = "remove"
    remove_button.addEventListener("click", delete_account)
    cell.appendChild(remove_button);


});


function loadFromStorage() {

    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        console.log(allKeys);
    });

    chrome.storage.sync.get(null, data => {
        if (data) {
            console.log(data)
            var table = document.getElementById('aws_accounts');
            var rowCount = 1;

            for (const [id, value] of Object.entries(data)) {

                var row = table.insertRow(rowCount);
                row.id = id

                rowCount++;

                cell = row.insertCell(0);
                cell.innerHTML = id;

                cell = row.insertCell(1);
                const input_description = document.createElement("input");
                input_description.type = "text"
                input_description.value = value["description"];
                input_description.addEventListener("change", change_description)
                cell.appendChild(input_description);

                cell = row.insertCell(2);
                const input_color = document.createElement("input");
                input_color.type = "color"
                input_color.value = value["color"];
                input_color.addEventListener("change", change_color)
                cell.appendChild(input_color);

                cell = row.insertCell(3);
                const remove_button = document.createElement("button");
                remove_button.className = "button";
                remove_button.innerText = "remove"
                remove_button.addEventListener("click", delete_account)
                cell.appendChild(remove_button);

            }
        }
    });
}

loadFromStorage();