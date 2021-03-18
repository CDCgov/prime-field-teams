# Ingest Orchard Harvest CSV Export with Clinical Data

This channel takes in a CSV export from Orchard Harvest and normalizes the clinical information field that contains the answers to the AOE questions.  This channel contains a source from file with a transformation and a filter, and sends the data to one or more channel writer destinations.

## Channel Configuration
The following configuration map entries are required for this channel:
- PRIME_REPORT_STREAM_API_ENDPOINT - the URL of the PRIME ReportStream API
- PRIME_REPORT_STREAM_API_KEY - the secret key to provide the API for authentication

## Data Format
There is no data format associated with this channel.  The raw data is forwarded as is to the PRIME ReportStream API

## Error Handling
An error message is logged and an alert is triggered if the response HTTP code is not 2xx or if the PRIME ReportStream API response does not contain an ID, which means the report was not accepted.  
The API responses can also contain warnings and those are logged as part of the error or info messages related to the response.