// Result lookup table
// <string to look for (case insensitive), LOINC code, LOINC description, negative SNOMED code, positive SNOMED code,
// negative result description, positive result description, needs unique sample ID
var RESULT_LOOKUP = [
    ['INFLUENZA A', '80382-5', 'FLUAV Ag Nph Ql IA.rapid', '260415000', '121006005', 'Influenza A Antigen Not Detected', 'Influenza A Antigen Detected', false],
    ['INFLUENZA B', '80383-3', 'FLUBV Ag Nph Ql IA.rapid', '260415000', '121008006', 'Influenza B Antigen Not Detected', 'Influenza B Antigen Detected', false],
    ['Covid, Rapid, Office, single', '95209-3', 'SARS-CoV+SARS-CoV-2 Ag Resp Ql IA.rapid', '260385009', '840535000', 'SARS-CoV-2 Antigen Not Detected', 'SARS-CoV-2 Antigen Detected', true],
    ['Covid, Rapid, Office, combo', '95209-3', 'SARS-CoV+SARS-CoV-2 Ag Resp Ql IA.rapid', '260385009', '840535000', 'SARS-CoV-2 Antigen Not Detected', 'SARS-CoV-2 Antigen Detected', false]
    ];
    
    
    
    // Sample ID counter
    var sampleIdCounter = 1;
    
    // Row number of the output export incremented for each new row
    var outputRowIndex = 1;
    
    // Data formatter
    var DateFormatter = new Packages.java.text.SimpleDateFormat('yyyyMMdd');
    
    // Extract the tests and results.  The resulting in an array that contains arrays 
    // of LOINC, LOINC description, SNOMED code, result description and if  unique sample ID is needed (1 = true).
    function getTestResultPairs(resultString) {
        // Indeces into the result lookup table
        var LOOKUP_STR_INDEX = 0, LOINC_INDEX = 1, LOINC_DESC_INDEX = 2, SNOMED_NEG_INDEX = 3, SNOMED_POS_INDEX = 4, RES_DESC_NEG_INDEX = 5, RES_DESC_POS_INDEX = 6, UNIQUE_SAMPLE_INDEX = 7;
        var retval = [];
        if(resultString) {
            var parts = resultString.toUpperCase().split(':');
            var i;
            for(i = 0; i < parts.length - 1; i++) {
                var loinc, loincDesc, snomed, resultDesc, isUniqueSample;	
                var j;
    
                // Find the test in the result lookup table
                for(j = 0; j < RESULT_LOOKUP.length; j++) {
                    if(parts[i].includes(RESULT_LOOKUP[j][LOOKUP_STR_INDEX].toUpperCase())) {
                        loinc = RESULT_LOOKUP[j][LOINC_INDEX];
                        loincDesc = RESULT_LOOKUP[j][LOINC_DESC_INDEX];
                        isUniqueSample = RESULT_LOOKUP[j][UNIQUE_SAMPLE_INDEX];
                        // Now get the result
                        if(parts[i + 1].includes('NEGATIVE')) {
                            snomed = RESULT_LOOKUP[j][SNOMED_NEG_INDEX];
                            resultDesc = RESULT_LOOKUP[j][RES_DESC_NEG_INDEX];
                        } else if(parts[i + 1].includes('POSITIVE')) {
                            snomed = RESULT_LOOKUP[j][SNOMED_POS_INDEX];
                            resultDesc = RESULT_LOOKUP[j][RES_DESC_POS_INDEX];
                        }
                        break;
                    }
                }
                
                if(!loinc || !loincDesc || !snomed) {
                    logger.info('Unable to decode result in result string: ' + resultString);
                } else {
                    retval.push([loinc, loincDesc, snomed, resultDesc, isUniqueSample]);
                }
            }
        
        }
        return retval;
    }
    
    
    //Remove any extension from the phone number
    function cleanPhoneNumber(phone) {
        var cleanedPhone = '';
        if(phone) {
            var extIndex = phone.toUpperCase().trim().indexOf('X');
            if(extIndex > 0) {
                cleanedPhone = phone.trim().substr(0,extIndex);
            } else {
                cleanedPhone = phone;
            }
        }
        return cleanedPhone;
    }
    
    // Generate a new sample ID
    function getNewSampleId() {
        return DateFormatter.format(Date.now()) + '-' + sampleIdCounter++;
    }
    
    if(msg && msg['row']) {
        // Loop through all the rows in the input report, skipping the header row
        for (var i = 1; i < getArrayOrXmlLength(msg['row']); i++) {	
            var resultString = validate(msg['row'][i]['column12'].toString(), '', new Array());
            var commonSampleId = getNewSampleId();
            var resultMap = getTestResultPairs(resultString);
            var j;
            for(j = 0; j < resultMap.length; j ++) {
    
                //Create a new output row
                if (typeof(tmp) == 'xml') {
                    if (typeof(tmp['row'][outputRowIndex]) == 'undefined') {
                      createSegment('row', tmp, outputRowIndex);
                    }
                } else {
                    if (typeof(tmp) == 'undefined') {
                      tmp = {};
                    }
                    if (typeof(tmp['row']) == 'undefined') {
                      tmp['row'] = [];
                    }
                    if (typeof(tmp['row'][outputRowIndex]) == 'undefined') {
                      tmp['row'][outputRowIndex] = {};
                    }
                }	
        
                    // Get only one date from result date
                    var resultDateString = validate(msg['row'][i]['column13'].toString(), '', new Array());
                var resultDate = '';
                    if (resultDateString) {	
                        resultDate = resultDateString.trim().split('\n')[0];
                    }
        
                // The order of these lines is important regardless of the column name.
                    tmp['row'][outputRowIndex]['column1'] = validate(msg['row'][i]['column1'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column2'] = validate(msg['row'][i]['column2'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column3'] = validate(msg['row'][i]['column3'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column4'] = validate(msg['row'][i]['column4'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column5'] = validate(msg['row'][i]['column5'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column6'] = validate(msg['row'][i]['column6'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column7'] = validate(msg['row'][i]['column7'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column8'] = validate(msg['row'][i]['column8'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column9'] = validate(msg['row'][i]['column9'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column10'] = validate(msg['row'][i]['column10'].toString(), '', new Array());
                tmp['row'][outputRowIndex]['column11'] = cleanPhoneNumber(validate(msg['row'][i]['column11'].toString(), '', new Array()));
                tmp['row'][outputRowIndex]['column12'] = resultMap[j][3]; //result desc
                tmp['row'][outputRowIndex]['column13'] = resultDate;
                tmp['row'][outputRowIndex]['column14'] = resultMap[j][0]; //loinc
                tmp['row'][outputRowIndex]['column15'] = resultMap[j][1]; //loinc desc
                tmp['row'][outputRowIndex]['column16'] = resultMap[j][2]; //snomed
                // If we need a new sample ID based on the test then get a new ID
                tmp['row'][outputRowIndex]['column17'] = resultMap[j][4] ? getNewSampleId() : commonSampleId;
                tmp['row'][outputRowIndex]['column18'] = resultDate;
                    tmp['row'][outputRowIndex]['column19'] = validate('Nasal', '', new Array());
                outputRowIndex++;
                    
            }
        }
    }