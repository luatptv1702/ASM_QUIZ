var app = angular.module("myApp", ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html'
        })
        .when('/subjects', {
            templateUrl: 'subjects.html',
            controller: 'subjectsCtrl'
        })
        .when('/quiz/:id/:name', {
            templateUrl: 'quiz-app.html'
        })
});
app.controller('subjectsCtrl', function ($scope, $http) {
    $scope.list_subject = [];
    $http.get('db/Subjects.js').then(function (res) {
        $scope.list_subject = res.data;
    });
});

app.directive('quizfpoly', function (quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'teamplate-quiz.html',
        link: function (scope, elem, attrs) {
            scope.start = function () {
                scope.id = 1;
                scope.quizOver = false; //chua hoan thanh
                scope.inProgess = true;
                scope.getQuestion();
            };
            scope.reset = function () {
                scope.inProgess = false;
                scope.score = 0;
            };
            scope.getQuestion = function () {
                var quiz = quizFactory.getQuestion(scope.id);
                if (quiz) {
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }
            }
            scope.checkAnswer = function () {
                // alert('answer');
                if (!$('input[name="answer"]:checked').length) return;
                var ans = $('input[name="answer"]:checked').val();
                if (ans == scope.answer) {
                    //alert('đúng');
                    scope.score++;
                    scope.correctAns = true;
                } else {
                    // alert('sai');
                    scope.correctAns = false;
                }
                scope.answerMode = false;
            };
            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            }
            scope.reset();
        }
    }
});
app.factory('quizFactory', function ($http) {
    $http.get('db/Quizs/ADAV.js').then(function (res) {
        questions = res.data;
        //alert(questions.length);
    });
    return {
        getQuestion: function (id) {
            var randomItem = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if (count > 10) {
                count = 10;
            }
            if (id < count) {
                return randomItem;
            } else {
                return false;
            }
        }
    }
});
app.controller('myCtrl', function ($scope, $interval) {
    $scope.time = new Date();
    $scope.minitues = 10;
    $scope.seconds = 01;

    $interval(function () {
        $scope.time = new Date();
        if ($scope.seconds <= 0) {
            $scope.seconds = 59;
            $scope.minitues--;
        } else {
            $scope.seconds--;
        }
    }, 1000);
});