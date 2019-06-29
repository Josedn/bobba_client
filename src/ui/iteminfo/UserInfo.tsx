import React, { Component, ReactNode } from 'react';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import { FLOOR_ITEM_PLACEHOLDER } from '../../bobba/graphics/GenericSprites';
import MottoEdit from './MottoEdit';

export type UserInfoProps = {
    name: string,
    motto: string,
    userId: number,
    image?: HTMLImageElement,
    isMe: boolean,
    onClose?: () => void,
};

class UserInfo extends Component<UserInfoProps> {

    handleWave = () => {
        const { userId } = this.props;
        if (userId !== -1) {
            BobbaEnvironment.getGame().uiManager.doWave();
        }
    }

    handleChangeLooks = () => {
        BobbaEnvironment.getGame().uiManager.doOpenChangeLooks();
    }

    handleChangeMotto = (motto: string) => {
        BobbaEnvironment.getGame().uiManager.doChangeMotto(motto);
    }

    render() {
        const { name, motto, image, onClose, isMe } = this.props;
        let src = FLOOR_ITEM_PLACEHOLDER;
        if (image != null && image.src != null) {
            src = image.src;
        }
        let className = "item_info no_buttons";
        let buttons = (
            <></>
        );

        let mottoNode: ReactNode = <>{motto}</>;

        if (isMe) {
            buttons = (
                <>
                    <button onClick={this.handleChangeLooks}>
                        Change looks
                    </button>
                    <button onClick={this.handleWave}>
                        Wave
                    </button>

                </>
            );
            mottoNode = <MottoEdit motto={motto} onMottoChange={this.handleChangeMotto} />;
            className = "item_info";
        }

        return (
            <>
                <div className={className}>
                    <button className="close" onClick={onClose}>
                        X
                    </button>
                    <h2 className="title">{name}</h2>
                    <hr />
                    <div className="image_container">
                        <img src={src} alt={name} />
                    </div>
                    <hr />
                    <p className="motto">
                        {mottoNode}
                    </p>
                </div >
                <div className="item_info_button_container">
                    {buttons}
                </div>
            </>
        );
    }
}

export default UserInfo;