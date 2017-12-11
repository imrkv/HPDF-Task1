var message_btn = document.getElementById('message_btn');
var msg=document.getElementById('message_text').value;
message_btn.onclick = function() {
	
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200 ){
              console.log("submitted Sucessfully");
              document.getElementById("inputbox").style.display="none";
              document.getElementById("responsebox").style.display="block";
              document.getElementById("msgbox").innerHTML="you have entered: "+msg;
            }
		  else{ 
              console.log('something went wrong with server');
            }
          
      }
    
    };
    //Make the request
    request.open('POST', 'http://localhost:8080/submit' ,true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({msg:msg}));
    
};
