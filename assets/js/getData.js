/*
Fetch used to retrieve records from gist.
This script sorts data into a usable format, randomly adds extra attendance data ( 4 weeks),
and adds extra students to different papers to test cross paper attendence. 
It also create a timetable for the papers, some with mulitle steams for testing. 
What would be ideal is to only retrieve the semester => paper on each fetch. 
*/

let attendanceArray = [];
let roomTimeTable = [];
let streams = [];

let checks = [
  { key: 'p', value: 'present' },
  { key: 'l', value: 'late' },
  { key: 'e', value: 'explained' },
  { key: 'a', value: 'absent' },
  { key: 's', value: 'sick' },
  { key: '-', value: 'yet to be filled in' },
  { key: 'n', value: 'anotherStream' }, // only used within program - not displayed
];

let url = `https://api.github.com/gists/b40fa9bba517ff258da395c79edd2477`;

fetch(url)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(
        'Can not get the data from the API right now. Try again later'
      );
    }
  })
  .then((responseJson) => {
    let results = JSON.parse(responseJson.files['attendance.json'].content);
    results.forEach((obj) => {

      let first = obj.name.first;
      let last = obj.name.last;
      let fullName = first + ' ' + last;
      let paper = obj.class;
      let attendance = obj.attendance;
      let stream = 'A';
      let newPerson = { fullName, stream, attendance };

      //if the paper doesn't exists in array yet, create one.
      var check_papers = attendanceArray.filter(
        (aPaper) => aPaper.paperName === `${paper}`
      );

      if (check_papers.length == 0) {
        attendanceArray.unshift({ paperName: `${paper}`, students: [] });
        streams.unshift({ paperName: `${paper}`, count: 1 });
      }

      //get index of current paper to add the student to
      let valIndex = attendanceArray.findIndex(
        (aPaper) => aPaper.paperName == `${paper}`
      );

      //check if student is already enrolled paper.
      var check_students = check_papers.filter(
        (aStudent) => aStudent.fullName == `${fullName}`
      );
      if (check_students.length == 0) {
         //if not enrolled add them
         attendanceArray[valIndex].students.splice(valIndex, 0, newPerson);
       }

      //add student to one other paper so can test screen display for large amounts of data
      valIndex++;
      if (valIndex == attendanceArray.length) {
        valIndex = 0;
      }
      //check to make sure they haven't been enrolled yets
      check_students = attendanceArray[valIndex].students.filter(
        (aStudent) => aStudent.fullName == `${fullName}`
      );
      if (check_students.length === 0) {
        //create a copy of the newPerson object - javascript being mutable and store references
        // so a new instance of the student needs to be created to add to a different role.
        let clonePerson = { fullName, stream, attendance };
        attendanceArray[valIndex].students.splice(valIndex, 0, clonePerson);
      }
    });

    //add some extra attendance data so the scroll bars can be tested and data calculations
    let targetLength = 16;
    attendanceArray.forEach((items) => {
      for (let i = 0; i < items.students.length; i++) {
        while (items.students[i].attendance.length < targetLength ){
          let y = Math.floor(Math.random() * checks.length);
          items.students[i].attendance.unshift(checks[y].key);
        }
      }
    });

    console.log(attendanceArray);

    //create a timeable to test form features - all papers with 2, 2 hour labs. First two subjects with 2 streams.
    let count = 0;
    let day = ['mon', 'tue', 'wed', 'thur', 'fri'];
    let time = ['8am-10am', '10am-12pm', '1pm-3pm', '3pm-5pm'];
    let day_count = -1;
    let time_count = 0;

    //helper functions
    function nextDay() {
      day_count++;
      if (day_count == day.length) {
        day_count = 0;
        nextTime();
      }
      return day_count;
    }

    function nextTime() {
      time_count++;
      if (time_count == time.length) {
        time_count = 0;
      }
    }

    //add extra stream count to first two papers in streams array
    //and change stream for half the students
    for (let i = 0; i <2; i++){
      streams[i].count = 2;

      let paperid = streams[i].paperName;
      attendanceArray.forEach((p)=>{
        if (p.paperName == paperid){
           let start = Math.round(p.students.length/2);
           for(let x = start; x < p.students.length; x++ ){
              p.students[x].stream = 'B';
           }
        }
      });
    }

   //create time table array
     for (let z = 0; z < attendanceArray.length; z++) {
        if (z < 2) {

       //create a B Stream in the time table array
        roomTimeTable[count++] = {
          paperName: attendanceArray[z].paperName,
          stream: 'B',
          lab: 1,
          day: day[nextDay([day_count])],
          time: time[time_count],
        };

        roomTimeTable[count++] = {
          paperName: attendanceArray[z].paperName,
          stream: 'B',
          lab: 2,
          day: day[nextDay([day_count])],
          time: time[time_count],
        };
        streams[z].count = 2;
        }//end B stream

      roomTimeTable[count++] = {
        paperName: attendanceArray[z].paperName,
        stream: 'A',
        lab: 1,
        day: day[nextDay([day_count])],
        time: time[time_count],
      };
      roomTimeTable[count++] = {
        paperName: attendanceArray[z].paperName,
        stream: 'A',
        lab: 2,
        day: day[nextDay([day_count])],
        time: time[time_count],
      };
    }
    console.log(roomTimeTable);
    console.log(streams);

    //Sort attendance array by paper name
    attendanceArray.sort(function(a, b) {
      var nameA = a.paperName.toUpperCase(); // ignore upper and lowercase
      var nameB = b.paperName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });

    //store arrays to local storage
    localStorage.setItem('timeTable', JSON.stringify(roomTimeTable));
    localStorage.setItem('classes', JSON.stringify(attendanceArray));
    localStorage.setItem('checks', JSON.stringify(checks));
    localStorage.setItem('streams', JSON.stringify(streams));
    sessionStorage.setItem('headCount', 0);
  })
  .catch((error) => {
    console.log(error);
  });

    //add data to auto fill drop down
    let c = localStorage.getItem('checks');
    c = JSON.parse(c);

    let autofill = document.getElementById('autofill');

    c.forEach((item)=>{
      if (item.key != 'n') {
        let opt = document.createElement('Option');
        opt.value = item.value;
        opt.innerHTML = item.key;
        autofill.appendChild(opt);
      }
    });
