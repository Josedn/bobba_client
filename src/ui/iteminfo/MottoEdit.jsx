import React from 'react';
import PropTypes from 'prop-types';
import { RIEInput } from 'riek';

export default class MottoEdit extends React.Component {
    render() {
        const { motto, onMottoChange } = this.props;
        return (
            <RIEInput
                value={motto}
                change={(data) => onMottoChange(data.motto)}
                classLoading="loading"
                propName='motto'
                editProps={{ maxLength: 80 }}
            />
        );
    }
}

MottoEdit.propTypes = {
    motto: PropTypes.string,
    onMottoChange: PropTypes.func,
};