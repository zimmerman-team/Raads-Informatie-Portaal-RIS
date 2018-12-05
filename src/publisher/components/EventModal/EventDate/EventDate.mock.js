import moment from 'moment';

function getItems(x, y) {
  const arr = [];
  for (let i = y; i > x - 1; i--) {
    arr.push(i);
  }
  return arr.reverse();
}

const data = {
  minutes: getItems(0, 59),
  hours: getItems(0, 23),
  days: [getItems(1, 28), getItems(1, 29), getItems(1, 30), getItems(1, 31)],
  months: getItems(1, 12),
  years: getItems(2001, moment().year() + 2),
};

export default data;
