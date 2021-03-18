// If the message ID is empty then the upload was rejected
if(!msg['id']) {
	responseStatus = ERROR;
	responseStatusMessage = 'An error was reported by PRIME Report Stream while submitting data.  ' + msg['errorCount'] + 
		' errors and ' +  msg['warningCount'] + ' warnings.';
	responseErrorMessage = 'Errors: \n' + JSON.stringify(msg['errors']) + "\nWarnings\n" + JSON.stringify(msg['warnings']);
	alerts.sendAlert(responseStatusMessage + '\n' + responseErrorMessage);
	logger.error(responseStatusMessage);
} else {
	responseStatusMessage = 'Report submitted to PRIME Report Stream with ID ' + msg['id'] + '.  ' + msg['errorCount'] + 
		' errors and ' +  msg['warningCount'] + ' warnings.';
	logger.info(responseStatusMessage);
}