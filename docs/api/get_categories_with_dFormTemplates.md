# Get categories with dFormTemplates

## Request

```
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer Bearer 3|m4SvAxuy39e0hmoFWoHGusVPq22VM039BlGd1GIT");

var requestOptions = {
method: 'GET',
headers: myHeaders,
redirect: 'follow'
};

fetch("localhost/api/dform-template/categories/?search_by_name=qw", requestOptions)
.then(response => response.text())
.then(result => console.log(result))
.catch(error => console.log('error', error));
```

## Response

```
{
"data": [
{
"dform_template_id": 5,
"dform_template_name": "(copy 2022-09-29 13:24:41) qw 3",
"category_id": 5,
"category_parent": 4,
"category_name": "some validpath cat nested 4",
"category_created_at": null,
"category_updated_at": null,
"dform_template_description": "qw",
"dform_template_is_private": false,
"dform_template_created_at": "2022-09-29 13:24:41",
"dform_template_updated_at": "2022-09-29 13:24:41",
"root_category_id": "1",
"breadcrubms": "validpath.some validpath cat 3.some validpath cat nested 4",
"dform_template_organization_id": 1,
"dform_template_organization_type": "App\\Network"
},
{
"dform_template_id": 3,
"dform_template_name": "qw 3",
"category_id": 5,
"category_parent": 4,
"category_name": "some validpath cat nested 4",
"category_created_at": null,
"category_updated_at": null,
"dform_template_description": "qw",
"dform_template_is_private": false,
"dform_template_created_at": "2022-09-27 16:27:33",
"dform_template_updated_at": "2022-09-27 16:27:33",
"root_category_id": "1",
"breadcrubms": "validpath.some validpath cat 3.some validpath cat nested 4",
"dform_template_organization_id": 1,
"dform_template_organization_type": "App\\Network"
},
{
"dform_template_id": null,
"dform_template_name": null,
"category_id": 4,
"category_parent": 1,
"category_name": "some validpath cat 3",
"category_created_at": null,
"category_updated_at": null,
"dform_template_description": null,
"dform_template_is_private": null,
"dform_template_created_at": null,
"dform_template_updated_at": null,
"root_category_id": "1",
"breadcrubms": "validpath.some validpath cat 3",
"dform_template_organization_id": null,
"dform_template_organization_type": null
},
{
"dform_template_id": null,
"dform_template_name": null,
"category_id": 1,
"category_parent": null,
"category_name": "validpath",
"category_created_at": null,
"category_updated_at": null,
"dform_template_description": null,
"dform_template_is_private": null,
"dform_template_created_at": null,
"dform_template_updated_at": null,
"root_category_id": "1",
"breadcrubms": "validpath",
"dform_template_organization_id": null,
"dform_template_organization_type": null
}
]
}
```
