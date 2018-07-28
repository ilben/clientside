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

// update content
const getContentDiv = () => document.getElementById(CONTENT_ID);
const appendToContentDiv = item => getContentDiv().appendChild(item);
const prependToContentDiv = item => getContentDiv().prepend(item);
const removeFromContentDiv = item => {;
    if (item && item.parentNode === getContentDiv()) {
        item.classList.add('disappear');
        setTimeout(() => getContentDiv().removeChild(item), 500);
    }
}
const clearContentDiv = () => getContentDiv().innerHTML = '';

// calculations
let calcAverage = () => userData.multiply / userData.points;

// global for unfortunate reasons
let userData = {
    points: 0,
    multiply: 0,
    courses: {},
};
let latestCourseEdit = '';

function enterAction(item, func) {
    item.addEventListener('keyup', (event) => {
        event.preventDefault();
        // 13 is enter key.
        if (event.keyCode === 13) func();
    });
}

function addCoursesDiv() {
    let coursesDiv = document.createElement('div');
    let gradesDiv = document.createElement('div');
    let gradesTable = document.createElement('table');
    let gradesTbody = document.createElement('tbody');
    let subtitleDiv = document.createElement('div');
    let gradesTableThead = document.createElement('thead');
    let greadsTheadTR = document.createElement('tr');
    let nameTD = document.createElement('td');
    let pointsTD = document.createElement('td');
    let gradeTD = document.createElement('td');

    coursesDiv.id = 'courses';
    subtitleDiv.id = 'subtitle';
    gradesDiv.id = 'grades-div';
    gradesTable.id = 'grades-table';

    nameTD.innerText = 'Course Name';
    pointsTD.innerText = 'Points';
    gradeTD.innerText = 'Grade';

    greadsTheadTR.appendChild(nameTD);
    greadsTheadTR.appendChild(pointsTD);
    greadsTheadTR.appendChild(gradeTD);

    gradesTableThead.appendChild(greadsTheadTR);
    gradesTable.appendChild(gradesTableThead);
    gradesTable.appendChild(gradesTbody);

    gradesTable.tHead.classList.add('invisible');

    subtitleDiv.innerHTML = NO_CONTENT_MESSAGE_HTML;
    gradesDiv.classList.add('scrollable');

    coursesDiv.appendChild(subtitleDiv);
    gradesDiv.appendChild(gradesTable);
    coursesDiv.appendChild(gradesDiv);

    appendToContentDiv(coursesDiv);
}

function addNewCourseLine() {
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

    enterAction(nameInput, saveCourse);
    enterAction(pointsInput, saveCourse);
    enterAction(gradeInput, saveCourse);

    submitButton.innerText = 'add';
    submitButton.addEventListener('click', saveCourse);
    submitButton.classList.add('add-course-btn');

    newCourseDiv.appendChild(nameInput);
    newCourseDiv.appendChild(pointsInput);
    newCourseDiv.appendChild(gradeInput);
    newCourseDiv.appendChild(submitButton);

    appendToContentDiv(newCourseDiv);
    nameInput.focus();
}

function saveCourse() {
    let course = {};
    let inputs = document.getElementById("new-course").getElementsByTagName("input");
    let name = inputs[0].value.trim();
    let points = parseInt(inputs[1].value);
    let grade = parseInt(inputs[2].value);

    document.dispatchEvent(new Event('saved-course'));

    if (name.toLowerCase() in userData.courses) {
        addWarning('you already added a course named ' + name);
        return;
    }
    if (name == '') {
        addWarning('please insert a course name.');
        return;
    }
    if (isNaN(points) || points < 1 || points > COURSE_MAX_POINTS) {
        addWarning('course points has to be a number between 1 and ' + COURSE_MAX_POINTS);
        return;
    }
    if (isNaN(grade) || grade < 0 || grade > 100) {
        addWarning('course grade has to be a number between 0 and 100');
        return;
    }

    course.name = name;
    course.points = points;
    course.grade = grade;

    updateCoursesDiv(course);

    for (var input of inputs) input.value = '';
    inputs[0].focus();
}

function addWarning(str) {
    let warnDiv = document.createElement('div');
    let warnTimeout = 3000;
    let existingWarning = document.getElementById('warning');

    if (existingWarning) {
        getContentDiv().removeChild(existingWarning);
    }

    warnDiv.id = 'warning';
    warnDiv.innerText = capitalize(str);

    appendToContentDiv(warnDiv);
    setTimeout(() => {
        if (warnDiv && warnDiv.parentElement == getContentDiv()) {
            warnDiv.classList.add('disappear');
            setTimeout(() => getContentDiv().removeChild(warnDiv), 400);
        }
    }, warnTimeout);
}

function updateCoursesDiv(course, index) {
    let gradesTable = document.getElementById('grades-table').tBodies[0];
    let currentCourse = document.createElement('tr');
    let nameTD = document.createElement('td');
    let pointsTD = document.createElement('td');
    let gradeTD = document.createElement('td');
    let removeTD = document.createElement('td');
    let editTD = document.createElement('td');
    let removeBtn = document.createElement('button');
    let editBtn = document.createElement('button');

    currentCourse.id = 'course_' + course.name;

    nameTD.innerText = course.name;
    pointsTD.innerText = course.points;
    gradeTD.innerText = course.grade;

    removeBtn.innerText = 'remove';
    removeBtn.addEventListener('click', () => removeCourse(course));

    editBtn.innerText = 'edit';
    editBtn.addEventListener('click', () => editCourse(course));

    removeTD.appendChild(removeBtn);
    editTD.appendChild(editBtn);

    nameTD.style.width = '50%';
    gradeTD.style.width = '15%';
    pointsTD.style.width = '15%';
    removeTD.style.width = '10%';
    removeTD.style.width = '10%';

    currentCourse.appendChild(nameTD);
    currentCourse.appendChild(pointsTD);
    currentCourse.appendChild(gradeTD);
    currentCourse.appendChild(editTD);
    currentCourse.appendChild(removeTD);
    gradesTable.appendChild(currentCourse);

    addCourse(course);
}

function updateAvgSubtitle() {
    let average = 0;
    let points = userData.points;
    let numberOfCourses = Object.keys(userData.courses).length;
    let subtitle = document.getElementById('subtitle');
    let avgSpan = document.createElement('span');
    
    if (points > 0) {
        average = calcAverage();
        let randValue = Math.floor(Math.random() * EMOJIS.length);
        let emoji = EMOJIS[randValue];

        avgSpan.innerHTML = 'Your Average: <span id="avg">'
                    + average.toFixed(2)
                    + ' '
                    + (average >= 90 ? emoji : '')
                    + '</span> | <small>'
                    + numberOfCourses
                    + ' course'
                    + (numberOfCourses > 1 ? 's, ' : ', ')
                    + points
                    + ' points'
                    + '</small>';
                    

        avgSpan.classList.add('big-text');

        subtitle.innerHTML = '';
        subtitle.appendChild(avgSpan);

        if (average >= 95)
            document.getElementById('avg').classList.add('highlight-text');
        else
            document.getElementById('avg').classList.remove('highlight-text');

    } else {
        subtitle.innerHTML = NO_CONTENT_MESSAGE_HTML;
    }
}

function removeCourse(course) {
    let courseTD = document.getElementById('course_' + course.name);
    let gradesTable = document.getElementById('grades-table');
    let coursesAmount;

    if (!courseTD)
        return;
    
    userData.multiply -= course.grade * course.points;
    userData.points -= course.points;

    delete userData.courses[course.name.toLowerCase()];
    coursesAmount = Object.keys(userData.courses).length;

    if (!coursesAmount)
        gradesTable.tHead.classList.add('invisible');

    updateAvgSubtitle();
    courseTD.remove();
}

function editCourse(course) {
    let courseName = document.getElementById('course-name');
    let courseGrade = document.getElementById('course-grade');
    let coursePoints = document.getElementById('course-points');

    courseName.value = course.name;
    courseGrade.value = course.grade;
    coursePoints.value = course.points;

    latestCourseEdit = course.name;

    document.addEventListener('saved-course', function savedCourseListener() {
        if (course.name == latestCourseEdit)
            removeCourse(course);
        document.removeEventListener('saved-course', savedCourseListener);
    });

    courseName.focus();
    courseName.classList.add('flash');
    setTimeout( () => {
        courseName.classList.remove('flash');
    }, 1000)
}

function addCourse(course) {
    userData.multiply += course.grade * course.points;
    userData.points += course.points;

    userData.courses[course.name.toLowerCase()] = course;

    document.getElementById('grades-table').tHead.classList.remove('invisible');

    updateAvgSubtitle();
}

addNewCourseLine();
addCoursesDiv();