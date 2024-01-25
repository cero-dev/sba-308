

// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];


function calculateAverage(ID, providedLearnerSubmission, providedAssignmentGroup) {
    let average = 0;
    let currentYear = 2024
    let amountOfAssignments = 0;

    //console.log(JSON.stringify(providedAssignmentGroup))
    // assignment id=3 is not due yet, does not go into average

    //console.log(JSON.stringify(providedLearnerSubmission))

    providedLearnerSubmission.forEach(assignment => {
        if (assignment.learner_id === ID) {
            providedAssignmentGroup.assignments.forEach(sourceAssignment => {
                let studentSubmittedDate = new Date(assignment.submission.submitted_at);
                let assignmentDueDate = new Date(sourceAssignment.due_at);
                if ((assignment.assignment_id === sourceAssignment.id) && (parseInt(sourceAssignment.due_at) < currentYear)) {
                    if (studentSubmittedDate <= assignmentDueDate) {
                        average = average + assignment.submission.score / sourceAssignment.points_possible;
                        amountOfAssignments = amountOfAssignments + 1;
                    } else {
                        average = average + assignment.submission.score / (sourceAssignment.points_possible - 10);
                        amountOfAssignments = amountOfAssignments + 1;
                    }
                }
            });
        }
    });

    average = average / amountOfAssignments;
    return average;
}

function generateResult(providedCourseInfo, providedLearnerSubmission, providedAssignmentGroup) {
    let studentID = -1;
    let arrayOfStudentObjects = [];
    let arrayOfStudentIDs = [];

    providedLearnerSubmission.forEach(element => {
        if (studentID != element.learner_id) {
            arrayOfStudentIDs.push(element.learner_id);
        }
        studentID = element.learner_id;
    });

    // for however many students there are, generate an object to append to arrayOfStudentObject
    for (let i = 0; i < arrayOfStudentIDs.length; i++) {
        let studentObject = {};
        studentObject["ID"] = arrayOfStudentIDs[i];
        studentObject["Average"] = calculateAverage(arrayOfStudentIDs[i], providedLearnerSubmission, providedAssignmentGroup)
        providedLearnerSubmission.forEach(element => {
            let studentSubmittedDate = new Date(element.submission.submitted_at);
            let assignmentDueDate = new Date(providedAssignmentGroup.assignments[element.assignment_id - 1].due_at);
            let currentDate = new Date();
            if (element.learner_id === arrayOfStudentIDs[i]) {
                if ((studentSubmittedDate <= assignmentDueDate) && (assignmentDueDate < currentDate)) {
                    studentObject[providedAssignmentGroup.assignments[element.assignment_id - 1].id] = element.submission.score / providedAssignmentGroup.assignments[element.assignment_id - 1].points_possible;
                } else if ((studentSubmittedDate > assignmentDueDate) && (assignmentDueDate < currentDate)) {
                    studentObject[providedAssignmentGroup.assignments[element.assignment_id - 1].id] = element.submission.score / (providedAssignmentGroup.assignments[element.assignment_id - 1].points_possible - 10);
                }
            }
        });
        arrayOfStudentObjects.push(studentObject);

    }

    return arrayOfStudentObjects;
}

let result = generateResult(CourseInfo, LearnerSubmissions, AssignmentGroup);

// for some reason I could not properly format the JSON.stringify output but the data is all there
// 1 is assignment 1, 2, is assignment 2 with grade 1 meaning 100%, assignment 3 is not there due to not
// being due yet, and late submission score deductions are also calculated
console.log(JSON.stringify(result));