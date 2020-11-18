const combineList = document.getElementById('combines-list');
const searchBar = document.getElementById('find-combine');
const clearButton = document.getElementById('clear-search-bar');

const createCombineID = document.getElementById('create_id');
const createCombineName = document.getElementById('create_name');
const createCombineSpeed = document.getElementById('create_speedInKm');
const createCombinePrice = document.getElementById('create_priceInUSD');

let editActive = false;

const combines_url = 'http://localhost:5000/car';

let combines = [];

function fetchData(url) {
    fetch(url).then(response => response.json()).then(data => {
        for (i = 0; i < data.length; i++) {
            combines.push(data[i]);
        }
        displayCombines(combines);
    });
}

let currentCombines = combines

// SEARCH
searchBar.addEventListener('keyup', filterCombines)

function filterCombines(searchString) {
    const searchFilterString = searchString.target.value.toLowerCase();
    const filteredCombines = combines.filter(combine => {
        return combine.name.toLowerCase().includes(searchFilterString);
    });
    currentCombines = filteredCombines;
    showSortedCombines();
}

clearButton.addEventListener('click', () => {
    searchBar.value = '';
    currentCombines = combines;
    showSortedCombines();
})

// CALCULATE
function calculatePrice() {
    var priceSum = 0;
    var totalPriceLabel = document.getElementById('total-price');
    currentCombines.forEach(combine => priceSum += combine.priceInUSD);
    totalPriceLabel.textContent = 'Total price: ' + priceSum + '$';
}

//SORT
function showSortedCombines() {
    var sortType = document.getElementById('sort-select').value;
    if (sortType == 'none') {
        displayCombines(currentCombines);
        return;
    } else if (sortType == 'name') {
        currentCombines.sort(compareByName);
    } else if (sortType == 'speed') {
        currentCombines.sort(compareBySpeed);
    } else if (sortType == 'price') {
        currentCombines.sort(compareByPrice);
    }
    displayCombines(currentCombines);
}

function compareByName(firstCombine, secondCombine) {
    var firstCombineName = firstCombine.name.toLowerCase();
    var secondCombineName = secondCombine.name.toLowerCase();
    if (firstCombineName < secondCombineName) {
        return -1;
    }
    if (firstCombineName > secondCombineName) {
        return 1;
    }
    return 0;
}

function compareBySpeed(firstCombine, secondCombine) {
    return firstCombine.speedInKm - secondCombine.speedInKm;
}

function compareByPrice(firstCombine, secondCombine) {
    return firstCombine.priceInUSD - secondCombine.priceInUSD;
}

//DISPLAY
const displayCombines = (combinesToShow) => {
    const htmlString = combinesToShow.map((combine) => {
        return `
        <li class="combine">
        <div>            
        <h2 class="combine_id">${combine.id}</h2>
        <h2>${combine.name}</h2>
        <h3 class="speedInKm">${combine.speedInKm} Km</h3>
        <h3 class="priceInUSD">${combine.priceInUSD} $</h3>
    </div>
    <form class="form__edit_combine" id="form__edit_combine">
            <input id="edit_name" name="name" type="text" placeholder="Name">
            <input id="edit_speedInKm" name="speedInKm" type="number" step=1 placeholder="Speed">
            <input id="edit_priceInUSD" name="priceInUSD" type="number" placeholder="Price">
    </form>
            <div class= "control-buttons">
                <button class="btn btn-warning" id="edit-button" onclick="editRecord(this)">Edit</button>
                <button class="btn btn-danger" id="delete-button" onclick="deleteRecord(this)">Delete</button>
            </div>
        </li>
        `
    }).join('');

    combineList.innerHTML = htmlString;
}

//DELETE
function deleteRecord(record) {
    const list_to_delete = record.parentNode.parentNode;
    let combineId = parseInt(list_to_delete.childNodes[1].childNodes[1].innerHTML);
    let indexToDeleteFromAll = combines.findIndex(obj => obj.id == combineId);
    combines.splice(indexToDeleteFromAll, 1);
    let indexToDeleteFromCurrent = currentCombines.findIndex(obj => obj.id == combineId);
    if (indexToDeleteFromCurrent != -1) {
        currentCombines.splice(indexToDeleteFromCurrent, 1);
    }
    deleteCombine(combineId);
    showSortedCombines();
    return list_to_delete;
}

//EDIT
function editRecord(record) {
    const nodeList = record.parentNode.parentNode.childNodes;
    const editBar = nodeList[3];
    const infoBar = nodeList[1];
    let combineId = parseInt(infoBar.childNodes[1].innerHTML);
    let combineName = infoBar.childNodes[3].innerHTML;
    let combineSpeed = parseFloat(infoBar.childNodes[5].innerHTML);
    let combinePrice = parseFloat(infoBar.childNodes[7].innerHTML);
    const editedCombineName = nodeList[3][0];
    const editedCombineSpeed = nodeList[3][1];
    const editedCombinePrice = nodeList[3][2];

    let indexToEdit = combines.findIndex(obj => obj.id == combineId);
    if (editActive == false) {
        openEditBar(editBar, infoBar);
        editActive = true;
    } else if (editActive == true) {
        closeEditBar(editBar, infoBar);

        if (validateSpeedAndPrice(editedCombineSpeed.value, editedCombinePrice.value) == false) {
            editedCombineSpeed.value = '';
            editedCombinePrice.value = '';
            editActive = false;
            return;
        }

        let finalName = combineName;
        let finalSpeed = combineSpeed;
        let finalPrice = combinePrice;
        if (editedCombineName.value == "" && editedCombineSpeed.value == "" && editedCombinePrice.value == "") {
            editActive = false;
            showSortedCombines();
            return
        }

        if (editedCombineName.value != "") {
            combines[indexToEdit]["name"] = editedCombineName.value;
            finalName = editedCombineName.value;
        } else {
            combines[indexToEdit]["name"] = combineName;
        }
        if (editedCombineSpeed.value != "") {
            combines[indexToEdit]["speedInKm"] = parseFloat(editedCombineSpeed.value);
            finalSpeed = parseFloat(editedCombineSpeed.value);
        } else {
            combines[indexToEdit]["speedInKm"] = combineSpeed;
        }
        if (editedCombinePrice.value != "") {
            combines[indexToEdit]["priceInUSD"] = parseFloat(editedCombinesPrice.value);
            finalPrice = parseFloat(editedCombinePrice.value);
        } else {
            combines[indexToEdit]["priceInUSD"] = combinePrice
        }

        if (searchBar.value != '' && editedCombineName.value != '' && editedCombineName.value.includes(searchBar.value) == false) {
            let indexToDeleteFromCurrent = currentCombines.findIndex(obj => obj.id == combineId);
            currentCombines.splice(indexToDeleteFromCurrent, 1);
        }

        const jsonCombine = createJSON(finalName, finalSpeed, finalPrice)
        editCombine(combineId, jsonCombine)
        editActive = false;
        showSortedCombines();
    }
}

function openEditBar(editBar, infoBar) {
    editBar.classList.add('open');
    editBar.classList.remove('hide');
    infoBar.classList.add('hide');
    infoBar.classList.remove('open');
}

function closeEditBar(editBar, infoBar) {
    editBar.classList.add('hide');
    editBar.classList.remove('open');
    infoBar.classList.add('open');
    infoBar.classList.remove('hide');
}

//CREATE
async function createCombine() {
    if (validateFormRequirements(createCombineName.value, createCombineSpeed.value, createCombinePrice.value) == false) {
        return;
    }
    if (validateSpeedAndPrice(createCombineSpeed.value, createCombinePrice.value) == false) {
        return;
    }

    const jsonCombine = createJSON(createCombineName.value, createCombineSpeed.value, createCombinePrice.value);
    await postCombine(jsonCombine);
    showSortedCombines();
    return jsonCombine;
}
async function postCombine(newCombine) {
    let response = await fetch(combines_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(newCombine)
    }).then(response => response.json()).then(data => combines.push(data))
    return response;
}


async function deleteCombine(id) {
    let response = await fetch(combines_url + '/' + id, {
        method: 'DELETE',
    })
    return response;
}
async function editCombine(id, editedCombine) {
    fetch(combines_url + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(editedCombine)
    })
}

function createJSON(name, speed, price) {
    let createdCombine = {
        "name": name,
        "speedInKm": parseFloat(speed),
        "priceInUSD": parseFloat(price)
    }
    return createdCombine;
}

function validateSpeedAndPrice(speed, price) {
    if (parseFloat(speed) <= 0) {
        alert('speed cannot be less then zero');
        return false;
    }
    if (parseFloat(price) <= 0) {
        alert('price cannot be less then zero');
        return false;
    }
    return true;
}

function validateFormRequirements(name, speed, price) {
    if (name == '') {
        alert('name field is requiered')
        return false;
    }
    if (speed == '') {
        alert('speed field is requiered');
        return false;
    }
    if (price == 0) {
        alert('price  field is requiered');
        return false;
    }
    return true;
}

fetchData(combines_url);