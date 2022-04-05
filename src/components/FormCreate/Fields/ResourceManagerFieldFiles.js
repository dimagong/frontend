import {isObject} from "lodash";
import { CustomSelect } from "./Parts/CustomSelect";
import React, { useEffect, useState } from "react";
import resourceManagerFieldFileService from '../services/resourceManagerFieldFile.service'
import moment from "moment";

export default function ResourceManagerFieldFiles({ organizations, resourceManagerFieldId, onChange }) {

    const [files, setFiles] = useState([]);

    useEffect(() => {
        // todo organization related to dform can be only one, this is legacy array of organization
        const organization = organizations[0];

        resourceManagerFieldFileService.resourceManagerFields(
            organization.id,
            organization.type,
        ).then((response) => {
            setFiles(response.data.data);
        });
    }, []);

    const formatLabel = (file) => {
        let label = [
            'ResourceManager',
            file.breadcrumbs,
            file.name,
        ].join('.');

        const updatedAt = moment(file.updated_at).format("YYYY.MM.DD HH:mm:ss");

        label +=` v${updatedAt}`;

        return label;
    }

    const mapToOption = (file) => {

        return {
            label: formatLabel(file),
            value: file.id
        }
    }

    const mapToOptions = () => {
        return files.map((file) => {
            return mapToOption(file)
        });
    }

    const findSelectedValue = (options) => {
        return options.filter(function(option) {
            return option.value === resourceManagerFieldId;
        })
    }

    const options = mapToOptions();
    const selectedValue = findSelectedValue(options);

    return <CustomSelect
        id="select-ms-property"
        options={options}
        value={selectedValue}
        onChange={(event) => {
            console.log('event', event);
            onChange(event)
        }}
        invalid={false}
    />
}