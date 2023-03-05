"use strict";

window.addEventListener("DOMContentLoaded", start);

// new here
const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  picture: "",
  house: "",
  blood: "",
  prefect: false,
  inquisitor: false,
  // new here
  expelled: false,
};

// new
const settings = {
  filter: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

// A very big array that stores each student as an object
let allStudents = [];

// new here
function start() {
  console.log("start");

  grabJSON();
  // new here
  findButtons();
}

// new here
function findButtons() {
  //Filter
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  //Sort
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

// Load JSON files: student list and student bloodlines
async function grabJSON() {
  await Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((res) => res.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((res) => res.json())]).then((jsonData) => {
    // When loaded, prepare data objects
    handleStudentObjects(jsonData[0], jsonData[1]);
  });
}

// An important function to handle the data from fetching. elements are the objects we import from json
function handleStudentObjects(students, bloodStatus) {
  students.forEach((element) => {
    //create new student object

    const student = Object.create(Student);
    student.firstname = grabFirstName(element.fullname);
    student.lastname = grabLastName(element.fullname);
    student.middlename = grabMiddleName(element.fullname);
    student.nickname = grabNickName(element.fullname);
    student.house = grabHouse(element.house);
    student.bloodStatus = grabBlood(student.lastname, bloodStatus);
    student.prefect = false;
    student.inqSpy = false;
    // To Do: image
    // student.picture = grabProfilePicture(element.fullname.trim());

    //CHANGES MADE HERE, was .push.Student;
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

function grabBlood(lastname, bloodStatus) {
  //define 2 arrays and store the provided data
  let halfBloodFamily = bloodStatus.half;
  let pureBloodFamily = bloodStatus.pure;
  let bothBloods = pureBloodFamily.includes(lastname) && halfBloodFamily.includes(lastname);

  // edge cases with no lastname or no blood type
  // edge cases with double blood
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

  // console.log(`Blood is: ${bloodStatus}`);
  console.log(" ");
  return bloodStatus;
}

//NEW:Filtering--------------------

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  // console.log(`filter by ${filter}`);
  setFilter(filter);
}

//new, making filterBy to global
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

// new:
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
  }
  return filteredList;
}

// All new here
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

//new Sorting------------------------
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

//new, making filterBy to global
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

//new Sorting
// also changes to HTML data-sort
function sortList(sortedList) {
  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    // console.log(`sortBy is ${sortBy}`);
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

//New
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

//To DO: About
//To DO: Searching

function displayList(wizards) {
  //clear the list:
  document.querySelector("#wizardList tbody").innerHTML = "";
  //build a new list:
  wizards.forEach(displayWizard);
  //Show number of students:
  // document.querySelector(#student_number or other ID).textContent = ` Number of student wizards: ${wizards.length}´
}

function displayWizard(student) {
  //create clone
  const clone = document.querySelector("template#wizard").content.cloneNode(true);

  //set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;
  // I can also choose not to show middlename and nickname
  clone.querySelector("[data-field=middleName]").textContent = student.middlename;
  // I can also choose not to show middlename and nickname
  clone.querySelector("[data-field=nickName]").textContent = student.nickname;

  clone.querySelector("[data-field=house]").textContent = student.house;

  // Make the button clickable to see more details
  clone.querySelector("#btnView").addEventListener("click", () => showWizardCard(student));

  //Mark a prefect

  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student);
    }

    buildList();
  }

  //inject to parent
  document.querySelector("#wizardList tbody").appendChild(clone);
}

// To DO: Display wizard card pop-up
function showWizardCard(student) {
  console.log("here will be a pop-up table with all student information ");
  //student profile picture
  //first name
  //middle name
  //last name
  //nickname
  //gender
  //blood status
  //house

  //if student is prefect, show prefect badge or write textContent yes/no
  //if student is an inquisitor, write yes no

  //UI to close the wixard  card

  //append it to clone
  //E.G. popupcard.appendChild(clone); // or whatever other name we come up with
}

// To DO: Try to make Prefect(chosenStudent)
// To DO: IF someone is not pure blood or slytherin - they cannot join Inquisitors open/close

// New here, ONGOING
function tryToMakePrefect(chosenStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const other = prefects.filter((student) => student.house === chosenStudent.house);
  const numberOfOthers = other.length;

  console.log(prefects);

  // Testing
  makePrefect(chosenStudent);

  function removeOther(other) {}

  function removeAorB(prefectA, prefectB) {}

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}
