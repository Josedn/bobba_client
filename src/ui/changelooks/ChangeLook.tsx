import React from 'react';
import './changelook.css';
import Logo from '../splash/Logo';
import Draggable from 'react-draggable';

class ChangeLook extends React.Component {
    render() {
        return (
            <Draggable defaultClassName="window">
                <div>
                    <Logo />
                    <hr />
                    <p>
                        Hi, does this works?
                    <br />
                        Hi, does this works?
                    <br />
                        <br />
                        idk
                    </p>
                </div>
            </Draggable>
        );
    }
}

export default ChangeLook;