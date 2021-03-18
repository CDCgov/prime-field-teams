# Repository for NextGen Connect Channels, Code Templates, and more

This is a repository of documents, channels, code templates, and other scripts you can import and use with [NextGen Connect (aka Mirth Connect)](https://github.com/nextgenhealthcare/connect) by healthcare entities for the reporting of infectious diseases to [PRIME ReportStream ](https://github.com/CDCgov/prime-data-hub).

## Folder Organization
The folders under this level are organized by type and/or name of system a channel is designed to work with.  For example:
- LIS : channels related to Lab Information Systems
    - orchard-harvest : channels related to the Orchard Harvest LIS
        - channels : NextGen Connect channels
            - XML files : channel exports
            - JS files : transforms, responses or filters that are part of the channel
- EHR : channels related to Electronic Medical Record systems
    - allscripts-professional : channels related to the Allscripts Professional EHR
- PRIME ReportStream : channels related to [PRIME ReportStream](https://github.com/CDCgov/prime-data-hub)
    - channels : NextGen Connect channels

## Channel Files
Channel files include an XML export of the channel plus JS files of transforms, reponses or filters that are part of the channel.  To import a channel see the documentation specific to that channel (see the README.md file) under a channel folder.