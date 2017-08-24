// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBlU7IZ-8vPPzhupF-O22ZQOH2-6fHW3H0",
    authDomain: "whateveryouwant-e5825.firebaseapp.com",
    databaseURL: "https://whateveryouwant-e5825.firebaseio.com",
    projectId: "whateveryouwant-e5825",
    storageBucket: "whateveryouwant-e5825.appspot.com",
    messagingSenderId: "1076657705917"
  };
  firebase.initializeApp(config);



    // Initialize Firebase
    // var config = {
    //   apiKey: "AIzaSyAAwHR4lYkFRK_IB47-WGB5IpDmyICYV24",
    //   authDomain: "train-sch.firebaseapp.com",
    //   databaseURL: "https://train-sch.firebaseio.com",
    //   projectId: "train-sch",
    //   storageBucket: "",
    //   messagingSenderId: "293811738708"
    // };
    // firebase.initializeApp(config);



var database = firebase.database();

var trainName;
var destination
var firstTrainTime
var frequency

$("#run-submit").click(function() {
  event.preventDefault();
  trainName = $("#train-name").val().trim();
  console.log("The train name is " + trainName);
  destination = $("#destination").val().trim();
  firstTrainTime = $("#first-train-time").val().trim();
  frequency = $("#frequency").val().trim();
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
  })

  var user = {
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
  }

  console.log(user)
  //console.log(user)
})

function isEmptyOrSpaces(str){
  return !str || str.match(/^ *$/) !== null;
}

  database.ref().on("child_added", function(childSnapshot) {

      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val());
      var trainName = childSnapshot.val().trainName;
      var destination = childSnapshot.val().destination;
      var firstTrainTime = childSnapshot.val().firstTrainTime;
      var frequency = childSnapshot.val().frequency;
      if(isEmptyOrSpaces(trainName)
        || isEmptyOrSpaces(destination)
        || isEmptyOrSpaces(firstTrainTime)
        || isEmptyOrSpaces(frequency)){
          return;
        }

      var nextArrival;
      var firstTrainTime1 = moment().set({'hour': firstTrainTime.split(':')[0], 'minute':firstTrainTime.split(':')[1]});;
      console.log(firstTrainTime1)
      function nextArrival1(){
        if (moment() > moment(firstTrainTime1)){
          firstTrainTime1 = moment(firstTrainTime1).add(frequency, 'minute');
          nextArrival1()
          console.log(firstTrainTime1)
        } else{
          nextArrival = firstTrainTime1
        }
      }

    nextArrival1();
    console.log(nextArrival)
    minutesAway = moment.duration(nextArrival.diff(moment())).asMinutes()
    $("#employee-table > tbody").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + nextArrival.format('hh:mm') + "</td><td>" + Math.floor(minutesAway + 1));
  }, function(errorObject){
    console.log("Errors handled: " + errorObject.code);
  });
