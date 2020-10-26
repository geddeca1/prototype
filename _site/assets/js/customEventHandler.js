/*
Add event handlers for Custom check boxs,tabs, keyboard accessability and focus. 

On check of check box - validate user input using HTML5 set attributes.
 
Set AT attributes so custom items are on accessability tree
Form button click to check state of form/s
 - check if all current tab items checked
 - check what other tabs need to be checked
 - if all forms are checked, allow final confirmaiton.
*/

function toggleCheckbox(item) {
    //get position of checked item if added
    let itemId = item.id.substr(0, 2).trim();
    let list = document.querySelectorAll(`[id^="${itemId}"][class="checkmark"]`);
    let pos = -1;
    //get position of checked item if added, validate input
    for (x = 0; x < list.length; x++) {
        if (list[x] == item) {
            pos = x;
            let inputid = item.id.substring(0, item.id.indexOf('C'));
            var inpObj = document.getElementById(inputid);
            
            //check for invalid rules of 
            if (!(inpObj == null) &&!validateInput(inpObj)) {
                return;
            }
        }
    }

    //update class list     
    let isChecked = item.classList.contains('is-checked');
    item.classList.toggle('is-checked', !isChecked);
    //update AT
    item.setAttribute('aria-checked', !isChecked);

    //get position of checked item if removed
    list = document.querySelectorAll(`[id^="${itemId}"][class="checkmark"]`);
    if (pos == -1) {
        for (x = 0; x < list.length; x++) {
            if (list[x] == item) pos = x;
        }
    }
    //set focus to next item in list, if all checked - set focus to button
    if (list.length > 0) {
        if (pos == list.length) pos = 0;
        document.getElementById(`${list[pos].id}`).focus();
    } else {
        //all fields filled in 
        document.getElementById(`${itemId}allCheck`).focus();
    }
}

//add events to input change to update checkbox if input is edited. 
let inputs = document.getElementsByClassName("rowInput");
for ( z=0; z<inputs.length; z++){
    inputs[z].addEventListener('change', (e)=>{    
      let itsCheckBox = e.target.nextElementSibling.firstElementChild;
           if (itsCheckBox.classList.contains('is-checked')){
            itsCheckBox.classList.remove('is-checked');
           }
       });
}    


//add events to check box for keyboard accessability
let checkboxes = document.getElementsByClassName("checkmark");
for (i = 0; i < checkboxes.length; i++) {
    addEvents(checkboxes[i]);
}

function addEvents(item) {
    item.addEventListener('click', () => {
        toggleCheckbox(item);
    }); // end on click event handler

    item.addEventListener("keypress", (e) => {
        let isEnter = e.keyCode === 13;
        if (isEnter) {
            toggleCheckbox(item);
        }
    });
}//end function AddEvents

//add events for tab access and changing AT tree
let lbs = document.getElementsByClassName("tabLabel");
for (x = 0; x < lbs.length; x++) {

    lbs[x].addEventListener('click', (e) => {
        //update AT
        e.target.setAttribute("aria-selected", true);
        e.target.click();
    }); // end on click event handler


    //enter key press    
    lbs[x].addEventListener("keypress", (e) => {
        let isEnter = e.keyCode === 13;
        if (isEnter) {
            //update AT
            e.target.setAttribute("aria-selected", true);
            e.target.click();
        }
    });
}

//add event handler for Form button click (Checked)
let checkButtons = document.getElementsByClassName("allCheck");
for (y = 0; y < checkButtons.length; y++) {
    checkButtons[y].addEventListener('click', (e) => {
        //check all forms buttons have been checked. 
        let formID = e.target.id.substr(0, 2).trim();
        let formChecks = document.querySelectorAll(`[id^="${formID}"][class="checkmark"]`);
        let finFlag = true;
        if (formChecks.length == 0) {
            let msg = "All fields on this tab checked ";
            //list of forms yet to be checked
            let all = document.getElementsByClassName("contactDetails");
            for (c = 0; c < all.length; c++) {
                let x = all[c].id;
                let tabID = "tab-" + x.substr(1);
                let name = document.getElementById(tabID);
                let y = document.querySelectorAll(`[id^="${x}"][class="checkmark"]`);
                if (y.length != 0) {
                    msg += "\r\n - " + name.innerHTML + " still needs to be checked";
                    if (finFlag) {
                        let nexttab = name.getAttribute("for");
                        document.getElementById(nexttab).checked =true;
                        name.focus();
                        finFlag = false;
                    }
                }
            }
            if (finFlag) {
                let result = confirm("All details have been checked. If all information\r\n is true and correct click OK.")
                if (result) {
                    alert("This is where information would be written back, and form closed with a mighty big thank you");
                } else {
                    return;
                }
            } else {
                alert(msg);
            }

        } else {
            alert("Please check all fields.\r\n " + formChecks.length +
                " fields on this tab have yet to be checked.")
        }
    });
}


/*
https://www.w3.org/TR/wai-aria-practices-1.1/#tooltip

"A tooltip is a popup that displays information related to an 
element when the element receives keyboard focus, it typically  disappears when Escape is pressed" 
*/
let tips = document.getElementsByClassName("tooltip");
for (z = 0; z < tips.length; z++) {

    tips[z].addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            e.target.querySelector("span").style.visiblity = "hidden";
            e.target.querySelector("span").style.opacity = "0";
        }
    });
}









