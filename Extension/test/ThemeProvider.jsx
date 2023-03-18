import React from 'react';
import PropTypes from 'prop-types';
import { EDSApplication } from '@ellucian/react-design-system/core';
import lightTheme from './light-theme'


export default function ThemeWrapper({ children }) {

    return (
        <EDSApplication theme={lightTheme}>
            <div key={`ut-test-${Math.random()}`}>
                {children}
            </div>
        </EDSApplication>
    )
}

ThemeWrapper.propTypes = {
    children: PropTypes.element
};
