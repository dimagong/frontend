# Implementation with NMP

1. When we click the button Save in RM:

   - sends a request to an endpoint with GET parameter `resource_manager_field_id`.

   - gets a JSON response with

     ```
         data: [
         {
             id: 269,
             path:  "https://nmpbucketdev.s3.us-west-2.amazonaws.com/resource_manager/2/field/2/file/48/screenshots/1.jpg"
         },
     ]
     ```

   - Converted images save in a table and S3 service

   - Table(`resource_manager_field_file_screenshots`) for storing photos(hasMany) :

     - `id`
     - `name`
     - `resource_manager_field_file_id`
     - `type`
     - `path`
     - `created_at`
     - `updated_at`

   - Screenshots are stored on this path `resource_manager/$resourceManagerId/field/$resourceManagerFieldId/file/$resourceManagerFieldFileId/screenshots`

2. In the frontend draw signatures blocks

   - Table(`resource_manager_field_file_signatures`) for storing signature blocks(hasMany):
     - `id`
     - `resource_manager_field_file_screenshot_id`
     - `user_adobe_id`
     - `coordinates(json_encode)`
     - `created_at`
     - `updated_at`

3. In signature management, the manager chooses a user with the coordinates of the signature block. Click save and send a request in Adobe to create an agreement.

4. Create a webhook in Adobe with an endpoint that creates custom fields when an agreement has been created and update `user_adobe_id` in table `resource_manager_field_file_signatures`

[More about digital signature](./../../../../../project/digital_signature/index.md)
