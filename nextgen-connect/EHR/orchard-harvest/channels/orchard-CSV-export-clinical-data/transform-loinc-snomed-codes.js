var loinc = validate(msg['row'][i]['column14'].toString(), '', new Array());
var loincDesc = validate(msg['row'][i]['column15'].toString(), '', new Array());
var snomed = validate(msg['row'][i]['column16'].toString(), '', new Array());
var snomedDesc = validate(msg['row'][i]['column12'].toString(), '', new Array());

// Change the LOINC description for specific LOINCs
if(loinc == '85477-8') {
     loincDesc = 'Influenza virus A RNA [Presence] in Upper respiratory specimen by NAA with probe detection'
}
else if(loinc == '85478-6') {
     loincDesc = 'Influenza virus B RNA [Presence] in Upper respiratory specimen by NAA with probe detection'
}
else if(loinc == '85479-4') {
     loincDesc = 'Respiratory syncytial virus RNA [Presence] in Upper respiratory specimen by NAA with probe detection'
}
else if(loinc == '94500-6') {
     loincDesc = 'SARS-CoV-2 (COVID-19) RNA [Presence] in Respiratory specimen by NAA with probe detection'
}

// This needs to be in order as the column name does not set the output order
tmp['row'][i]['column12'] = snomedDesc;
tmp['row'][i]['column13'] = validate(msg['row'][i]['column13'].toString(), '', new Array()); // Appr Date
tmp['row'][i]['column14'] = loinc;
tmp['row'][i]['column15'] = loincDesc;
tmp['row'][i]['column16'] = snomed;