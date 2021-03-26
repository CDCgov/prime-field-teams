# Ingest Allscripts Professional CSV Export with Rapid Tests

This channel takes in a CSV export from Allscripts Professional with rapid test results and generates the necessary individual results.  This transformation currently does not include support for AOE questions as there is an issue exporting them out of Allscripts Professional.  

To generate the results, the following rules are followed:
1. A result with only Influenza A and B tests will generate two separate results with the same patient information and sample ID.
1. A result with Influenza A and B tests plus a Covid single test will generate three separate results with the same patient information.  The sample IDs for the Influenza results will be the same, but different for the Covid single test as it is a different sample.
1. A result with Influenza A and B tests plus a Covid combo (one sample for all tests) test will generate three separate results with the same patient information and sample ID.

## Channel Configuration
The following configuration map entries are required for this channel:
- ALLSCRIPTS_REPORT_DIR - the folder to look for the CSV export file
- ALLSCRIPTS_REPORT_FILENAME_PREFIX - the filename of the export file.  Can be a wildcard and it is case sensitive.  E.g. ```allscripts-rapidtest-export*```

## Filter
The filter ensures that only files with two lines or more (header row plus records) are processed.  An INFO message is logged if a file is filtered.

## Allscritps Professional CSV Input Format
The export expected by this channel includes a header row, subsequest records one per row, each record has the following fields in this order.  Note the field header names are ignored.
ID,Name,Birth Date,Age,Race,Preferred Caregiver,Street,City,State,Zip,Phone,"Lab Result Value Equals, Days (Lab Catalog)",Result Date

1. Patient ID
1. Patient Name
1. Patient DOB 
1. Patient Age
1. Patient Race
1. Provider
1. Patient Address
1. Patient City 
1. Patient State
1. Patient ZIP
1. Patient Phone
1. Lab Result - This includes one or more results.  See Configuring Test Information below.  The expectation is that the result has a string of NEGATIVE or POSITIVE (case insensitive) to denote the result of each test, and that the result is separated by a colon.
1. Result date for each test, each separated by a new line.  Only the first date is used as all tests are assumed to be performed the same day. 

Examples of lab results are as follows:

**Example 1**: Influenza A and B test plus Covid single test.  Note the Covid single test requires a different sample
```
INFLUENZA A (IN HOUSE ONLY): Negative
INFLUENZA B (IN HOUSE ONLY): Negative
Covid, Rapid, Office, single: Positive 
```
**Example 2**: Influenza A and B test only.  Note this uses one sample.
```
INFLUENZA A (IN HOUSE ONLY): Negative
INFLUENZA B (IN HOUSE ONLY): Negative 
```
**Example 3**: Influenza A and B test plus Covid combo test.  Note this uses one sample
```
INFLUENZA A (IN HOUSE ONLY): Negative
INFLUENZA B (IN HOUSE ONLY): Negative
Covid, Rapid, Office, combo: Positive 
```

### Configuring Test Information
The test information is held in an array that is part of the transformer code.  The array is a list of test data as follows:
1. String to look for (case insensitive) in the result
1. The LOINC code for the test
1. The LOINC description for the provided LOINC code
1. The SNOMED code used for a negative result
1. The SNOMED code used for a positive result
1. A string describing a negative result
1. A string describing a positive result
1. Set to true if a test required a unique sample ID from other tests in the same result record

## Output CSV Transformation
The following fields are transformed from the original Orchard Harvest CSV export:

1. Patient ID
1. Patient Name
1. DOB 
1. Patient Age
1. Race
1. Provider
1. Patient Address1
1. Patient City 
1. Patient State
1. Patient ZIP
1. Patient Phone
1. Reported As - "SARS-CoV-2 RNA Detected"
1. Appr Date
1. LOINC
1. Test - E.g. "SARS-CoV-2 PCR RNA"
1. Result-Level SNOMED Codes
1. Sample ID
1. Draw Date
1. Sample Type - E.g. "Nasal"
1. 1st Test? - Is this the patient's first test? (Y, N or blank if unknown)
1. HCW? - Is the patient employed in Healthcare? (Y, N or blank if unknown)
1. Symptomatic - Is the Patient Symtomatic? (Y, N or blank if unknown)
1. Sympt Date - Date of first symptom (e.g. 3/1/2021)
1. Hosp? - Has the patient been hospitalized? (Y, N or blank if unknown)
1. ICU? - Has the patient been in ICU? (Y, N or blank if unknown)
1. Nsg Home? - Resident of a congregate care setting? (Y, N or blank if unknown)
1. Preg? - Is the patient pregnant? (Y, N or blank if unknown)

## Error handling
If there is an error opening the file then the file is moved to the error folder within the ALLSCRIPTS_REPORT_DIR folder.  If the file was read successfully it is moved to the processed folder within the ALLSCRIPTS_REPORT_DIR folder.

