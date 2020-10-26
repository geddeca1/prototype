let btn = document.getElementById('commitData');

btn.addEventListener('keypress', (e) => {
  if (e.key === 13) {
    e.target.click();
  }
});

btn.addEventListener('click', () => {
  save();
  clearHeadCount();
  document.getElementById("rightPanel").style.display="none";
});

function save() {
  //array to update
  let a = localStorage.getItem('classes');
  a = JSON.parse(a);

  //stream data to check against
  let stream = document.getElementById('streamid');
  let selectedStream = stream[stream.selectedIndex].value;

  //paper to update
  let paper = document.getElementById('paperid');
  let paperSelected = paper[paper.selectedIndex].value;

  //variables to find correct array location to update
  let selectedWeek = document.getElementById('weekid').selectedIndex + 1;
  let lab = document.getElementById('labid');
  let selectedLab = lab[lab.selectedIndex].value;

  //find correct array location to update
  let arrayLoc = 2 * selectedWeek - 2;
  if (selectedLab == '2') {
    arrayLoc += 1;
  }

  //update from
  let taggedSelect = document.getElementsByClassName('setMarks');

  //update attendance array for each student doing paper
  a.forEach((papers) => {
    if (papers.paperName === paperSelected) {
      papers.students.forEach((student) => {
        //get index value of current student to get the correct select element
        let x = papers.students.findIndex(
          (aStudent) => aStudent.fullName == `${student.fullName}`
        );

        //get the students select box value for attendance
        let val = taggedSelect[x][taggedSelect[x].selectedIndex].innerText;

        if (student.attendance[arrayLoc] === undefined) {
          // undefined - new entry.
          if (student.stream !== selectedStream && val == 'p') {
            val = 'n';
          }
          //check stream, if not students steam change p to n
          student.attendance.push(val);

        } else {
          //if defined - assuming an edit.
          if (val == "p" && student.stream !== selectedStream) val = "n";
          student.attendance[arrayLoc] = val;
        }
      });
    }
  });
 
  //update array in local storage
  localStorage.setItem('classes', JSON.stringify(a));
  console.log(a);
  //clear page
  popPage();
}
