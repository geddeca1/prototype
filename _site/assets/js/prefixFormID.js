/* 
Multiple form templates can be used on a single page. 
This adds a prefix to each id tag to identify which form it is associated with. 
It also adds prefix to aria-describedby tags, so correct tags are referenced in AT. 
*/

//get all forms in tab contents
var forms = document.getElementsByClassName('tab-content');
//for each form in collection, prefix id tags with value. 
 for(x=0; x < forms.length; x++){
    let pre = `f${x}`;
    //update id tags
    let ids = forms[x].querySelectorAll("[id]");
    for (a=0; a < ids.length; a++ ){
        ids[a].setAttribute("id", `${pre}${ids[a].id}` );
    }
    //update aria-describedby values as they reference ids
    let ariaTags = forms[x].querySelectorAll("[aria-describedby]");
    for (b=0; b < ariaTags.length; b++ ){
        let x = ariaTags[b].getAttribute("aria-describedby");
        ariaTags[b].setAttribute("aria-describedby", `${pre}${x}` );
    }
}


