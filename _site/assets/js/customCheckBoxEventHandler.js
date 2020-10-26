// Custom check box needs event handlers added to manage click
// enter and space toggle for access.  

function toggleCheckbox(item) {
    let isChecked = item.classList.contains('is-checked');
    item.classList.toggle('is-checked', !isChecked);

    // set focus to next un-checked item on page
    let list = document.getElementsByClassName("checkmark");
    let unchecked= document.getElementsByClassName("is-checked");
  
    let next = -1;
    if (list.length > unchecked.length){
        for(a=0; a < list.length; a++){
            if (list[a] == item){
                next = a;
                while (list[next].classList.contains("is-checked")){
                    next++;
                    if (next == list.length){
                        next = 0;
                    } 
                }
                //  console.log('Next item ' + list[next].id);
                document.getElementById(`${list[next].id}`).focus();
                
            }
            if (next != -1){
                return;
            }
        }
    }
}

let checkboxes = document.getElementsByClassName("checkmark");
for(i=0; i < checkboxes.length; i++){
    addEvents(checkboxes[i]);
}  

function addEvents(item) {
    item.addEventListener('click', () => {
        toggleCheckbox(item);
    }); // end on click event handler

    item.addEventListener("keypress", (e) => {
        let isEnter= e.keyCode === 13;
        if (isEnter) {
            toggleCheckbox(item);
        }
    });
}//end function AddEvents









