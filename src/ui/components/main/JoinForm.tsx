import React, { SyntheticEvent } from 'react';
import BobbaEnvironment from '../../../bobba/BobbaEnvironment';
import { connect } from 'react-redux';
import { logIn } from '../../actions';

export interface LookGroup {
    figure: string,
    image: HTMLImageElement,
};

type JoinFormProps = {
    looks: LookGroup[]
};

const initialState = {
    username: '',
    look: '',
};

type JoinFormState = {
    username: string,
    look: string,
};
class JoinForm extends React.Component<JoinFormProps, JoinFormState> {

    constructor(props: JoinFormProps) {
        super(props);
        this.state = initialState;
    }

    handleInputChange = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        } as JoinFormState);
    }

    handleSubmit = (event: SyntheticEvent) => {
        const { username, look } = this.state;
        const { dispatch } = this.props as any;
        const game = BobbaEnvironment.getGame();

        event.preventDefault();
        game.doLogin(username, look);
        dispatch(logIn());
    }

    componentDidMount() {
        const { look } = this.state;
        const { looks } = this.props;

        if (look === '') {
            const randomElement = looks[Math.floor(Math.random() * looks.length)];
            this.setState({
                look: randomElement.figure,
            });
        }
    }

    getLooks() {
        let i = 0;
        const { look } = this.state;
        const { looks } = this.props;

        return looks.map(value => {
            const checked = value.figure === look;
            return (
                <div key={i++} className="look_item">
                    <img src={value.image.src} alt="look" />
                    <br />
                    <input checked={checked} type="radio" onChange={this.handleInputChange} name="look" value={value.figure} />
                </div>
            );
        });
    }

    render() {
        const { username } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Username" name="username" onChange={this.handleInputChange} value={username} />
                <br /><br />
                <div className="looks">
                    {this.getLooks()}
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