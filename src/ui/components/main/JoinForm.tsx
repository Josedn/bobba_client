import React, { SyntheticEvent } from 'react';
import BobbaEnvironment from '../../../bobba/BobbaEnvironment';
import { connect } from 'react-redux';
import { logIn } from '../../actions';
const initialState = {
    username: '',
};
class JoinForm extends React.Component {

    constructor(props: object) {
        super(props);
        this.state = initialState;
    }

    handleInputChange = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    handleSubmit = (event: SyntheticEvent) => {
        const { username } = this.state as any;
        const { dispatch } = this.props as any;
        const game = BobbaEnvironment.getGame();

        event.preventDefault();
        game.doLogin(username, 'hd-190-10.lg-3023-1408.ch-215-91.hr-893-45');
        dispatch(logIn());
    }

    render() {
        const { username } = this.state as any;
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Username" name="username" onChange={this.handleInputChange} value={username} />
                <br /><br />
                <div className="looks">
                    <div className="look_item">
                        <img alt="Relevance"
                            src="data:image/png;base64,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" />
                        <br />
                        <input type="radio" name="look" value="hd-190-10.lg-3023-1408.ch-215-91.hr-893-45" />
                    </div>
                </div>
                <br />
                <br />
                <button>Join</button>
            </form>
        );
    }
}
const mapStateToProps = (state: any) => ({
    loginContext: state.login,
});

export default connect(mapStateToProps)(JoinForm);