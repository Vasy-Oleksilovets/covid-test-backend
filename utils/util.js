// @ts-nocheck
const isEmpty = (param) => {
  if(param) return false;
  else return true;
}

const isEmail = (param) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(param).toLowerCase());
}

const isPhone = (param) => {    
  const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneno.test(String(param).toLowerCase());
}

function isZipCode(elementValue){
  var zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
  return zipCodePattern.test(elementValue);
}

const getMySecret = () => {
  return "sakar";
}

const getMonthwithTwoCharacters = () => {
  let month = new Date().getMonth() + 1;
  if (month === 1) month = '0' + month;
  return month;
}

const getDaywithTwoCharacters = () => {
  let day = new Date().getDay() + 1;
  if (day === 1) month = '0' + month;
  return day;
} 

module.exports = {isEmpty, isPhone, isEmail, isZipCode, getMySecret, getMonthwithTwoCharacters, getDaywithTwoCharacters}