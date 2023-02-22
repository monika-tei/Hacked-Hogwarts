"use strict";

window.addEventListener("DOMContentLoaded", start);

// Prototype for the Student object
const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  picture: "",
  house: "",
  blood: "",
  prefect: false,
  inqSpy: false,
};

// Global variables for filtering and sorting
const settings = {
  filter: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

// A very big array that stores each student as  an object
let allStudents = [];

// Start
function start() {
  console.log("start");
  grabJSON();
  addEventListeners();
}

// TO DO: event listeners for buttons: filter, Sort, Search, hacking
function addEventListeners() {
  console.log("will activate events");
}

// Load JSON files: student list and student bloodlines
async function grabJSON() {
  await Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((res) => res.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((res) => res.json())]).then((jsonData) => {
    // When loaded, prepare data objects
    handleStudentObjects(jsonData[0], jsonData[1]);
  });

  // allStudents = jsonData.map(prepStudentObject);
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
    student.bloodStatus = grabBloodStatus(student.lastname, bloodStatus);
    student.prefect = false;
    student.inqSpy = false;
    // To Do: image
    // student.picture = grabProfilePicture(element.fullname.trim());

    allStudents.push.Student;
  });
  // displayList(allStudents);
  // builList(); build new list (will make sense when I have the filters and sorting ready)
}

// TO DO: Create the necessary functions to format the names
function grabFirstName(fullname) {
  let firstname = fullname.trim();
  console.log(`full name: ${fullname}`);
  // if fullname contains a space, first name will be the first index
  if (fullname.includes(" ")) {
    firstname = firstname.substring(0, firstname.indexOf(" "));
    firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
  } else {
    // if fullname has only a name as in with no spaces
    firstname = firstname;
  }
  //Test
  console.log(`First name: ${firstname}`);
  return firstname;
}

// Wednesday To Do: deal with the hyphen! Justin Finch-fletchley situation
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

  //Test
  console.log(`Last name: ${lastname}`);
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
    middlename = "";
  } else if (middlename.length > 2) {
    // if the array is longer than 2, the name at index 1 will be the middlename!
    middlename = middlename[1];
    middlename = middlename.charAt(0).toUpperCase() + middlename.slice(1).toLowerCase();
  } else {
    middlename = "";
  }

  //Test
  console.log(`Middle name: ${middlename}`);
  return middlename;
}

function grabNickName(fullname) {
  let nickname = fullname.trim();
  nickname = nickname.split(" ");
  //Again, looking for second name
  if (fullname.includes(' "')) {
    nickname = nickname[1];
    nickname = nickname.charAt(0).toUpperCase() + nickname.slice(1).toLowerCase();
  } else {
    nickname = "";
  }

  //Test
  console.log(`Nickname: ${nickname}`);
  return nickname;
}

function grabHouse(house) {
  house = house.trim();
  house = house.charAt(0).toUpperCase() + house.slice(1).toLowerCase();

  console.log(`House: ${house}`);
  return house;
}

function grabBloodStatus(lastname, bloodStatus) {
  console.log("-");
}

// TO DO: Build the HTML with preliminary list view from animal base, just so I can view things
// TO DO: Create the template and make a function to populate that template with
// Populating the clone template, inserting textContent and so on.
