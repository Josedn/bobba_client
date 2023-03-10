import { lookup } from 'dns';
import React, { SyntheticEvent } from 'react';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';

const MAX_NAME_LENGTH = 20;
const MAX_PASSWORD_LENGTH = 20;
export interface LookGroup {
    figure: string,
    image: HTMLImageElement,
};

type JoinFormProps = {
    looks: LookGroup[],
};

const initialState = {
    username: '',
    password: '',
    look: '',
    wrongUsername: false,
    queuedLogin: false,
    login: false,
};

type JoinFormState = {
    username: string,
    password: string,
    look: string,
    wrongUsername: boolean,
    queuedLogin: boolean,
    login: boolean
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
        const { username, password, look } = this.state;
        event.preventDefault();

        if (username.length > 0 || username.length > MAX_NAME_LENGTH) {
            BobbaEnvironment.getGame().uiManager.doLogin(username, password, look);
            this.setState({
                queuedLogin: true,
            });
        }
        else {
            this.setState({
                wrongUsername: true,
            });
        }
    }

    componentDidMount() {
        const { look } = this.state;
        const { looks } = this.props;

        if (look === '') {
            const randomElement = looks[Math.floor(Math.random() * looks.length)];
            if (randomElement != null) {
                this.setState({
                    look: randomElement.figure,
                });
            }
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
        const { username, password, look, wrongUsername, queuedLogin } = this.state;
        const classname = wrongUsername ? "wrong" : "";

        const buttonLogin = queuedLogin ? <button disabled>Loading...</button> : <button onClick={() => this.setState({username: username, password: password, look: look, wrongUsername: wrongUsername, queuedLogin: queuedLogin, login: true})}>Login</button>
        const buttonSignUp = queuedLogin ? <button disabled>Loading...</button> : <button onClick={() => this.setState({username: username, password: password, look: look, wrongUsername: wrongUsername, queuedLogin: queuedLogin, login: false})}>Sign Up</button>

        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" autoComplete="off" maxLength={MAX_NAME_LENGTH} className={classname} placeholder="Username" name="username" onChange={this.handleInputChange} value={username} />
                <input type="password" autoComplete="off" maxLength={MAX_PASSWORD_LENGTH} className={classname} placeholder="Password" name="password" onChange={this.handleInputChange} value={password} />
                <br /><br />
                <div className="looks">
                    {this.getLooks()}
                </div>
                <br />
                <br />
                {buttonLogin}
                {buttonSignUp}
            </form>
        );
    }
}

export default JoinForm;