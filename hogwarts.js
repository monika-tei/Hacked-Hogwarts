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

// Preliminary variables for filtering and sorting
const settings = {
  filter: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

// A very big array that stores each student as an object
let allStudents = [];

// Start
function start() {
  console.log("start");
  grabJSON();
  addEventListeners();
}

// TO DO: event listeners for buttons: filter, Sort, Search, hacking
function addEventListeners() {
  // console.log("will activate events"); probably buttons aha
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

    allStudents.push.Student;
  });
  // displayList(allStudents);
  // builList(); build new list (will make sense when I have the filters and sorting ready)
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
  //Test
  console.log(`First name: ${firstname}`);
  // console.log(`full name: ${fullname}`);

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
    nickname = "";
  }

  //Test
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

  console.log(`Blood is: ${bloodStatus}`);
  console.log(" ");
  return bloodStatus;
}

// TO DO: very basic HTML with preliminary list view from animal base, just so I can view thing

// TO DO: Create the template and make a function to populate that template with

// Populating the clone template, inserting textContent and so on.
