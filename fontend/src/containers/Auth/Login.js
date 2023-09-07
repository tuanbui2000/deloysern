import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
// import { FormattedMessage } from 'react-intl';
// import { divide } from 'lodash';
import { handleLoginApi } from '../../services/userService'

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassWord: false,
            errMessage: ''
        }
    }

    handleOnchangeUserName = (event) => {
        this.setState({
            username: event.target.value
        })

    }


    handleOnchangePassWord = (event) => {
        this.setState({
            password: event.target.value
        })
    }


    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })


        // console.log(this.state);
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            } if (data && data.errCode === 0) {
                //todo
                this.props.userLoginSuccess(data.user)
                // console.log("login succeed!!!!");


            }

        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })

                }
            }
        }


    }


    handleShowHiidePassWord = () => {
        this.setState({
            isShowPassWord: !this.state.isShowPassWord
        })
    }

    handleKeyDown = (event) => {
        if (event.key === "Enter" || event.keyCode === 13) {
            this.handleLogin();
        }
    }

    render() {

        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content' >
                        <div className='col-12  text-login'>Login</div>
                        <div className='col-12 form-group login-input' >
                            <label>UserName:</label>
                            <input type='text' className='form-control' placeholder='Enter your username '
                                value={this.state.username} onChange={(event) => this.handleOnchangeUserName(event)} />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>


                            <div className='custom-input-password'>

                                <input type={
                                    this.state.isShowPassWord ? 'text' : 'password'
                                }
                                    className='form-control' placeholder='Enter your password'
                                    onChange={(event) => this.handleOnchangePassWord(event)}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                />
                                <span
                                    onClick={() => { this.handleShowHiidePassWord() }}
                                > <i className={this.state.isShowPassWord ? "far fa-eye" : "far fa-eye-slash"}></i> </span>

                            </div>

                        </div>

                        <div className='col-12' style={{ color: 'red' }}>{this.state.errMessage}</div>

                        <div className='col-12'>
                            <button className='btn-login' onClick={() => {
                                this.handleLogin()
                            }}>Login</button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>forgot your password</span>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            <span className='text-other-login'>Or login with</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fab fa-google-plus-g google"></i>
                            <i className="fab fa-facebook-f facebook"></i>
                        </div>
                    </div>

                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        //   userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);