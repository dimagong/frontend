import React from "react";
import Select from "react-select";

export class CustomSelect extends React.Component {
    render() {
        const {
            invalid
        } = this.props;

        const customStyles = {
            control: (base, state) => ({
                ...base,
                // state.isFocused can display different borderColor if you need it
                borderColor: state.isFocused ?
                    '#ddd' : !invalid ? '#ddd' : '#dc3545',
                // overwrittes hover style
                '&:hover': {
                    borderColor: state.isFocused ? '#ddd' : !invalid ? '#ddd' : 'red'
                }
            })
        };
        return <Select styles={customStyles} {...this.props}/>
    }
}