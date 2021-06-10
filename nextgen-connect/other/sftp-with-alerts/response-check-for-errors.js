// Send an alert if the file was not sent
// Note reportDate is set in the Preprocessor script
var sftpFilePrefix = configurationMap.get('FLDOH_REPORT_FILENAME_PREFIX') + '_PCR_' + globalChannelMap.get('reportDate')
if(responseStatus == 'ERROR') {
	var msg = 'There was an error sending the report ' + sftpFilePrefix + 
	    '* for the source Orchard Harvest file ' + sourceMap.get('originalFilename') + ' via SFTP to FLDOH with error message: ' + responseStatusMessage;
	logger.error(msg);
	alerts.sendAlert(msg);
} else {
     logger.info('FLDOH SFTP Sender Success: Sent the report ' + sftpFilePrefix + '* for Orchard Harvest file ' + sourceMap.get('originalFilename'));
}