import {isObject} from "lodash";
import { CustomSelect } from "./Parts/CustomSelect";
import React, { useEffect, useState } from "react";
import resourceManagerFieldFileService from '../services/resourceManagerFieldFile.service'

export default function ResourceManagerFieldFiles(props) {

    const [files, setFiles] = useState([]);

    useEffect(() => {
        // todo organization related to dform can be only one, this is legacy array of organization
        const organization = props.organizations[0];

        resourceManagerFieldFileService.resourceManagerFieldFiles(
            organization.id,
            organization.type,
        ).then((response) => {
            setFiles(response.data.data);
            console.log(response.data.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <CustomSelect
        id="select-ms-property"
        options={[
            {label:'test', value:'qwe'}
        ]}
        value={'qwe'}
        onChange={(event) => {

        }}
        invalid={props.invalid}
        onInputChange={(event) => {

        }}
    />
}