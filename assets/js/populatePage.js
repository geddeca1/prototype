// eslint-disable-next-line no-unused-vars because it was telling lies
function popPage() {
  document.getElementById('weekid').didabled = true;
  document.getElementById('labid').didabled = true;
  document.getElementById('streamid').didabled = true;
  clearData();
  //remove inputs from screen
  document.getElementById('commitData').style.display = 'none';
  document.getElementById('autofill').style.display = 'none';

  //set up select menus
  let paperSelect = document.getElementById('paperid');

  let classes = localStorage.getItem('classes');
  classes = JSON.parse(classes);

  //populate papers
  classes.forEach((element) => {
    let optn = document.createElement('option');
    optn.innerText = element.paperName;
    optn.value = element.paperName;
    paperSelect.appendChild(optn);
  });
  //add eventlistener to paper select
  paperSelect.addEventListener('change', (e) => {
    setPaperDetails(e.target[e.target.selectedIndex].value);
    document.getElementById('weekid').didabled = false;
    document.getElementById('labid').didabled = false;
    document.getElementById('streamid').didabled = false;
  });

  setPaperDetails(paperSelect[paperSelect.selectedIndex].value);
} // end populate page

function setPaperDetails(p) {
  //clear current values
  document.getElementById('streamid').innerHTML = '';
  document.getElementById('labid').innerHTML = '';

  //get storage arrays to use
  let classes = localStorage.getItem('classes');
  classes = JSON.parse(classes);

  let s = localStorage.getItem('streams');
  s = JSON.parse(s);

  //Sub array of classes to read of selected paper for week select
  var r1 = classes.filter((obj) => {
    return obj.paperName === p;
  });

  //get select items to populate
  let weekSelect = document.getElementById('weekid');
  let streamSelect = document.getElementById('streamid');
  let labSelect = document.getElementById('labid');

  //week select - number input doesn't work in some browsers.
  let defaultWeek = Math.floor(r1[0].students[0].attendance.length / 2);
  weekSelect.innerHTML = '';
  let top = defaultWeek+2;
  for (let i = 1; i < top; i++) {
    let optn = document.createElement('option');
    optn.index = i;
    optn.innerText = i;
    weekSelect.appendChild(optn);
  }
  weekSelect.selectedIndex = defaultWeek;

  //stream select
  //sub array of streams for streamSelect
  var r2 = s.filter((obj) => {
    return obj.paperName === p;
  });

  let val = 'A';
  for (let x = 0; x < r2[0].count; x++) {
    let optn = document.createElement('option');
    optn.innerText = val;
    optn.value = val;
    val = String.fromCharCode(val.charCodeAt(0) + 1);
    streamSelect.appendChild(optn);
  }

  //lab select
  for (let x = 1; x < 3; x++) {
    let optn = document.createElement('option');
    optn.innerText = x;
    optn.value = x;
    labSelect.appendChild(optn);
  }
  //set to current lab
  if (r1[0].students[0].attendance.length % 2 == 0) {
    labSelect.selectedIndex = 0;
  } else {
    labSelect.selectedIndex = 1;
  }
}

function clearData() {
  document.getElementById('studentsDetails').innerHTML = '';
  document.getElementById('studentsAttendance').innerHTML = '';
  document.getElementById('paperid').innerHTML = '';
  document.getElementById('weekid').innerHTML = '';
} //end clearData

function getData() {
  document.getElementById('weekid').disabled = false;
  document.getElementById('labid').disabled = false;
  document.getElementById('streamid').disabled = false;
  let details = document.getElementById('studentsDetails');
  let att = document.getElementById('studentsAttendance');
  details.innerHTML = '';
  att.innerHTML = '';

  let classes = localStorage.getItem('classes');
  classes = JSON.parse(classes);

  let p = document.getElementById('paperid').value;

  var result = classes.filter((obj) => {
    return obj.paperName === p;
  });
  // set grid column template for student attendance
  let num = result[0].students[0].attendance.length;
  document.getElementById(
    'studentsAttendance'
  ).style.gridTemplateColumns = `repeat(${num}, 20px)`;

  //set grid row template for student attendance
  let n = result[0].students.length;
  document.getElementById(
    'studentsAttendance'
  ).style.gridTemplateRows = `repeat(${n}, 2.5rem)`;

  let checks = localStorage.getItem('checks');
  checks = JSON.parse(checks);

  let bkColour = '#ffffff';
 
  result[0].students.forEach((student) => {
    /*
     Calculation of attendance percentages
      Attendance weights:
      late, present, explained , attended out of stream
      I have included as postive attendances.
    */
    let x = 0;
    if (bkColour === '#ffffff') {
      bkColour = '#E6e6e6';
    } else bkColour = '#ffffff';

    let count = 1;
    student.attendance.forEach((mark) => {
      let mk = document.createElement('label');
      mk.style.background = bkColour;
      if (count++%2 == 0){
        mk.style.borderRight= "solid black .5px";
      }
      mk.classList.add('marks');
      if (mark == 'p' || mark == 'l' || mark == 'e' || mark == 'n') {
        x++;
      }
      if (mark == 'n') mark = 'p*';
      if (mark == '-') mk.style.background = '#fccccc';
      mk.innerText = mark;
      att.appendChild(mk);
    });

    let percentage = Math.round((x / student.attendance.length) * 100);
    let perc = document.createElement('Label');
    if (percentage < 50){
      perc.style.backgroundColor = "red";
    }else if( percentage < 80 ){
      perc.style.backgroundColor = "orange";
    }
    perc.innerText = percentage + '%';
    perc.classList.add('percent');
    details.appendChild(perc);

    let st = document.createElement('label');
    st.classList.add('st');
    st.innerText = student.stream;
    st.value = student.stream;
    details.appendChild(st);

    let optn = document.createElement('label');
    optn.classList.add('fullName');
    optn.innerText = student.fullName;
    optn.value = student.fullName;
    details.appendChild(optn);

    let box = document.createElement('Select');
    box.classList.add('setMarks');
    checks.forEach((item) => {
      if (item.key !== 'n') {
        let o = document.createElement('Option');
        o.innerText = item.key;
        o.value = item.value;
        box.appendChild(o);
      }
    });

    //onchange event to update headCount when individual values changed
    box.addEventListener('change',()=>{
     resetHeadCount();
    });
    details.appendChild(box);
  });
}

//helper function to sort class lists by last name
function sortByLastName(a, b) {
  let lastNameA = a.fullName.substring(a.fullName.indexOf(' ')).trim();
  let lastNameB = b.fullName.substring(b.fullName.indexOf(' ')).trim();
  if (lastNameA < lastNameB) return -1;
  if (lastNameA > lastNameB) return 1;
  return 0;
}

document.getElementById('fetchDetails').addEventListener('click', () => {

  //fetching new data so clear student attedendance data and role data
  document.getElementsByTagName('studentsAttendance').innerHTML = '';
  document.getElementsByTagName('studentDetails').innerHTML = '';

  //allow commit
  document.getElementById('commitData').style.display = 'inline-block';
  //no autofill
  document.getElementById('autofill').style.display = "inline-block";

  //By using selected values, inform user if its an edit old role or new role based on select boxes
  let p = document.getElementById('paperid').value;
  let week = document.getElementById('weekid').selectedIndex;
  let lb = document.getElementById('labid').selectedIndex;
  let st = document.getElementById('streamid');
  let taggedSelect = document.getElementsByClassName('setMarks');

  //check to make sure all selects are populated before running
  //sometimes API doesn't load so this is a dbl check
  if (
    week === -1 ||
    lb == -1 ||
    st == -1 ||
   p === ""
  ){
    return;
  }
  document.getElementById("rightPanel").style.display = "grid";
  //Defaults to new role.
  let classes = localStorage.getItem('classes');
  classes = JSON.parse(classes);

  let tt = localStorage.getItem('timeTable');
  tt = JSON.parse(tt);

  //Sort data to display by stream, then alpha on last name
  classes.forEach((paper) => {
    if (paper.paperName == p) {
      //filter into separate streams
      var streamA = paper.students.filter((obj) => {
        return obj.stream === 'A';
      });

      streamA.sort(function (a, b) {
        return sortByLastName(a, b);
      });

      var streamB = paper.students.filter((obj) => {
        return obj.stream === 'B';
      });

      streamB.sort(function (a, b) {
        return sortByLastName(a, b);
      });

      if (st[st.selectedIndex].value == 'A') {
        paper.students = streamA.concat(streamB);
      } else {
        paper.students = streamB.concat(streamA);
      }
    }
    localStorage.setItem('classes', JSON.stringify(classes));
  });

  //populate screen with data using drop down values.
  getData();

  var r = classes.filter((obj) => {
    return obj.paperName === p;
  });

  var lesson = tt.filter((obj) => {
    return (
      obj.paperName === p &&
      obj.lab === lb + 1 &&
      obj.stream === st[st.selectedIndex].value
    );
  });

  let lessonP = lesson[0].paperName;
  let lessonTime = lesson[0].day + ' ' + lesson[0].time;
  let lessonDets =
    'wk: ' +
    document.getElementById('weekid')[week].value +
    ', lab: ' +
    lesson[0].lab;

  //compare request based on array position
  let len = r[0].students[0].attendance.length;
  let request = week * 2 + lb;

  let heading1 = document.getElementById('details1');
  let heading2 = document.getElementById('details2');
  let heading3 = document.getElementById('details3');
  let autofill = document.getElementById('autofill');

  if (len < request) {
    //trigger modal
    let msgbox = document.getElementById('myModal');
    msgbox.style.display = 'block';
  } else if (len == request) {
    heading1.innerHTML = 'Todays roll: ' + lessonP;
    heading2.innerHTML = lessonTime;
    heading3.innerHTML = lessonDets;
    //on change, set all selects

    autofill.addEventListener('change', (e) => {
      let value = e.target.selectedIndex;
      for (let i = 0; i < taggedSelect.length; i++) {
        taggedSelect[i].selectedIndex = value;   
      }
      resetHeadCount();
    });

  } else if (len > request) {
    heading1.innerHTML = 'Editing roll: ' + lessonP;
    heading2.innerHTML = lessonTime;
    heading3.innerHTML = lessonDets;
    //fetch old roles attendance records and populate select drop downs
    r[0].students.forEach((student) => {
      //get index value of current student to get the correct select element
      let x = r[0].students.findIndex(
        (aStudent) => aStudent.fullName == `${student.fullName}`
      );
      let val = taggedSelect[x].getElementsByTagName('option');

      for (let i = 0; i < val.length; i++) {
        
        if (student.attendance[request] == val[i].innerHTML) {
          taggedSelect[x].selectedIndex = val[i].index;
          //high light if 'yet to be filled in'
          if (student.attendance[request] == '-') {
            taggedSelect[x].style.background = '#fccccc';
          }
        }
      }
    });
  }
  resetHeadCount();
});

//event handler - fetch on enter
let fetchBtn = document.getElementById('fetchDetails');

fetchBtn.addEventListener('keypress', (e) => {
  if (e.key === 13) {
    e.target.click();
  }
});

//event handler for closing modal
document.getElementById('close').addEventListener('click', (e) => {
  e.target.parentNode.parentNode.style.display = 'none';
  clearHeadCount();
});


function resetHeadCount(){
  let collectionVals = document.getElementsByClassName('setMarks');
  let count = 0;
  for (let x = 0; x < collectionVals.length; x++){
    let item = collectionVals[x];
    if (item.selectedIndex == 0 || item.selectedIndex == 1 ){
      count++;
    }
  }
  sessionStorage.setItem('headCount', count);
  document.getElementById('hcDetails').innerHTML= "Head count: "+ count;
}

function clearHeadCount(){
  sessionStorage.setItem('headCount',0);
  document.getElementById('hcDetails').innerHTML= "Head count: "+ 0;
}
