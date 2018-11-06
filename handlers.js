	var trashImg = '<img src="/img/delete.png" onclick="handle_change_of_task(this)" title="Delete Task" height="25" width="25" align="right" hspace="10">'
	var updateImg  = '<img src="/img/update.png" onclick="handle_change_of_task(this)" title="Update Task" height="25" width="25" align="right" hspace="10">'
	var completeImg = '<img src = "/img/completed.png" onclick="handle_change_of_task(this)" title="Complete Task" height="25" width="25" align="right" hspace="10">'

    let myHeaders = new Headers(); 
    myHeaders.append('Accept', 'application/json');       // This one is enough for GET requests
    myHeaders.append('Content-Type', 'application/json'); // This one sends body
    myHeaders.append('Access-Control-Allow-Origin', '*'); // Resolves flask cors issue
	
	//////////////////////////////////////////////////////////////////////////////////////////
	function decodeHtmlStr(htmlStr) {    // Clever venue to decode any HTML Special Entities
       var text = document.createElement("textarea");
       text.innerHTML = htmlStr;
       return text.value;
    }

	//////////////////////////////////////////////////////////////////////////////////////////
	function initiate_list() { 							// fetches all task items from the database and loads them into list items (LI) objects
	
	   var ul = document.getElementById('myList');
	   
	  fetch('/todo/read', { method: 'GET', mode: 'cors', header: myHeaders })
      .then(function(res) {return res.json()})
      .then(function(data){
	  
	     var jsonstring = JSON.stringify(data);
	     var jsonobject = JSON.parse(jsonstring);

         for (var i = 0; i < jsonobject.data.length; i++) {
	       var listItem = document.createElement("li");
	       listItem.innerHTML=listItem.innerHTML + jsonobject.data[i].description + trashImg + updateImg + completeImg // generates text and image buttons
	       ul.appendChild(listItem);
         }
      })
	  .catch((err)=>console.log(err))   
		  
	} // initiate_list()
	
	//////////////////////////////////////////////////////////////////////////////////////////
	function new_task() {  							// creates a new task item (LI) object in the application and also adds it to the database
	
	 var taskItem = document.getElementById("myInput").value;	
	 if (taskItem.length > 0) {
	 
	   var ul = document.getElementById('myList')
	   var listItem = document.createElement("li");
	   listItem.innerHTML=listItem.innerHTML + taskItem + trashImg + updateImg + completeImg
	   ul.appendChild(listItem);
	   
	   fetch('/todo/create', {
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
                header: myHeaders,
	            body: JSON.stringify({taskitem: taskItem})
       })
       .then(function(res) { return res.text(); })
       .then(function(data) { console.log(data)})

      } 
	   document.getElementById("myInput").value = ""; 
	     
	} // new_task()

	//////////////////////////////////////////////////////////////////////////////////////////
	function handle_change_of_task(img) {
	
	 var imgTitle = img.title;
	 var listItem = img.parentNode;
     var ul = listItem.parentNode;
     var str = listItem.innerHTML;
	 var cleanTaskItem = decodeHtmlStr(str.substr(0, str.indexOf('<')));
     
	 if (imgTitle == "Delete Task") {   // User used the Delete Task button
       if (confirm("Are you sure you want to Delete the Task?")) {
	   
         ul.removeChild(listItem); //Remove the parent li item

         fetch('/todo/delete', {
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
                header: myHeaders,
		        body: JSON.stringify({taskitem: cleanTaskItem})
         })
         .then(function(res) { return res.text(); })
         .then(function(data) { console.log(data)})

       } 
	 }
	 else if (imgTitle == "Update Task") {   // User used the Update Task button
          
        var newTaskDescription=prompt("Please Enter Your New Task Description",cleanTaskItem);
		// Present the new Task Description in the client
        if (newTaskDescription && newTaskDescription.length > 0) {
              
           listItem.innerHTML = newTaskDescription + trashImg + updateImg + completeImg
           fetch('/todo/update', {
                   method: 'POST',
                   mode: 'cors',
                   redirect: 'follow',
                   header: myHeaders,
	               body: JSON.stringify({oldtaskitem: cleanTaskItem, newtaskitem: newTaskDescription})
           })
           .then(function(res) { return res.text(); })
           .then(function(data) { console.log( data )})
        }
     }
     else if (imgTitle == "Complete Task") {    // User used the Complete Task button to mark the completion of the task
	   if (!(cleanTaskItem.indexOf("(COMPLETED)") >-1 )) { // Verify and act only if task hasn't been marked as COMPLETED yet
	     if (confirm("Are you sure you want to Mark the Task as Completed?")) {
		 
		   var completedTask = cleanTaskItem + " - (COMPLETED)"
	       listItem.innerHTML = completedTask + trashImg + updateImg + completeImg
		   
		   fetch('/todo/update', {
                   method: 'POST',
                   mode: 'cors',
                   redirect: 'follow',
                   header: myHeaders,
	               body: JSON.stringify({oldtaskitem: cleanTaskItem, newtaskitem: completedTask })
           })
           .then(function(res) { return res.text(); })
           .then(function(data) { console.log( data )})
		   
	     }
	   }
     }
	} // handle_change_of_task()
	//////////////////////////////////////////////////////////////////////////////////////////
	