import React from 'react';
import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';

var machine = {
	"0" : "",
	"1" : "accept",
	"2" : "reject",
	"3" : "ac2rej",
	"4" : "rej2ac"
}

export default class LoginInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			user: '',
			password: '',
			confirm: '',
			registering: false,
			founduser: false
		}

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.returnLogin = this.returnLogin.bind(this);
		this.findUser = this.findUser.bind(this);
		this.signUp = this.signUp.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const name = target.value;

		this.setState({
			[target.name]: name
		})

		if (this.state.registering && name != "" && target.name === "user") {
			this.findUser(name);
		}
	}

	findUser(name) {
		axios.post('http://localhost:4000/finduser', { user: name })
			.then((response) => {
				console.log(response.data);
				this.setState({
					founduser: response.data.stat,
				})
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	handleRegister() {
		var entry = Object.assign({}, this.state, {});
		this.props.onAdd(entry);
		this.setState({
			registering: false
		})
	}

	handleLogin(event) {
		var entry = Object.assign({}, this.state, {});
		this.props.onLogin(entry);
	}

	signUp() {
		this.setState({
			registering: true
		})
	}

	returnLogin() {
		this.setState({
			registering: false
		})
	}

	render() {

		if (this.state.registering) {
			var icolorclass = "login-row_icolor " + (this.state.founduser ? "icolor-reject" : "icolor-accept");
			return (
				<div className="login">
					<div className="login-row">
						<label className="login-row_label">User Name</label>
						<div className="login-row_input">
							<DebounceInput className="login-row_tbox"
								name="user"
								minLength={3}
								debounceTimeout={300}
								onChange={this.handleInputChange} />
							<div className={icolorclass}></div>
						</div>
					</div><div className="login-row">
						<label className="login-row_label">Password</label>
						<input className="login-row_input" name="password" type="password" onChange={this.handleInputChange} />
					</div><div className="login-row">
						<label className="login-row_label">Confirm Password</label>
						<input className="login-row_input" name="confirm" type="password" onChange={this.handleInputChange} />
					</div><div className="login-row">
						<button onClick={this.handleRegister} className="login-button font" type="submit" label="Create User">Register</button>
						<div className="login-text-div" onClick={this.returnLogin}>Back to Login</div>
					</div>
				</div>
			)
		}

		else {
			return (
				<div className="login">
					<div className="login-row">
						<label className="login-row_label">User Name</label>
						<DebounceInput className="login-row_input" name="user"
							minLength={3}
							debounceTimeout={300}
							onChange={this.handleInputChange} />
					</div><div className="login-row">
						<label className="login-row_label">Password</label>
						<input className="login-row_input" name="password" type="password" onChange={this.handleInputChange} />
					</div><div className="login-row">
						<button onClick={this.handleLogin} className="login-button font" type="submit">Log In</button>
						<div className="login-text-div" onClick={this.signUp}>Not Registered? Sign up!</div>
					</div>
				</div>
			)
		}
	}
}