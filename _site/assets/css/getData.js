/*Fetch used to retrieve 3 records from randmuser API
and populate forms. 
*/ 

fetch('https://randomuser.me/api/?results=3')
  .then(response => response.json())
  .then(data => {
    var count = 0;
    data.forEach(obj => {
      console.log(obj);
     
   });
  })