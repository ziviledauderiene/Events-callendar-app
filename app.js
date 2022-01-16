// Testiniai renginiai.
var test0 = '{"eventTitle": "Test Meeting1", "eventDate": "2022-01-05", "eventStartTime": "09:00", "eventEndTime": "10:00","eventType": "Meeting", "eventDescription": ""}';
var test1 = '{"eventTitle": "Test Meeting2", "eventDate": "2022-01-25", "eventStartTime": "09:00", "eventEndTime": "10:00","eventType": "Meeting", "eventDescription": ""}';
var test2 = '{"eventTitle": "Test Call1", "eventDate": "2022-01-15", "eventStartTime": "09:00", "eventEndTime": "10:00","eventType": "Call", "eventDescription": ""}';
var test3 = '{"eventTitle": "Test Call2", "eventDate": "2022-01-15", "eventStartTime": "19:00", "eventEndTime": "20:00","eventType": "Call", "eventDescription": ""}';
var test4 = '{"eventTitle": "Test Out of office", "eventDate": "2022-01-15", "eventStartTime": "06:00", "eventEndTime": "08:00","eventType": "Out of office", "eventDescription": ""}';

//Išsaugom juos sessionStorage
sessionStorage.clear();
sessionStorage.setItem("Test Meeting1", test0);
sessionStorage.setItem("Test Meeting2", test1);
sessionStorage.setItem("Test Call1", test2);
sessionStorage.setItem("Test Call2", test3);
sessionStorage.setItem("Test Out of office", test4);


//paimam išsaugotus renginius pagal indeksą ir įrašom į kalendorių
for (let i = 0; i < sessionStorage.length; i++) {
    
    var e = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));

    //Pagal renginio type bus priskirta klasė ir jo spalva.
    if (e.eventType == "Meeting") {
        document.getElementById(e.eventDate).innerHTML += '<p class="meeting" onclick="displayDetails(); reply_click(this.id)" id="' + e.eventTitle + '">' + e.eventTitle + "</p>";
    }
    if (e.eventType == "Call") {
        document.getElementById(e.eventDate).innerHTML += '<p class="call" onclick="displayDetails(); reply_click(this.id)" id="' + e.eventTitle + '">' + e.eventTitle + "</p>";
    }
    else if (e.eventType == "Out of office") {
        document.getElementById(e.eventDate).innerHTML += '<p class="out-of-office" onclick="displayDetails(); reply_click(this.id)" id="' + e.eventTitle + '">' + e.eventTitle + "</p>";
    }   
}


//pagal paspausto renginio id įrašom info apie tą renginį į details dalį.
function reply_click(clicked_id) {

    clickedEventId = clicked_id;
    clickedEvent = JSON.parse(sessionStorage.getItem(clickedEventId));

    document.getElementById("details-event-title").innerHTML = clickedEvent.eventTitle;
    document.getElementById("details-event-date").innerHTML = clickedEvent.eventDate;
    document.getElementById("details-start-time").innerHTML = clickedEvent.eventStartTime;
    document.getElementById("details-end-time").innerHTML = clickedEvent.eventEndTime;
    document.getElementById("details-event-type").innerHTML = clickedEvent.eventType;
    document.getElementById("details-event-description").innerHTML = clickedEvent.eventDescription;
}

//parodo details dalį, kai paspaudžiam ant renginio. kai paspaudžiam dar kartą - vėl rodo create.
function displayDetails() {
  
    var x = document.getElementById("create");
    var y = document.getElementById("details");

    if (x.style.display === "none") {
        x.style.display = "flex";
        y.style.display = "none";
    }
    else {
        x.style.display = "none";
        y.style.display = "flex"; 
    }
}

function deleteEvent() {

    sessionStorage.removeItem(clickedEventId);
    document.getElementById(clickedEventId).remove();
    displayDetails();
    alert('The event "' + clickedEvent.eventTitle + '" (' + clickedEvent.eventDate + ') was deleted.');
}


//Pridedinėjam renginius
function addEvent() {

    var title = document.getElementById("event-title").value;
    var date = document.getElementById("event-date").value;
    var startTime = document.getElementById("start-time").value;
    var endTime = document.getElementById("end-time").value;
    var type = document.getElementById("event-type").value;
    var description = document.getElementById("event-description").value;
    
    //tikrinam, ar visi laukeliai užpildyti. Type netikrinu, nes neįmanoma, kad jis būtų tuščias.
    if (title == "" || date == "" || startTime == "" || endTime == "" ) {
        alert("All fields must be filled out");
        return false;
    }
    else {
        //patikrinam, ar nėra tokio paties pavadinimo
        for (let a = 0; a < sessionStorage.length; a++) {
            var checkE = JSON.parse(sessionStorage.getItem(sessionStorage.key(a)));
            if (title == checkE.eventTitle) {
                alert("You already have an event with this title. Please choose a different one.");
                return false;
            }
        }
        
        //tikrinam, ar endTime parinktas vėlesnis nei startTime.
        if (endTime <= startTime) {
            alert("Please choose the correct time. Your chosen End Time is greater than the Start Time.");
            return false;
        }

        //jeigu viskas gerai
        else {
                        
            var addedEvent = {"eventTitle": title, "eventDate": date, "eventStartTime": startTime, "eventEndTime": endTime, "eventType": type, "eventDescription": description};

            sessionStorage.setItem(addedEvent.eventTitle, JSON.stringify(addedEvent));
            var addedE = JSON.parse(sessionStorage.getItem(addedEvent.eventTitle));

            //Pagal renginio type bus priskirta klasė ir jo spalva.
            if (addedE.eventType == "Meeting") {
                document.getElementById(addedE.eventDate).innerHTML += '<p class="meeting" onclick="displayDetails(); reply_click(this.id)" id="' + addedE.eventTitle + '">' + addedE.eventTitle + "</p>";              
            }
            if (addedE.eventType == "Call") {
                document.getElementById(addedE.eventDate).innerHTML += '<p class="call" onclick="displayDetails(); reply_click(this.id)" id="' + addedE.eventTitle + '">' + addedE.eventTitle + "</p>";
            }
            else if (addedE.eventType == "Out of office") {
                document.getElementById(addedE.eventDate).innerHTML += '<p class="out-of-office" onclick="displayDetails(); reply_click(this.id)" id="' + addedE.eventTitle + '">' + addedE.eventTitle + "</p>";
            }
        }
    }
}


//  Ką dar būtų galima patobulinti:
//  - renginius dėlioti pagal laiką. Kuris ankstesnis tas langelyje aukščiau rodomas.
//  - kad būtų galima įvesti vienodus pavadinimus ???
//  - gražesnį perėjimą create-display, kad ne du kartus spaudinėt. 