# Suggested Data Type (STD) api

### Get SDT by master schema field id

- Request

```
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer 5|KAD9DB8Y2prYnESRlxWKzzwmWfAv0nuQKVfJMU3h");


var requestOptions = {
 method: 'GET',
 headers: myHeaders,
 redirect: 'follow'
};


fetch("localhost/api/master-schema-field/11/sdt", requestOptions)
 .then(response => response.text())
 .then(result => console.log(result))
 .catch(error => console.log('error', error));

```

- Response (SDT version model)

```{
   "data": {
       "id": 44,
       "is_latest": true,
       "structure": {
           "type": "text",
           "title": "text_sdt233"
       },
       "sdt_id": 3,
       "created_at": "2022-12-12T15:26:28.000000Z",
       "updated_at": "2022-12-12T15:26:28.000000Z"
   }
}
```

### Update SDT for master schema field

Get information about changes which to be applied

- Request to get dform template names and hash for "yes" parameter

```var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer 5|KAD9DB8Y2prYnESRlxWKzzwmWfAv0nuQKVfJMU3h");
myHeaders.append("Content-Type", "application/json");


var raw = JSON.stringify({
 "type": "text",
 "title": "text_sdt233"
});


var requestOptions = {
 method: 'POST',
 headers: myHeaders,
 body: raw,
 redirect: 'follow'
};


fetch("localhost/api/master-schema-field/11/sdt", requestOptions)
 .then(response => response.text())
 .then(result => console.log(result))
 .catch(error => console.log('error', error));
```

- Response

```{
   "data": {
       "yes": "4ce4aa3449b87083099188dbc5ea8eb6",
       "dform_template_names": [
           "test2"
       ]
   }
}
```

Confirm and create new SDT version

- Request

```var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer 5|KAD9DB8Y2prYnESRlxWKzzwmWfAv0nuQKVfJMU3h");
myHeaders.append("Content-Type", "application/json");


var raw = JSON.stringify({
 "type": "text",
 "title": "text_sdt233"
});


var requestOptions = {
 method: 'POST',
 headers: myHeaders,
 body: raw,
 redirect: 'follow'
};


fetch("localhost/api/master-schema-field/11/sdt?yes=4ce4aa3449b87083099188dbc5ea8eb6", requestOptions)
 .then(response => response.text())
 .then(result => console.log(result))
 .catch(error => console.log('error', error));
```

- Response (SDT version model)

```{
   "data": {
       "is_latest": true,
       "structure": {
           "type": "text",
           "title": "text_sdt233"
       },
       "sdt_id": 3,
       "updated_at": "2022-12-12T15:34:45.000000Z",
       "created_at": "2022-12-12T15:34:45.000000Z",
       "id": 45
   }
}
```

- Error when something was changed by another manager and hash is out of date

```{
   "error": {
       "status": 422,
       "message": "The field was changed by another manager, this is a warning to avoid inconsistencies, please try again.",
       "errors": [],
       "internal_code": 0
   }
}
```

[More about STD](../../../../project/sdt/index.md)
