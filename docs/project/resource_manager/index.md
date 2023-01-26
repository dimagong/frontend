# Resource Manager

Built to work seamlessly in today’s legacy world (i.e. that involve paper forms, etc), yet future-proofed for the digital future (i.e. when APIs and automation are standard), NMP’s Resource Manager allows a scalable, reliable and secure method of sharing resources.

Functioning as a natural extension of the MasterSchema, Resource Manager allows the digital to interface with analogue. This is achieved through advanced data mapping features, which allow data points in the MasterSchema to be directly mapped to PDF input fields, word mail merge functions and CSV exports.
Some of the unique innovative features around Resource Manager are:
Google Docs API integrations gives Managers the ability to edit and create child versions of documents which can be specific to users. [DEV]

PDF import and mapping will allow Managers to import PDFs and map it’s input fields against the MasterSchema structure. This means that when the PDF is applied to a given Member, the Members details can be automatically prepopulated, saving Managers and Members from unnecessary data handling and double entry. [DEV]

File version and branch tracking which allows children files to be mapped back to the parent file, and vice versa, allowing Managers to track how a Parent file has been edited into its child versions and who it has been shared with. [STAGING]

## Description

1. The manager can create a field to which files will be attached in the future

2. Files are organized in descending order and can have statuses: uploaded, edited, deleted, regressed

   - Load file

     - File will be stored on S3
     - The file will be parsed and all variables will be found and stored in a table.
       1. PDF
          - via server lib PDFTK
          - examples variables: “PDF fillable fields”
       2. DOC
          - via Google Doc Api
          - example variables: {{username}}

   - File mapping

     - The manager can associate the found variable in the document with the MasterSchemaField and save associations
       1. Example for DOC: {{username}} => MasterSchema.ValidPath.firstname
       2. Description
       - MasterSchema.ValidPath.firstname its a path, firstname its a masterSchemaField which have ID, `<variable> => <masterSchemaFieldId>`
     - If the user has a value for masterSchemaFieldId, then we can take this value and paste it into the document
     - Creating a document file based on user values from the master schema occurs in two cases
       1. UserManagement->UserProfile->MasterSchema->MasterSchemaField
          - MasterSchemaField
            - It's a masterSchemaField for which the file will be created.
          - On the right side of the screen, you can select the resource from which the file will be generated based on the mapping for masterSchemaFieldId
          - The save button will create a file for this masterSchemaFieldId
       2. Application->DForm->field
          - We can make resource field type that has
            - MasterSchemaFieldId
            - ResourceManagerFieldId (will be taken latest version of related files)
          - When an onboarding is created for the user with a dForm of this type, a file will be created for the masterSchemaFieldId based on the mapping configuration
       3. Yes, we use the user's master schema fields data for filling resource files and determine in which master schema field the file will be created based on mapping configuration.

   - File statuses

   - Uploaded - its simple file was uploaded

   - Edited - available only for .DOC formats, a new file will be created with this status after editing the document through the Google Doc editor, and after confirming in the user interface, that is, the user will pull data changes from google doc and, based on them, a new file with the edited status will be created

   - Deleted - the user will click on delete file, the current file will simply change to Deleted status

   - egressed - this status appears in the condition when there is the latest version of the file in the Deleted status and they try to delete it again, thereby rolling it back. In fact, we just need to change the icon in the interface for this case

3. Available formats
   - PDF
   - DOC
