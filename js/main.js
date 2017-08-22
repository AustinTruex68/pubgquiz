// used to jQuery, thanks for this snippet!
var $ = function(id) {
    return document.getElementById(id);
}

$('startQuiz').onclick = function() {
    $('startQuiz').style.display = "none";
    $('submitQuiz').style.display = "inline";
    $('startingMessage').innerHTML = "You have started!";

    var object;
    //grab the quiz data from the json file
    function loadJSON(path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Here the callback gets implemented
                    object = JSON.parse(xhr.responseText);
                    callback();
                } else {

                }
            }
        };
        xhr.open("GET", path, true);
        xhr.send();
        return xhr.onreadystatechange();
    }

    //inject the questions based off the json file
    var html = "<hr>";
    loadJSON('assets/quizData.json', function printJSONObject() {
        for (key in object) {
            html += "<h4>" + object[key].questionNum + "</h4>";
            html += "<h5>" + object[key].question + "</h5>";
            if (object[key].questionType === "multipleChoice") {
                html += "<div class='radio'>";
                html += '<label><input type="radio" required name="' + key + '" value="answer1">' + object[key].answer1 + '</label>';
                html += "</div>";
                html += "<div class='radio'>";
                html += '<label><input type="radio" required name="' + key + '" value="answer2">' + object[key].answer2 + '</label>';
                html += "</div>";
                html += "<div class='radio'>";
                html += '<label><input type="radio" required name="' + key + '" value="answer3">' + object[key].answer3 + '</label>';
                html += "</div>";
                html += "<div class='radio'>";
                html += '<label><input type="radio" required name="' + key + '" value="answer4">' + object[key].answer4 + '</label>';
                html += "</div><br><hr>";
            } else if (object[key].questionType === "truefalse") {
                html += "<div class='radio'>";
                html += '<label><input type="radio" required name="' + key + '" value="answer1">' + object[key].answer1 + '</label>';
                html += "</div>";
                html += "<div class='radio'>";
                html += '<label><input type="radio" required name="' + key + '" value="answer2">' + object[key].answer2 + '</label>';
                html += "</div><br><hr>";
            } else if (object[key].questionType === "fillin") {
                html += '<input type="text" required class="form-control" name="' + key + '"><br><hr>'
            }
        }

        $("questionHolder").innerHTML = html;

        $('quizForm').onsubmit = function(e) {
            var correctAnswers = [];
            var selectedAnswers = [];
            e.preventDefault();
            //populate correct answers
            for (key in object) {
                correctAnswers.push(object[key].correctAnswer);
            }

            for (var x = 0; x < correctAnswers.length; x++) {
                var answerOptions = document.getElementsByName("question" + x);
                var selectedAnswer;
                for (var i = 0; i < answerOptions.length; i++) {
                    if (answerOptions[i].checked) {
                        selectedAnswer = answerOptions[i].value
                        selectedAnswers.push(selectedAnswer);
                    } else if (document.getElementsByName("question" + x).length === 1) {
                        selectedAnswer = document.getElementsByName("question" + x)[i].value;
                        selectedAnswers.push(selectedAnswer);
                    }
                }
            }

            var answerGrading = [];
            for (var i = 0; i < selectedAnswers.length; i++) {
                if (selectedAnswers[i] === correctAnswers[i]) {
                    answerGrading.push({
                        [i]: "Correct!"
                    });
                } else {
                    answerGrading.push({
                        [i]: "Incorrect!"
                    });
                }
            }
            // console.log(answerGrading);

            var numOfCorrect = 0;
            //calculate percentage and what message to say
            for (var i = 0; i < Object.keys(answerGrading).length; i++) {
                if (answerGrading[i][i] === "Correct!") {
                    numOfCorrect++;
                }
            }

            var correctPercentage = numOfCorrect * Object.keys(answerGrading).length;

            switch (numOfCorrect) {
                case 0:
                case 1:
                case 2:
                    var resultsMessage = "Wow, sorry to say... But you don't know your PUBG at all.";
                    break;
                case 3:
                case 4:
                case 5:
                    var resultsMessage = "You could have done worse... But not really...";
                    break;
                case 6:
                    var resultsMessage = "You got a D. But I guess you still passed..?";
                    break;
                case 7:
                case 8:
                    var resultsMessage = "Hey not terrible! But not great either..";
                    break;
                case 9:
                case 10:
                    var resultsMessage = "Nice man! You are a PUBG know it all. NERD!";
                    break;
            }

            var resultsHtml = "<hr>";
            resultsHtml += "<h3>" + resultsMessage + "</h3>"
            resultsHtml += "<h4>You got a " + correctPercentage + "%</h4><hr>";
            var questionNum = 1;
            for (key in answerGrading) {
                if(answerGrading[key][key] === "Correct!"){
                    var assignClass = "correct";
                } else {
                    var assignClass = "incorrect";
                }
                resultsHtml+="<ul>";
                resultsHtml+="<li><strong>Question"+questionNum+":</strong><span class='"+assignClass+"'> "+answerGrading[key][key]+"</span></li><hr>";
                resultsHtml+="</ul>";
                questionNum++;
            }
            $('startingMessage').innerHTML = "You have finished!";
            $("quizForm").style.display = "none";
            $("results").innerHTML = resultsHtml;
            $("resultsArea").style.display = "inline";
        }
    });
}