import React, { Component, ReactNode } from 'react';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import { FLOOR_ITEM_PLACEHOLDER } from '../../bobba/graphics/GenericSprites';
import MottoEdit from './MottoEdit';
import Constants from '../../Constants';

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
                        <span>Change looks</span>
                    </button>
                    <button onClick={this.handleWave}>
                        <span>Wave</span>
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
                    <div className="user_container">
                        <div className="avatar_container">
                            <img src={src} alt={name} />
                        </div>
                        <div className="badge_container">
                            <button>
                                <img src={Constants.BADGE_RESOURCES_URL + "J0S3.gif"} alt={"ADM"} />
                            </button>
                            <button>
                                <img src={Constants.BADGE_RESOURCES_URL + "ADM.gif"} alt={"ADM"} />
                            </button>
                            <button>
                                <img src={Constants.BADGE_RESOURCES_URL + "Z64.gif"} alt={"ADM"} />
                            </button>
                        </div>
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