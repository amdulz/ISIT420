
function Comic(pTitle, pPublisher, pRating) {
    this.title= pTitle;
    this.publisher = pPublisher;
    this.rating = pRating;
    
  }
  var ClientNotes = [];  // our local copy of the cloud data


document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("submit").addEventListener("click", function () {
        var tTitle = document.getElementById("title").value;
        var tPublisher = document.getElementById("publisher").value;
        var tRating = document.getElementById("rating").value;
        var oneComic = new Comic(tTitle, tPublisher, tRating);

        $.ajax({
            url: '/NewComic' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(oneComic),
            success: function (result) {
                console.log("added new comic")
            }

        });
    });

    document.getElementById("get").addEventListener("click", function () {
        updateList()
    });
  


    document.getElementById("delete").addEventListener("click", function () {
        
        var whichComic = document.getElementById('deleteTitle').value;
        var idToDelete = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].title === whichComic) {
                idToDelete = ClientNotes[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({  
                    url: 'DeleteComic/'+ idToDelete,
                    type: 'DELETE',  
                    contentType: 'application/json',  
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
        }
        else {
            console.log("no matching Subject");
        } 
    });



    document.getElementById("msubmit").addEventListener("click", function () {
        var tTitle = document.getElementById("mtitle").value;
        var tPublisher = document.getElementById("mpublisher").value;
        var tRating = document.getElementById("mrating").value;
        var oneComic = new Comic(tTitle, tPublisher, tRating);
    
        
            $.ajax({
                url: 'UpdateComic/'+idToFind,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(oneComic),
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
            
       
    });


    
    var idToFind = ""; // using the same value from the find operation for the modify
    // find one to modify
    document.getElementById("find").addEventListener("click", function () {
        var tTitle = document.getElementById("modTitle").value;
         idToFind = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].title === tTitle) {
                idToFind = ClientNotes[i]._id;
           }
        }
        console.log(idToFind);
 
        $.get("/FindComic/"+ idToFind, function(data, status){ 
            console.log(data[0].title);
            document.getElementById("mtitle").value = data[0].title;
            document.getElementById("mpublisher").value= data[0].publisher;
            document.getElementById("mrating").value = data[0].rating;
            
           

        });
    });

    // get the server data into the local array
    updateList();

});


function updateList() {
var ul = document.getElementById('listUl');
ul.innerHTML = "";  // clears existing list so we don't duplicate old ones

//var ul = document.createElement('ul')

$.get("/Comics", function(data, status){  // AJAX get
    ClientNotes = data;  // put the returned server json data into our local array

    // sort array by one property
    ClientNotes.sort(compare);  // see compare method below
    console.log(data);
    //listDiv.appendChild(ul);
    ClientNotes.forEach(ProcessOneComic); // build one li for each item in array
    function ProcessOneComic(item, index) {
        var li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML=li.innerHTML + index + ": " + " Rating: " + item.rating + "  " + item.title + ":  " + item.publisher;
    }
});
}

function compare(a,b) {
    if (a.completed == false && b.completed== true) {
        return -1;
    }
    if (a.completed == false && b.completed== true) {
        return 1;
    }
    return 0;
}
