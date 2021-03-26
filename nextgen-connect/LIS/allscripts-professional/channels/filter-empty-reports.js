// If we have at least two rows in the file then process it, otherwise ignore the file
if (msg['row'] && msg['row'][0] && msg['row'][1]) {
	logger.info('Processing Allscripts file ' + sourceMap.get('originalFilename'));
     return true;
} else {
	logger.info('Ignoring Allscripts file with no data ' + sourceMap.get('originalFilename'));
	return false;
}