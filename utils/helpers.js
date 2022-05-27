module.exports = {
  format_time: (date) => {
    return date.toLocaleTimeString();
  },
  // The custom helper 'format_date' takes in a timestamp
  format_date: (date) => {
    // Using JavaScript Date methods, we get and format the month, date, and year
    // We need to add one to the month since it is returned as a zero-based value and set format so that the month is in word-form
    const day = date.getDate();
    const options = { month: "long" };
    const month = new Intl.DateTimeFormat("en-US", options).format(
      date.getMonth() + 1
    );
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  },
};
