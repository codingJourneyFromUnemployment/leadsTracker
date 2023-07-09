let myLeads = [];
let leadsList = document.getElementsByClassName("leads-list")[0];
let inputEl = document.getElementById("input-el");
let saveinputEl = document.getElementById("saveinput-el");
let deleteAllEl = document.getElementById("deleteall-el");
let saveTabEl = document.getElementById("savetab-el");

window.onload = refreshLeads;
saveTabEl.addEventListener("click", saveTab);
deleteAllEl.addEventListener("click", deleteAll);
saveinputEl.addEventListener("click", savelead);

inputEl.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        saveinputEl.click();
    }
});

function renderLeads(_myLeads){
    for (let i = 0; i < _myLeads.length; i++) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.href = _myLeads[i];
        a.textContent = _myLeads[i];
        a.target = "_blank";
        li.appendChild(a);
        leadsList.appendChild(li);
    }
}

function refreshLeads() {
    let leadsFromLocalStorage = localStorage.getItem("myLeads");
    if (leadsFromLocalStorage) {
        myLeads = JSON.parse(leadsFromLocalStorage);
    } else {
        myLeads = [];
    } 
    renderLeads(myLeads);
}

function updatemyLeads(_address, _myLeads) {
    console.log("Address:", _address);
    console.log("myLeads before:", _myLeads);

    for (let i = 0; i < _myLeads.length; i++) {
        if (_myLeads[i] == _address) {
            alert("This lead already exists!");
            return;
        }
    }
    _myLeads.push(_address);
}

function savelead() {
    let inputlead = document.getElementById("input-el").value;
    if (!inputlead.startsWith("http://") && !inputlead.startsWith("https://")) {
        inputlead = "http://" + inputlead;
    }
    
    updatemyLeads(inputlead, myLeads);
    leadsList.innerHTML = "";
    renderLeads(myLeads);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    document.getElementById("input-el").value = "";
}



function deleteAll() {
    let deleteConfirm = confirm("Are you sure you want to delete all leads?");
    if (deleteConfirm) {
        localStorage.removeItem("myLeads");
        location.reload(); 
    }   
}

function saveTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let tab = tabs[0].url;
        console.log("Tab URL:", tab);
        updatemyLeads(tab, myLeads);
        leadsList.innerHTML = "";
        renderLeads(myLeads);
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
    });
} 
