# Ingest Orchard Harvest CSV Export with Clinical Data

This channel takes in a CSV export from Orchard Harvest and normalizes the clinical information field that contains the answers to the AOE questions.  This channel contains a source from file with a transformation and a filter, and sends the data to one or more channel writer destinations.

## Channel Configuration
The following configuration map entries are required for this channel:
- ORCHARD_REPORT_DIR - the folder to look for the CSV export file
- ORCHARD_REPORT_FILENAME_PREFIX - the prefix of the CSV export file.  The expected filename is ```<ORCHARD_REPORT_FILENAME_PREFIX>*.csv```

## Orchard Harvest CSV Export Format
The export expected by this channel includes a header row, subsequest records one per row, each record has the following fields in this order.  Note the field header names are ignored.

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
1. Clinical Info - This field contains the answers to the AOE questions.  The transformation looks for specific words on the question text to match the answer to the resulting transformed fields.  Note all of the following text is held within this one field.  Note the "is the patient sympomatic?" question can contain the date of first sympton or jusy a yes or no answer.  E.g. 
```
1) Is the Patient Symtomatic?		[Required]		y  3/1/21 
2) Has the patient been hospitalized?		[Required]		n 
3) Has the patient been in ICU?		[Required]		n 
4) Is the patient pregnant?		[Required]		n 
5) Is the patient employed in Healthcare?		[Required]		n 
6) Is this the patient's first test?		[Required]		y 
7) Resident of a congregate care setting?		[Required]		n 
8) Date of first symptom		[Required]		__________ 
9) What is the source?		[Required]		n"
```
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

## Filter
The filter ensures that only files with two lines or more (header row plus records) are processed.  An INFO message is logged if a file is filtered.

## Error handling
If there is an error opening the file then the file is moved to the error folder within the ORCHARD_REPORT_DIR folder.  If the file was read successfully it is moved to the processed folder within the ORCHARD_REPORT_DIR folder.

