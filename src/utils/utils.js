/** 
 * Returns the number of digits in a string 
 * @param {string} str
 **/ 
 function getCountOfDigits(str) {
    return str.replace(/[^0-9]/g, '').length;
}

/** 
 * Returns the age of a person based on his birth date
 * @param {string} birthDate
 **/ 
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

module.exports = {
    getCountOfDigits,
    getAge
}