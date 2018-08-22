// constants
const COURSE_MAX_POINTS = 30;
const CONTENT_ID = 'content';
const NO_CONTENT_MESSAGE_HTML = 'Fill in course data & click enter';
const EMOJIS = ['💃','🕺', '👯‍',
                '👌', '👏', '🙌', '✌️', '🤞', '👍',
                '🤩', '😃', '😄', '🤗', '😁', '🤓',
                '🎊', '🎉',
                '💞', '😻', '💜', '💙'];

// one liner functions:
// make text pretty.
let capitalize = str => str[0].toUpperCase() + str.substring(1);
let capitalizeAll = str => str.split(' ').map(word => capitalize(word)).join(' ');
let pluralize = (amount, singular) => amount.toString() + ' ' + singular + (amount !== 1 ? 's' : ''); 

// update content
const getElement = id => document.getElementById(id);
const contentDiv = getElement(CONTENT_ID);
const appendToContentDiv = item => contentDiv.appendChild(item);
const focus = id => getElement(id).focus();

// calculations
let calcAverage = () => userData.multiply / userData.points;

// global for unfortunate reasons
let userData = {
    points: 0,
    multiply: 0,
    courses: {},
};
let latestCourseEdit = '';

// add event listener for clicking "enter"
function enterAction(item, func) {
    item.addEventListener('keyup', (event) => {
        event.preventDefault();
        // 13 is enter key.
        if (event.keyCode === 13) func();
    });
}

// init HTML functions:
function appendNewCourseDiv() {
    let newCourseDiv = document.createElement('div');
    let nameInput = document.createElement('input');
    let pointsInput = document.createElement('input');
    let gradeInput = document.createElement('input');
    let submitButton = document.createElement('button');

    newCourseDiv.id = 'new-course';

    nameInput.id = 'course-name';
    pointsInput.id = 'course-points';
    gradeInput.id = 'course-grade';
    
    nameInput.placeholder = 'Course Name';
    pointsInput.placeholder = 'Points';
    gradeInput.placeholder = 'Grade';

    enterAction(nameInput, validateCourseData);
    enterAction(pointsInput, validateCourseData);
    enterAction(gradeInput, validateCourseData);

    submitButton.innerText = 'add';
    submitButton.addEventListener('click', validateCourseData);
    submitButton.classList.add('add-course-btn');

    newCourseDiv.appendChild(nameInput);
    newCourseDiv.appendChild(pointsInput);
    newCourseDiv.appendChild(gradeInput);
    newCourseDiv.appendChild(submitButton);

    appendToContentDiv(newCourseDiv);
    focus('course-name');
}

function appendMessageDiv() {
    let messageDiv = document.createElement('div');

    messageDiv.id = 'message';
    messageDiv.innerHTML = NO_CONTENT_MESSAGE_HTML;

    appendToContentDiv(messageDiv);
}

function appendCoursesTable() {
    let coursesTable = document.createElement('table');
    let coursesThead = document.createElement('thead');
    let coursesTbody = document.createElement('tbody');
    let coursesTheadTR = document.createElement('tr');
    let nameTD = document.createElement('td');
    let pointsTD = document.createElement('td');
    let gradeTD = document.createElement('td');

    coursesTable.id = 'courses-table';

    // titles for table's t-head
    nameTD.innerText = 'Course Name';
    pointsTD.innerText = 'Points';
    gradeTD.innerText = 'Grade';

    coursesTheadTR.appendChild(nameTD);
    coursesTheadTR.appendChild(pointsTD);
    coursesTheadTR.appendChild(gradeTD);

    coursesThead.appendChild(coursesTheadTR);
    coursesTable.appendChild(coursesThead);
    coursesTable.appendChild(coursesTbody);

    coursesTable.tHead.classList.add('invisible');

    appendToContentDiv(coursesTable);
}

function updateContentDiv() {
    // update view with initial view:
    // input line, message div and courses table.
    appendNewCourseDiv();
    appendMessageDiv();
    appendCoursesTable();
}

function showWarning(str) {
    // pop a warning message
    let warningDiv = document.createElement('div');
    let currentWarning = getElement('warning');
    let warningTimeout = 3000;

    if (currentWarning != null)
        currentWarning.remove();

    warningDiv.id = 'warning';
    warningDiv.innerText = capitalize(str);

    appendToContentDiv(warningDiv);
    setTimeout(() => {
        // add animation and set timeout for it
        warningDiv.classList.add('disappear');
        setTimeout(() => warningDiv.remove(), 500);
    }, warningTimeout);
}

function getImprovementRecommandations() {
    const courses = userData.courses;
    const IMP_LEN = 3;
    let improvements = [];
    let avg = calcAverage();

    // get all courses names with grades < 100
    let coursesList = Object.keys(courses)
            .map( name => courses[name] )
            .filter( course => course.grade < 100 );

    if (avg == 100 || coursesList.length < IMP_LEN) return [];

    avg *= userData.points;

    // calculate average for each course,
    // under the condition that the course grade
    // changes to 100, and the rest stay the same
    coursesList.forEach( course => {
        let newAvg = avg + ((100 - course.grade) * course.points);
        if (newAvg == avg) return;
        newAvg /= userData.points;
        improvements.push({name: course.name, avg: newAvg});
    });

    // sort courses by their fake averages
    improvements.sort((a, b) => a.avg - b.avg);

    // return top IMP_LEN names of courses (those that improve average the most)
    return improvements.reverse().slice(0, IMP_LEN).map( obj => capitalizeAll(obj.name) );
}

function updateMessage() {
    let average = 0;
    let points = userData.points;
    let numberOfCourses = Object.keys(userData.courses).length;
    let messageDiv = getElement('message');
    let titleSpan = document.createElement('span');
    let improveSpan = document.createElement('span');
    let randValue = Math.floor(Math.random() * EMOJIS.length);
    let emoji = EMOJIS[randValue];
    let improvements = getImprovementRecommandations();

    if (numberOfCourses == 0) {
        messageDiv.innerHTML = NO_CONTENT_MESSAGE_HTML;
        focus('course-name');
        return;
    }

    average = calcAverage();

    titleSpan.innerHTML = 'Your Average: <span id="avg">'
                + average.toFixed(2)
                + ' '
                + (average >= 90 ? emoji : '')
                + '</span> | <small>'
                + pluralize(numberOfCourses, 'course')
                + ', '
                + pluralize(points, 'point')
                + '</small>';

    if (improvements.length > 1) {
        improvements = improvements.map( name => '<b>' + name + '</b>');

        improveSpan.innerHTML = 'Consider improving: '
                + improvements.slice(0, -1).join(', ')
                + ' and '
                + improvements.slice(-1);
    }

    titleSpan.classList.add('big-text');
    titleSpan.classList.add('block');
    improveSpan.classList.add('block');

    messageDiv.innerHTML = '';
    messageDiv.appendChild(titleSpan);
    messageDiv.appendChild(improveSpan);

    if (average >= 95)
        getElement('avg').classList.add('highlight-text');
    else
        getElement('avg').classList.remove('highlight-text');

    focus('course-name');
}

// courses manipulations
function validateCourseData() {
    let inputs = getElement("new-course").getElementsByTagName("input");
    let course = {};
    let name = inputs[0].value.trim();
    let points = parseInt(inputs[1].value);
    let grade = parseInt(inputs[2].value);

    // this event allows user insert a course with an already existing
    // name, but only if the user is edditing a course information.
    document.dispatchEvent(new Event('saved-course'));

    // input validation
    if (name.toLowerCase() in userData.courses) {
        // course name already exists
        showWarning('you already added a course named "' + name + '"');
        return;
    }
    if (name == '') {
        // empty course name
        showWarning('please insert a course name.');
        return;
    }
    if (isNaN(points) || points < 1 || points > COURSE_MAX_POINTS) {
        // illegal number of course points
        showWarning('course points has to be a number between 1 and ' + COURSE_MAX_POINTS);
        return;
    }
    if (isNaN(grade) || grade < 0 || grade > 100) {
        // illegal grade
        showWarning('course grade has to be a number between 0 and 100');
        return;
    }

    // insert info to course object
    course.name = name;
    course.points = points;
    course.grade = grade;

    // insert to table and update userData
    insertCourseToTable(course);
    addCourse(course);

    // empty inputs
    for (var input of inputs) input.value = '';
}

function insertCourseToTable(course) {
    let coursesTableBody = getElement('courses-table').tBodies[0];
    let currentCourseLine = document.createElement('tr');
    let nameTD = document.createElement('td');
    let pointsTD = document.createElement('td');
    let gradeTD = document.createElement('td');
    let editTD = document.createElement('td');
    let removeTD = document.createElement('td');
    let editBtn = document.createElement('button');
    let removeBtn = document.createElement('button');

    // set content of course
    currentCourseLine.id = 'course-' + course.name.toLowerCase();

    nameTD.innerText = capitalizeAll(course.name);
    pointsTD.innerText = course.points;
    gradeTD.innerText = course.grade;
    editBtn.innerText = 'edit';
    removeBtn.innerText = 'remove';

    // create event listeners for buttons in course line
    editBtn.addEventListener('click', () => editCourse(course));
    removeBtn.addEventListener('click', () => removeCourse(course));

    // set relevant width to each column
    nameTD.style.width = '50%';
    gradeTD.style.width = '15%';
    pointsTD.style.width = '15%';
    editTD.style.width = '10%';
    removeTD.style.width = '10%';

    // append buttons to line
    removeTD.appendChild(removeBtn);
    editTD.appendChild(editBtn);

    // insert to table
    currentCourseLine.appendChild(nameTD);
    currentCourseLine.appendChild(pointsTD);
    currentCourseLine.appendChild(gradeTD);
    currentCourseLine.appendChild(editTD);
    currentCourseLine.appendChild(removeTD);
    coursesTableBody.appendChild(currentCourseLine);
}

function addCourse(course) {
    // adds course to userData
    userData.multiply += course.grade * course.points;
    userData.points += course.points;

    userData.courses[course.name.toLowerCase()] = course;

    getElement('courses-table').tHead.classList.remove('invisible');

    updateMessage();
}

function editCourse(course) {
    // insert course data into input section so user can edit it
    let courseName = getElement('course-name');
    let courseGrade = getElement('course-grade');
    let coursePoints = getElement('course-points');

    courseName.value = course.name;
    courseGrade.value = course.grade;
    coursePoints.value = course.points;

    latestCourseEdit = course.name;

    document.addEventListener('saved-course', function savedCourseListener() {
        // remove outdated course data
        console.log(course.name + " == " + latestCourseEdit + "? ");
        if (course.name === latestCourseEdit)
            removeCourse(course);
        document.removeEventListener('saved-course', savedCourseListener);
    });

    // make user notice changes in input section
    focus('course-name');
    courseName.classList.add('flash');
    setTimeout( () => courseName.classList.remove('flash') , 1000);
}

function removeCourse(course) {
    // removes course from userData
    let courseTD = getElement('course-' + course.name.toLowerCase());
    let coursesTable = getElement('courses-table');
    let coursesAmount;

    if (!courseTD)
        return;
    
    userData.multiply -= course.grade * course.points;
    userData.points -= course.points;

    delete userData.courses[course.name.toLowerCase()];
    coursesAmount = Object.keys(userData.courses).length;

    if (!coursesAmount)
        coursesTable.tHead.classList.add('invisible');

    courseTD.remove();
    updateMessage();
}

// init HTML
updateContentDiv();