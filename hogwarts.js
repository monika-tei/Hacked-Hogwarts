"use strict";

window.addEventListener("DOMContentLoaded", start);

const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  picture: "",
  house: "",
  gender: "",
  blood: "",
  prefect: false,
  inquisitor: false,
  expelled: false,
};

const settings = {
  filter: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

// A very big array that stores each student as an object
let allStudents = [];
let expelledStudents = [];
let computerVirus = false;

function start() {
  console.log("start");
  grabJSON();
  findButtons();
}

function findButtons() {
  //Filter
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  //Sort
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
  //Search
  document.querySelector("#search-bar").addEventListener("input", searching);
  //Hack the system
  document.querySelector("#enterthevoid").addEventListener("click", hackSystem);
}

// Load JSON files: student list and student bloodlines
async function grabJSON() {
  await Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((res) => res.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((res) => res.json())]).then((jsonData) => {
    // When loaded, prepare data objects
    handleStudentObjects(jsonData[0], jsonData[1]);
  });
}

// General student details
function handleStudentObjects(students, bloodStatus) {
  students.forEach((element) => {
    //create new student object
    const student = Object.create(Student);
    student.firstname = grabFirstName(element.fullname);
    student.lastname = grabLastName(element.fullname);
    student.middlename = grabMiddleName(element.fullname);
    student.nickname = grabNickName(element.fullname);
    student.house = grabHouse(element.house);
    student.gender = grabGender(element.gender);
    student.picture = grabSelfie(student.firstname, student.lastname);
    student.bloodStatus = grabBlood(student.lastname, bloodStatus);
    student.prefect = false;
    student.inquisitor = false;
    student.expelled = false;
    allStudents.push(student);
  });

  displayList(allStudents);
}

function grabFirstName(fullname) {
  let firstname = fullname.trim();
  // if fullname contains a space, first name will be the first index
  if (fullname.includes(" ")) {
    firstname = firstname.substring(0, firstname.indexOf(" "));
    firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
  } else {
    // if fullname has only a name as in with no spaces
    firstname = firstname;
  }

  // console.log(`First name: ${firstname}`);
  return firstname;
}

function grabLastName(fullname) {
  let lastname = fullname.trim();
  //Look for the last space
  let lastSpace = lastname.lastIndexOf(" ") + 1;
  lastname = lastname.substring(lastSpace);
  lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();
  //Leanne Situation...
  if (lastname === "Leanne") {
    lastname = "";
  }
  //if contains -, capitalize first letter after hyphen
  if (fullname.includes("-")) {
    let twolastNames = lastname.split("-");
    twolastNames[1] = twolastNames[1].substring(0, 1).toUpperCase() + twolastNames[1].slice(1).toLowerCase();
    lastname = twolastNames.join("-");
  }

  // console.log(`Last name: ${lastname}`);
  return lastname;
}

function grabMiddleName(fullname) {
  // remove the space around both ends
  let middlename = fullname.trim();

  // I split the full name into an array
  middlename = middlename.split(" ");

  //the middle name will be between the first space and the last space
  if (fullname.includes('"')) {
    // If the second name has "" it is NOT a middle name (but a nickname... we will see later)
    middlename = "-";
  } else if (middlename.length > 2) {
    // if the array is longer than 2, the name at index 1 will be the middlename!
    middlename = middlename[1];
    middlename = middlename.charAt(0).toUpperCase() + middlename.slice(1).toLowerCase();
  } else {
    middlename = "-";
  }

  // console.log(`Middle name: ${middlename}`);
  return middlename;
}

function grabNickName(fullname) {
  let nickname = fullname.trim();
  nickname = nickname.split(" ");
  //Again, looking for second name
  if (fullname.includes('"')) {
    //[1] because it indicates location of the nickname in fullname ;
    nickname = nickname[1];
  } else {
    nickname = "-";
  }

  // console.log(`Nickname: ${nickname}`);
  return nickname;
}

function grabHouse(house) {
  house = house.trim();
  house = house.charAt(0).toUpperCase() + house.slice(1).toLowerCase();

  // console.log(`House: ${house}`);
  return house;
}

function grabGender(gender) {
  gender = gender.trim();
  gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

  return gender;
}

function grabSelfie(firstname, lastname) {
  let picture;

  if (lastname === "") {
    picture = `./img/${firstname.toLowerCase()}.png`;
  } else if (lastname === "Patil") {
    picture = `./img/${lastname.toLowerCase()}_${firstname.toLowerCase()}.png`;
  } else if (firstname === "Justin") {
    lastname = lastname.split("-");
    picture = `./img/${lastname[1].toLowerCase()}_${firstname.substring(0, 1).toLowerCase()}.png`;
  } else {
    picture = `./img/${lastname.toLowerCase()}_${firstname.substring(0, 1).toLowerCase()}.png`;
    // console.log(picture);
  }
  return picture;
}

function grabBlood(lastname, bloodStatus) {
  let halfBloodFamily = bloodStatus.half;
  let pureBloodFamily = bloodStatus.pure;
  let bothBloods = pureBloodFamily.includes(lastname) && halfBloodFamily.includes(lastname);

  // edge cases with no lastname or no blood type++
  // edge cases with double blood++ to half...
  // 1. Abbott is both pure and half
  // 2. Potter is both pure and half
  // 3. Bullstrode is both pure and half
  if (halfBloodFamily.includes(lastname) || bothBloods) {
    bloodStatus = "Of Half Blood";
  } else if (pureBloodFamily.includes(lastname)) {
    bloodStatus = "Of Pure Blood";
  } else if (!lastname || !bloodStatus) {
    bloodStatus = "Blood Unknown";
  } else {
    bloodStatus = "Muggle-born mudblood!";
  }

  console.log(" ");
  return bloodStatus;
}

// Filtering-------------------------------------
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allStudents;
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "prefect") {
    filteredList = allStudents.filter(isPrefect);
  } else if (settings.filterBy === "inquisitor") {
    filteredList = allStudents.filter(isInqSqd);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  }

  return filteredList;
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isPrefect(student) {
  return student.prefect === true;
}

function isInqSqd(student) {
  return student.inquisitor === true;
}

function isExpelled(student) {
  return student.expelled === true;
}

//SORT-------------------------------------
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  // find old sortBy element that had the active sort
  const oldElement = document.querySelector(`[data-sort=${settings.sortBy}]`);
  oldElement.classList.remove("sortBy");
  // indicate active sort
  event.target.classList.add("sortBy");

  // toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`); // works in console
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

function buildList() {
  allStudents.filter((student) => student.expelled === false);
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

//Searching-------------------------------------
function searching() {
  // find the word
  const searchingFor = document.querySelector("#search-bar").value.toLowerCase();
  // console.log(`searching for ${searchingFor}`);
  const findSearchResult = allStudents.filter((student) => {
    return student.firstname.toLowerCase().includes(searchingFor) || student.lastname.toLowerCase().includes(searchingFor);
  });
  displayList(findSearchResult);
}

function countExpelledStudents() {
  let count = 0;
  for (let i = 0; i < allStudents.length; i++) {
    if (allStudents[i].expelled) {
      count++;
    }
  }
  return count;
}

//TO DO: show number of students
function displayList(wizards) {
  //clear the list:
  document.querySelector("#wizardList tbody").innerHTML = "";
  //build a new list:
  wizards.forEach(displayWizard);
  //Show number of students:
  document.querySelector("#status-students").textContent = `Currently displayed: ${wizards.length} Wizards`;
}

function displayWizard(student) {
  const clone = document.querySelector("template#wizard").content.cloneNode(true);

  //set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;
  // clone.querySelector("[data-field=picture] img").src = student.picture;

  // Make the button clickable to see more details
  clone.querySelector("#btnView").addEventListener("click", () => showWizardCard(student));

  // PREFECTS
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student);
    }

    const prefectCount = allStudents.filter((student) => student.prefect === true).length;
    document.querySelector("#status-prefects").textContent = `There are currently ${prefectCount} Prefects`;

    buildList();
  }

  // INQUISITORS
  clone.querySelector("[data-field=inquisitor]").dataset.inquisitor = student.inquisitor;
  clone.querySelector("[data-field=inquisitor]").addEventListener("click", clickInquisitor);

  function clickInquisitor() {
    console.log("clicked inquisitor");
    if (student.house === "Slytherin" && student.bloodStatus === "Of Pure Blood") {
      student.inquisitor = true;
      messUpInquisitors();
    } else if (student.inquisitor === true) {
      student.inquisitor = false;
    } else {
      notInquisitor();
    }

    const inquisitorCount = allStudents.filter((student) => student.inquisitor === true).length;
    document.querySelector("#status-inquisitors").textContent = `There are currently ${inquisitorCount} Inqusitors`;

    buildList();
  }

  //inject to parent
  document.querySelector("#wizardList tbody").appendChild(clone);
}

//To DO: add animation, float up
function showWizardCard(student) {
  modal.classList.remove("hide");

  modal.textContent = "";
  const clone = document.querySelector("template#wizard-modal").cloneNode(true).content;

  //house text
  clone.querySelector("#card-house-text").textContent = `${student.house}`;

  //Blood text
  clone.querySelector("#card-blood-text").textContent = `${student.bloodStatus}`;

  //Blood img
  if (student.bloodStatus === "Of Half Blood") {
    clone.querySelector("#card-blood-img").src = `./img/blood-half.png`;
  } else if (student.bloodStatus === "Of Pure Blood") {
    clone.querySelector("#card-blood-img").src = `./img/blood-pure.png`;
  } else if (student.bloodStatus === "Muggle-born mudblood!") {
    clone.querySelector("#card-blood-img").src = `./img/blood-mud.png`;
  } else {
    clone.querySelector("#card-blood-img").src = `./img/blood-unknown.png`;
  }

  //student profile picture
  clone.querySelector("#card-pic").src = student.picture;

  //first name
  clone.querySelector("#card-firstname").textContent = `First name: ${student.firstname}`;
  //last name
  clone.querySelector("#card-lastname").textContent = `Last name: ${student.lastname}`;
  //middle name
  clone.querySelector("#card-middlename").textContent = `Middle name: ${student.middlename}`;
  //nickname
  clone.querySelector("#card-nickname").textContent = `Nickname: ${student.nickname}`;
  //gender
  clone.querySelector("#card-gender").textContent = `Gender: ${student.gender}`;

  // Card background

  if (student.house === "Gryffindor") {
    clone.querySelector("#dialog-card").classList.add("house-g");
  } else if (student.house === "Slytherin") {
    clone.querySelector("#dialog-card").classList.add("house-s");
  } else if (student.house === "Ravenclaw") {
    clone.querySelector("#dialog-card").classList.add("house-r");
  } else {
    clone.querySelector("#dialog-card").classList.add("house-h");
  }

  //Prefects

  if (student.prefect === true) {
    clone.querySelector("#card-prefect").textContent = `Is a Prefect`;
  } else {
    clone.querySelector("#card-prefect").textContent = `Not a Prefect`;
  }

  // if (student.prefect === true) {
  //   clone.querySelector("#card-prefect").textContent = `Is a Prefect`;
  //   prefectCount++;
  //   console.log(prefectCount);
  // } else {
  //   clone.querySelector("#card-prefect").textContent = `Not a Prefect`;
  // }
  // document.querySelector("#status-prefects").textContent = `There are currently ${prefectCount} Prefects`;

  //Inquisitors
  if (student.inquisitor === true) {
    clone.querySelector("#card-inquisitor").textContent = `Inquisitor: yes`;
  } else {
    clone.querySelector("#card-inquisitor").textContent = `Not Inquisitor`;
  }

  //Expel a student
  clone.querySelector("#card-expel").addEventListener("click", clickExpel);

  function clickExpel() {
    if (student.firstname === "Monika") {
      student.expelled = false;
      cantExpelME();
    } else {
      student.expelled = true;
      document.querySelector("#card-expel").textContent = "EXPELLED";
      document.querySelectorAll("#dialog-card, #card-blood").forEach((element) => {
        element.style.backgroundColor = "grey";
        element.style.backgroundBlendMode = "luminosity";
      });
    }
    const expelledCount = countExpelledStudents();
    document.querySelector("#status-expelled").textContent = `There are currently ${expelledCount} expelled Wizards`;

    buildList();
  }
  //Close the card
  clone.querySelector("#closebtn .closemodal").addEventListener("click", closeModal);

  // append child
  document.querySelector("main #modal").appendChild(clone);
}

// TO DO: make it dramatic
function cantExpelME() {
  // change text content on the button;
  document.querySelector("#card-expel").textContent = "YOU CANT EXPEL ME";
  document.querySelector("#card-expel").classList.add("beyondExpell");
}

function tryToMakePrefect(chosenStudent) {
  const prefect = allStudents.filter((student) => student.prefect);
  const sameHousePrefect = prefect.filter((student) => student.house === chosenStudent.house);
  const numberOfSameHousePrefects = sameHousePrefect.length;

  // there can only by 2 people from the same house!
  if (numberOfSameHousePrefects >= 2) {
    removeAorB(sameHousePrefect[0], sameHousePrefect[1]);
  } else {
    makePrefect(chosenStudent);
  }

  function removeAorB(prefectA, prefectB) {
    console.log("there can only be 2 prefects");

    // show dialog popup
    document.querySelector("#removeAorB").classList.remove("hide");
    // activate close btn, remove A and remove B buttons;
    document.querySelector("#removeAorB .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#removeAorB #removeA").addEventListener("click", removeA);
    document.querySelector("#removeAorB #removeB").addEventListener("click", removeB);
    // show prefect initials on buttons
    document.querySelector("#removeAorB [data-field=prefectA]").textContent = `${prefectA.firstname} ${prefectA.lastname}`;
    document.querySelector("#removeAorB [data-field=prefectB]").textContent = `${prefectB.firstname} ${prefectB.lastname}`;

    // if ignore, no action taken, close dialog, deactivate buttons
    function closeDialog() {
      console.log("close dialog");
      // hide dialog popup
      document.querySelector("#removeAorB").classList.add("hide");
      // deactivate buttons
      document.querySelector(".closebutton").removeEventListener("click", closeDialog);
      document.getElementById("removeA").removeEventListener("click", removeA);
      document.getElementById("removeB").removeEventListener("click", removeB);
    }

    // if remove A
    function removeA() {
      console.log("remove-A");
      removePrefect(prefectA);
      makePrefect(chosenStudent);
      buildList();
      closeDialog();
    }

    // if remove B
    function removeB() {
      console.log("remove-B");
      removePrefect(prefectB);
      makePrefect(chosenStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}

function notInquisitor() {
  console.log("student cannot join inquisitors");

  // Show popup, activate button
  document.querySelector("#nonInq").classList.remove("hide");
  document.querySelector("#nonInq .closebutton").addEventListener("click", closeInqDialog);

  //Close
  function closeInqDialog() {
    console.log("close dialog");
    // hide popup
    document.querySelector("#nonInq").classList.add("hide");
    //deactivate button
    document.querySelector("#nonInq .closebutton").removeEventListener("click", closeInqDialog);
  }
}

function closeModal() {
  console.log("closes card view");
  modal.classList.add("hide");
}

// ENTER THE VOID
function hackSystem() {
  console.log("enter the void");
  computerVirus = true;
  // document.querySelector("h1").classList.add("hackedFont");
  // document.querySelector("body").classList.add("hacked");

  injectMyself();
  messUpInquisitors();
  bloodyMadness();
}

function injectMyself() {
  console.log("injected");
  const monika = {
    firstname: "Monika",
    lastname: "Tei",
    middlename: "",
    nickname: "Moni",
    picture: `./img/me.webp`,
    house: "Gryffindor",
    gender: "Girl",
    bloodStatus: "Muggle-born mudblood!",
    prefect: false,
    inquisitor: false,
    expelled: false,
  };
  allStudents.push(monika);
  buildList();
}

function messUpInquisitors() {
  allStudents.forEach((student) => {
    if (student.inquisitor === true) {
      setTimeout(() => {
        student.inquisitor = false;

        buildList();
      }, 2500);
    }
  });
}

function bloodyMadness() {
  // Define an array of possible blood statuses
  const bloodStatuses = ["Of Pure Blood", "Of Half Blood", "Muggle-born mudblood!"];

  // Loop through all the students
  allStudents.forEach((student) => {
    // If the student is a former pure-blood, randomly assign a new blood status
    if (student.bloodStatus === "Of Pure Blood") {
      student.bloodStatus = bloodStatuses[Math.floor(Math.random() * bloodStatuses.length)];
    }
    // If the student is not a former pure-blood, set their blood status to "Of Pure Blood"
    else {
      student.bloodStatus = "Of Pure Blood";
    }
  });

  buildList();
}
