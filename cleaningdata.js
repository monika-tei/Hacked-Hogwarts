"use strict";

// const url = "https://petlatkea.dk/2021/hogwarts/students.json";

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("start");
  grabJSON();
  //To Do: Grab event listeners
  addEventListeners();
}

function addEventListeners() {
  console.log("event listeners");
  // TO DO: event listeners for buttons: filter, Sort, Search, hacking
}

// Load JSON

async function grabJSON() {
  await Promise.all([
    fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((res) =>
      res.json()
    ),
    fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((res) =>
      res.json()
    ),
  ]).then((jsonData) => {
    // When loaded, prepare data objects
    handleStudentObjects(jsonData[0], jsonData[1]);
  });

  // allStudents = jsonData.map(prepStudentObject);
}

//once loaded, prepare data objects

function handleStudentObjects(students, bloodStatus) {
  students.forEach((element) => {
    const student = Object.create(Student);

    student.firstname = grabFirstName(element.fullname);
    student.lastname = grabLastName(element.fullname);
    student.middlename = grabMiddleName(element.fullname);
    student.nickname = grabNickName(element.fullname);
    student.house = grabHouse(element.house);
    student.bloodStatus = grabBloodStatus(student.lastname, bloodStatus);

    allStudents.push.Student;
  });

  // spliting full name into parts
  const fullname = jsonData.fullname.trim();
  const nameParts = fullname.split(/\s+/);

  // capitalize name parts
  const firstName = capitalize(nameParts[0]);
  let lastName = null;
  let middleName = null;
  let nickName = "" || null;

  if (nameParts.length === 3) {
    if (nameParts[1].startsWith('"') && nameParts[1].endsWith('"')) {
      nickName = capitalize(nameParts[1].slice(1, -1));
    } else {
      middleName = capitalize(nameParts[1]);
    }
    lastName = capitalize(nameParts[2]);
  } else {
    lastName = capitalize(nameParts[1]);
  }

  // finally here
  student.firstname = firstName;
  student.lastname = lastName;
  student.middlename = middleName || null;
  student.nickname = nickName || null;

  student.gender = jsonData.gender;
  student.house = capitalize(jsonData.house.trim());

  //display the list of students (temporary solution)
  console.table(student);

  // return student object
  return student;
}

// Capitalize the 1st letter of the name, turn others to lowercase and deal with Hyphen

function capitalize(name) {
  if (!name) return null;

  const hyphenIndex = name.indexOf("-");

  // names with a hyphen needs to have first letter after hyphen capitalized
  return name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
}

// Extracting the image name ()

// Student object
const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  image: "",
  house: "",
  blood: "",
};

// big array that stores each student as  an object
let allStudents = [];
