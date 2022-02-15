const getTimeStamp = () => {
    console.log('timestamp here');
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    let timeStamp =
      yyyy +
      '-' +
      mm +
      '-' +
      dd +
      ' ' +
      today.getHours() +
      ':' +
      today.getMinutes() +
      ':' +
      today.getSeconds() +
      '.' +
      today.getMilliseconds();
    console.log('insede get timestamp', timeStamp);
    return timeStamp;
  };
  
  module.exports = {getTimeStamp};
  