//Remove any extension from the phone number
var phone = validate(msg['row'][i]['column11'].toString(), '', new Array());
var cleanedPhone = '';
if(phone) {
    var extIndex = phone.toUpperCase().trim().indexOf('X');
    if(extIndex > 0) {
        cleanedPhone = phone.trim().substr(0,extIndex);
    } else {
        cleanedPhone = phone;
    }
}

tmp['row'][i]['column11'] = cleanedPhone;