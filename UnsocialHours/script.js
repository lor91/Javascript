'use strict';

/////////// NOTES /////////

/* Next steps

>>> Filter out dates where no unsocial can be claimed
>>> Format the table so it can be pasted nicely into excel
>>> Make interactive so teams can be selected
>>> Make prettier
??? Split shifts go onto new rows
??? Mark any bank holidays


// To solve issue with overlapping months calculate month before and month after, trunc to just the last / first shift and discard IF NOT final day / first day of month
// To solve issue with overlapping months calculate month before and month after, trunc to just the last / first shift and discard IF NOT final day / first day of month
*/

const now = new Date();

let btnExporter = document.querySelector('btnExport');
let btnTeamA = document.getElementById('btnA');
let btnTeamB = document.getElementById('btnB');
let btnTeamC = document.getElementById('btnC');
let btnTeamD = document.getElementById('btnD');
let myTable = document.querySelector('#table');

let shiftStartTimesAndDates = [];
let shiftStartDates = [];
let shiftStartTimes = [];
let shiftEndTimes = [];
let shiftDates = [];
let shiftsArray = [];
let currentMonthStart = [];
let currentTeam = '';

// First day shift for each team
const startDateTeamA = new Date(2022, 11, 30);
const startDateTeamB = new Date(2023, 0, 1);
const startDateTeamC = new Date(2023, 0, 3);
const startDateTeamD = new Date(2023, 0, 5);
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// A + B day shifts, C + D night shifts
const calcShiftStartDates = function (team) {
  const endDate = new Date(team.getFullYear() + 2, 0, 1); // Calc for the year after next so December doesn't break the program
  for (let a = new Date(team); a <= endDate; a.setDate(a.getDate() + 8)) {
    shiftStartDates.push(new Date(a));
  }
  for (
    let b = new Date(team.setDate(team.getDate() + 1));
    b <= endDate;
    b.setDate(b.getDate() + 8)
  ) {
    shiftStartDates.push(new Date(b));
  }
  for (
    let c = new Date(team.setDate(team.getDate() + 1));
    c <= endDate;
    c.setDate(c.getDate() + 8)
  ) {
    shiftStartDates.push(new Date(c));
  }
  for (
    let d = new Date(team.setDate(team.getDate() + 1));
    d <= endDate;
    d.setDate(d.getDate() + 8)
  ) {
    shiftStartDates.push(new Date(d));
  }
  shiftStartTimesAndDates = shiftStartDates.flat().sort(function (a, b) {
    return a - b;
  });
};

// ---> Calculate start times for shifts

const calcShiftStartTimesAndDates = function (shift) {
  // Day shift a
  for (let i = 0; i < shift.length; i += 4) {
    shift[i].setHours(7);
  }
  // Day shift b
  for (let i = 1; i < shift.length; i += 4) {
    shift[i].setHours(7);
  }
  // Night shift a
  for (let i = 2; i < shift.length; i += 4) {
    shift[i].setHours(19);
  }
  // Night shift b
  for (let i = 3; i < shift.length; i += 4) {
    shift[i].setHours(19);
  }
};

// ---> Current month's START times

const calcCurrentMonthStartTimes = function (shift) {
  // Hacky but I couldn't get .setTime/.getTime to recognise it as a date without doing this
  for (let i = 0; i < shift.length; i++) {
    let s = new Date(shift[i]);
    s.setTime(s.getTime());
    shift[i] = s.getHours() + ':' + s.getMinutes() + 0;
  }
};

// ---> Current month's FINISH times
// Add 12 hours to each shift to determine end time - Probably breaking DRY here

const calcCurrentMonthEndTimes = function (shift) {
  // Hacky but I couldn't get .setTime/.getTime to recognise it as a date without doing this
  for (let i = 0; i < shift.length; i++) {
    let s = new Date(shift[i]);
    s.setTime(s.getTime() + 12 * 60 * 60 * 1000);
    shift[i] = s.getHours() + ':' + s.getMinutes() + 0;
  }
};

// ---> Get full dates for DATE column

const calcShiftDateOnly = function (shift) {
  for (let i = 0; i < shift.length; i++) {
    let s = new Date(shift[i]);
    shift[i] =
      s.getFullYear() +
      '/' +
      (s.getMonth() + 1) +
      '/' +
      s.getDate().toString().padStart(2, 0);
  }
};

/// --->  Generate data for table

const generateArrayData = function (dates, start, end, cur) {
  for (let i = 0; i < dates.length; i++) {
    let shiftsObject = {}; // Must declare object INSIDE loop or it only returns final result
    shiftsObject.date = dates[i];
    shiftsObject.start = start[i];
    shiftsObject.end = end[i];

    // Add varying hours depending on which day of week it is
    // Mon - Thur Nights
    if (
      cur[i].getDay() != 0 &&
      cur[i].getDay() != 6 &&
      cur[i].getDay() != 5 &&
      start[i] == '19:00'
    ) {
      shiftsObject.evening = 11;
    }
    // Friday nights
    if (cur[i].getDay() == 5 && start[i] == '19:00') {
      shiftsObject.evening = 5;
      shiftsObject.saturday = 6;
    }
    // Saturday Days
    if (cur[i].getDay() == 6 && start[i] == '7:00') {
      shiftsObject.evening = '';
      shiftsObject.saturday = 11;
      shiftsObject.sunday = '';
    }
    // Saturday Nights
    if (cur[i].getDay() == 6 && start[i] == '19:00') {
      shiftsObject.evening = '';
      shiftsObject.saturday = 5;
      shiftsObject.sunday = 6;
    }
    // Sunday Days
    if (cur[i].getDay() == 0 && start[i] == '7:00') {
      shiftsObject.evening = '';
      shiftsObject.saturday = '';
      shiftsObject.sunday = 11;
    }
    // Saturday Nights
    if (cur[i].getDay() == 0 && start[i] == '19:00') {
      shiftsObject.evening = 6;
      shiftsObject.saturday = '';
      shiftsObject.sunday = 5;
    }

    // Add the completed object to the array
    shiftsArray.push(shiftsObject);
  }
};

/// ---> Generate table

let headers = [
  'Date |   |',
  'Time in  |   |     ',
  'Time out  |   |     ',
  'Evening  |   |    ',
  'Saturday  |   |    ',
  'Sunday/BankHol',
];

const tableCreator = function () {
  let table = document.createElement('table');
  let headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    let header = document.createElement('th');
    let textNode = document.createTextNode(headerText);
    header.appendChild(textNode);
    headerRow.appendChild(header);
  });
  table.appendChild(headerRow);
  shiftsArray.forEach(shift => {
    let row = document.createElement('tr');
    Object.values(shift).forEach(text => {
      let cell = document.createElement('td');
      let textNode = document.createTextNode(text);
      cell.appendChild(textNode);
      row.appendChild(cell);
    });
    table.appendChild(row);
  });
  myTable.appendChild(table);
};

// Runner function to call everything we need in correct order
// This runner function is pretty nasty to read, but was the easiest way I could think of to stop the script generating any data before the user has selected a team

const runners = function (team) {
  calcShiftStartDates(team);
  calcShiftStartTimesAndDates(shiftStartTimesAndDates);
  currentMonthStart = shiftStartTimesAndDates
    .flatMap(shift => shift)
    .filter(
      shift =>
        shift.getMonth() == currentMonth && shift.getFullYear() == currentYear
    );
  shiftStartTimes = currentMonthStart.flat(); // Create start times array --- Use flat to create copy instead of muting array
  calcCurrentMonthStartTimes(shiftStartTimes);
  shiftEndTimes = currentMonthStart.flat(); // Create end times array --- Use flat to create copy instead of muting array
  calcCurrentMonthEndTimes(shiftEndTimes);
  shiftDates = currentMonthStart.flat(); // Create shift dates array --- Use flat to create copy instead of muting array
  calcShiftDateOnly(shiftDates);
  generateArrayData(
    shiftDates,
    shiftStartTimes,
    shiftEndTimes,
    currentMonthStart
  );
  tableCreator();
};

btnTeamA.addEventListener('click', () => {
  currentTeam = startDateTeamA;
  runners(currentTeam);
});
btnTeamB.addEventListener('click', () => {
  currentTeam = startDateTeamB;
  runners(currentTeam);
});
btnTeamC.addEventListener('click', () => {
  currentTeam = startDateTeamC;
  runners(currentTeam);
});
btnTeamD.addEventListener('click', () => {
  currentTeam = startDateTeamD;
  runners(currentTeam);
});

// Quick and dirty exporter using the following module

// <script src="https://cdn.jsdelivr.net/gh/linways/table-to-excel@v1.0.4/dist/tableToExcel.js"></script>

// Kinda buggy as it's returning 400 errors when trying to call the library but works as long as the table has been generated

btnExport.addEventListener('click', () => {
  let table = document.getElementsByTagName('table'); // you can use document.getElementById('tableId') as well by providing id to the table tag
  TableToExcel.convert(table[0], {
    // html code may contain multiple tables so here we are refering to 1st table tag
    name: `NAME - Employee Overtime and Unsocial Hours Claim Form ${
      monthNames[currentMonth]
    } ${new Date().getFullYear()}.xlsx`, // fileName
    sheet: {
      name: 'Sheet 1', // sheetName
    },
  });
});
