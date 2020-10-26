/*
Adds event listeners to hightlight form item (including custom inputs and tool tips) which is currently infocus
*/

//add focus and blur event handlers to input fields, tabs and custom check boxes for accessability.  
let box = document.getElementsByClassName("checkmark");
for (i = 0; i < box.length; i++) {
    box[i].addEventListener('focus', (e) => {
        e.target.parentElement.style.border = "1px solid #202223";
        e.target.parentElement.parentElement.style.outline = "3px dotted blue";
    });

    box[i].addEventListener('blur', (e) => {
        e.target.parentElement.style.border = "1px solid #ccc";
        e.target.parentElement.parentElement.style.outline = "";
    });
}

//input fields change of focus
 let inputFields = document.getElementsByClassName("rowInput");
 for(a=0; a < inputFields.length; a++){
     inputFields[a].addEventListener('focus', (e)=>{
       e.target.parentElement.style.outline= "3px dotted blue";
    });

    inputFields[a].addEventListener('blur', (e)=>{
        e.target.parentElement.style.outline = "";
     });
  } 

    //tabs open on enter
  let tabs = document.getElementsByClassName("tabLabel");
  for(b=0; b < tabs.length; b++){
      tabs[b].addEventListener('focus', (e)=>{
        e.target.style.outline = "3px dotted blue";
     });
 
     tabs[b].addEventListener('blur', (e)=>{
         e.target.style.outline = "";
      });
   } 

   //button on focus
   let subButtons = document.getElementsByClassName("allCheck");
   for(b=0; b < subButtons.length; b++){
    subButtons[b].addEventListener('focus', (e)=>{
         e.target.style.outline = "3px dotted blue";
      });
  
      subButtons[b].addEventListener('blur', (e)=>{
          e.target.style.outline = "";
       });
    } 

    //tool tips - in focus
    let tooltipitems = document.getElementsByClassName("tooltip");
    for(c=0; c < tooltipitems .length; c++){
        tooltipitems [c].addEventListener('focus', (e)=>{
             e.target.style.outline = "3px dotted blue";
             e.target.querySelector("span").style.visiblity = "visable";
             e.target.querySelector("span").style.opacity = "1";
          });
      
          tooltipitems [c].addEventListener('blur', (e)=>{
              e.target.style.outline = "";
              e.target.querySelector("span").style.visiblity = "hidden";
              e.target.querySelector("span").style.opacity = "0";
              //close tool tips
           });
        } 
