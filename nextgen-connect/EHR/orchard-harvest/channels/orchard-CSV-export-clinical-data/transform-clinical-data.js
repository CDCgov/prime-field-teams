var clinicalInfo = validate(msg['row'][i]['column22'].toString(), '', new Array());

// Change yes or no answer to a normalized value
function normalizeYesNoAnswer(input) {
	var retval = '';
	if(input.trim().startsWith('Y')) {
		retval = 'Y';
	} else if(input.trim().startsWith('N')) {
		retval = 'N';
	} 
	return retval;
}

// Normalize any dates or empty if no date
function normalizeDate(input) {
	var retval = '';
	var fullDateFormatter = new Packages.java.text.SimpleDateFormat('M/d/y');
	var shortDateFormatter = new Packages.java.text.SimpleDateFormat('M/d');

	// Try extracting the date
	try {
		// The SimpleDateFormat takes care of converting two digit years to four digit	
		var date = fullDateFormatter.parse(input);
		retval = fullDateFormatter.format(date); // Outputs as four digit year
	} catch(ex) {
		//Nothing to do
	}

	// If there was no date decoded, try a different date format
	if(!retval) {
		var now = new Date();
		try {
			var date = shortDateFormatter.parse(input);
			date.setYear(now.getYear());
	
			// Make sure we do not get a date in the future
			if(date.getTime() > now.getTime()) {
				date.setYear(now.getYear() - 1);
			}
			retval = fullDateFormatter.format(date); // Outputs as four digit current year 
		} catch(ex) {
			//Nothing to do
		}
	} 
	return retval;
}

var symtomatic = '';
var symtomaticDate = '';
var hospitalized = '';
var icu = '';
var pregnant = '';
var healthcareWorker = '';
var firstTest = '';
var careResident = '';

if(clinicalInfo) {	
	// Split the string into questions.
	var questionAndAnswers = clinicalInfo.toUpperCase().split('\\d\\)');

	var x;
	for(x = 1; x < questionAndAnswers.length; x++) {
		// Split the questions into question/answer 
		var questionParts = questionAndAnswers[x].split(']');
		if(questionParts.length === 2) {
			var question = questionParts[0];
			var answer = questionParts[1];
			
			// Find the specific question and extract the data.
			if(question.includes('SYMTOMATIC')) {
				// This answer can have a date or not, separated by some character like a comma, dash, etc. or not
				var answerParts = answer.trim().split('[^A-Z0-9\\/]');

				//The first part is the Yes/No value if any
				if(answerParts.length > 0) {
					symtomatic = normalizeYesNoAnswer(answerParts[0]);
				}
				
				// If there is another part then it is the date of first symptoms, but there may be other whitespaces at the end.
				// Find the part that has a date if any
				var dateString = '';
				var y;
				for(y = answerParts.length - 1; y > 0; y--) {
					if(answerParts[y].indexOf("/") >= 0) {
						dateString = answerParts[y];
						break;
					}
				}
				// Also, make sure we do not overwrite a date already provided in another question
				if(dateString && !symtomaticDate) {
					symtomaticDate = normalizeDate(dateString);
				}
			}
			else if(question.includes('HOSPITALIZED')) {
				hospitalized = normalizeYesNoAnswer(answer);
			}
			else if(question.includes('ICU')) {
				icu = normalizeYesNoAnswer(answer);
			}
			else if(question.includes('PREGNANT')) {
				pregnant = normalizeYesNoAnswer(answer);
			}
			else if(question.includes('EMPLOYED IN HEALTHCARE')) {
				healthcareWorker = normalizeYesNoAnswer(answer);
			}
			else if(question.includes('FIRST TEST')) {
				firstTest = normalizeYesNoAnswer(answer);
			}
			else if(question.includes('NURSING HOME')) {
				careResident = normalizeYesNoAnswer(answer);
			}
			else if(question.includes('FIRST SYMPTOM')) {
				var normalizedAnswer = normalizeDate(answer);
				if(normalizedAnswer) {
					symtomaticDate = normalizedAnswer;
				}
			}
		}
    
	}

	// Only set a symptomatic date if symptomatic is Y
	if(!symtomatic || symtomatic != 'Y') {
		symtomaticDate = '';
	}
	
//	logger.info('1:' + symtomatic + ' 2:' + symtomaticDate + ' 3:' + hospitalized + ' 4:' + icu + ' 5:' + pregnant + ' 6:' + healthcareWorker + ' 7:' + firstTest + ' 8:' + careResident);
	tmp['row'][i]['column20'] = firstTest;
	tmp['row'][i]['column21'] = healthcareWorker;
	tmp['row'][i]['column22'] = symtomatic;
	tmp['row'][i]['column23'] = symtomaticDate;
	tmp['row'][i]['column24'] = hospitalized;
	tmp['row'][i]['column25'] = icu;
	tmp['row'][i]['column26'] = careResident;
	tmp['row'][i]['column27'] = pregnant;
}