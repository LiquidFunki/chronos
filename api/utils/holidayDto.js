module.exports = (holidayArr, author) => holidayArr.map((holiday) => {
  // console.log(holiday);
  const correctDate = new Date(holiday.date);
  correctDate.setFullYear(new Date().getFullYear());
  return {
    author,
    name: holiday.name,
    type: 'holiday',
    color: '#ca493c',
    startEvent: correctDate.toUTCString(),
    endEvent: correctDate.toUTCString(),
    allDay: true,
  };
});
