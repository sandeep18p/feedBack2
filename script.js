const stars = document.getElementById('stars');
const nameInput = document.getElementById('name');
const ratingSelect = document.getElementById('rating');
const submitButton = document.getElementById('btn');
const contentDiv = document.getElementById('content');


const starOne = document.getElementById('one');
const starTwo = document.getElementById('two');
const starThree = document.getElementById('three');
const starFour = document.getElementById('four');
const starFive = document.getElementById('five');

const getAll = async () => {
  const data = await axios.get("https://crudcrud.com/api/c212809ff6bd4270b339bd4eca012d24/data");
  data.data.forEach(item => appendData(item));
}


getAll();

function fixRating(rating) {
    if (rating == "1") {
        starOne.textContent = parseInt(starOne.textContent) + 1;
    } else if (rating == "2") {
        starTwo.textContent = parseInt(starTwo.textContent) + 1;
    } else if (rating == "3") {
        starThree.textContent = parseInt(starThree.textContent) + 1;
    } else if (rating == "4") {
        starFour.textContent = parseInt(starFour.textContent) + 1;
    } else {
        starFive.textContent = parseInt(starFive.textContent) + 1;
    }
}

submitButton.addEventListener('click', run);

function run() {
    if (nameInput.value && ratingSelect.value && submitButton.textContent == "Submit") {
        const obj = {
            nameV: nameInput.value,
            rating: ratingSelect.value
        };
        pushData(obj).then(function (resp) {
            appendData(resp.data);
            fixRating(ratingSelect.value);
        })
        .catch(function (error) {
            console.log(error);
        });
    } else if (nameInput.value && ratingSelect.value && submitButton.textContent == "Edit Button") {
        const editedObj = {
            nameV: nameInput.value,
            rating: ratingSelect.value
        };
        editAxios(nameInput.value, editedObj);
    } else {
        alert("Please fill the review data");
    }
}

const pushData = async (obj) => {
    const res = await axios.post("https://crudcrud.com/api/c212809ff6bd4270b339bd4eca012d24/data", obj);
    return res;
}

const appendData = ({ nameV, rating, _id }) => {
    contentDiv.innerHTML += `<div class="container" id="${_id}">
        <div>${nameV}</div>
        <div>${rating}</div>
        <button class="edit-btn" id="edit-${_id}" data-id="${_id}" data-name="${nameV}" data-rating="${rating}">Edit</button>
        <button class="delete-btn" id="delete-${_id}" data-id="${_id}">Delete</button>
    </div>`;
}

const del = async (id) => {
    try {
        const res = await axios.delete(`https://crudcrud.com/api/c212809ff6bd4270b339bd4eca012d24/data/${id}`);
        if (res.status == 200) {
            document.getElementById(id).remove();
            clearRating(rating);
        }
    } catch (e) {
        console.log(e);
    }
}

contentDiv.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('delete-btn')) {
        const id = event.target.dataset.id;
        del(id);
    }
    if (event.target && event.target.classList.contains('edit-btn')) {
        const id = event.target.dataset.id;
        const nameV = event.target.dataset.name;
        const rating = event.target.dataset.rating;
        edit(nameV, id, rating);
    }
})

function clearRating(rating) {
    if (rating == "1") {
        starOne.textContent = parseInt(starOne.textContent) - 1;
    } else if (rating == "2") {
        starTwo.textContent = parseInt(starTwo.textContent) - 1;
    } else if (rating == "3") {
        starThree.textContent = parseInt(starThree.textContent) - 1;
    } else if (rating == "4") {
        starFour.textContent = parseInt(starFour.textContent) - 1;
    } else {
        starFive.textContent = parseInt(starFive.textContent) - 1;
    }
}

function edit(nameV, id, rating) {
    nameInput.value = nameV;
    ratingSelect.value = rating;
    submitButton.textContent = "Edit Button";
}

const editAxios = async (id, updatedObj) => {
    try {
        const res = await axios.put(`https://crudcrud.com/api/c212809ff6bd4270b339bd4eca012d24/data/${id}`, updatedObj);
        const updatedData = res.data;
        document.getElementById(id).querySelector('div').innerText = updatedData.nameV;
        document.getElementById(id).querySelectorAll('div')[1].innerText = updatedData.rating;
        fixRating(updatedData.rating);
    } catch (e) {
        console.log(e);
    }
}
