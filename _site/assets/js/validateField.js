
/* 
Carries out client side validation. 
Takes an input field as an argument 
Returns true if validation check is successful, and false if its not. 
Uses HTML5 item.validity array set in formtemplate. 

 */

function validateInput(item) {
    //helper function to clear error message before rechecking new input
    function clearmessage(y) {
        let errorId = y.id + "Error";
        y.style.border = "";

        let it = document.getElementById(errorId);
        it.innerText = "";
    }

    /*helper function to display error message. Input arguments are the 
    input item to be checked and messge to be displayed. */
    function displaymessage(x, m) {
        let errorId = x.id + "Error";
        x.style.border = "1px solid red";

        let it = document.getElementById(errorId);
        it.innerText = m;
        x.focus();
    }

    let isValid = item.validity;
    clearmessage(item);

    //required fields check - excludes natitionaly and birth fields from next of kin forms.  
    if (isValid.valueMissing) {
        let formid = item.id.substr(0, 2)
        let tag = item.id.substr(2);

        if (!(formid == "f0") && (tag == "nationality" || tag == "birth")) {
            return true;
        } else {

            if (item.type == "date") {
                let msg = "Use the date picker to choose your birth date or type in date as dd-mm-yyyy";
                displaymessage(item, msg);
                return false;
            }
            let msg = "You need to enter a value here";
            displaymessage(item, msg);
            return false;
        }
    }

    //field too long
    else if (isValid.tooLong) {
        let msg = "The value you have entered is too long"
        displaymessage(item, msg);
        return false;
    }

    //field too long
    else if (isValid.tooShort) {
        let msg = "The value you have entered is too Short"
        displaymessage(item, msg);
        return false;
    }

    //data type not correct
    else if (isValid.typeMismatch) {
        console.log(item.type);
        if (item.type == "email") {
            let msg = "Please enter a valid email address";
            displaymessage(item, msg);
            return false;
        } else if (item.type == 'date') {
            let msg = "Use the date picker to choose your birth date or type in date as dd-mm-YYYY";
            displaymessage(item, msg);
            return false;
        }
    }
    return true;
} //end validation check
