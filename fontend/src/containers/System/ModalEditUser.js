import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, } from 'reactstrap';
import _ from "lodash"

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''

        }
    }

    componentDidMount() {
        let user = this.props.currentUser;
        // same let {currentUser} = this.props

        if (user && !_.isEmpty(user)) {
            this.setState({
                id:user.id,
                email: user.email,
                password: 'dfasd',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address
            })
        }
        // console.log('mouting edit modal', this.props.currentUser);


    }

    toggle = () => {
        this.props.toggleFormParent();
    }


    handleOnChangeInput = (event, id) => {

        //good code
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
        // console.log(this.state);
    }






    checkValidateInput() {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            // console.log('check inside loop', this.state[arrInput[i]], arrInput[i]);
            // console.log('check misssinggg param', this.state);
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameters: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput()
        if (isValid === true) {
            //call API 
            this.props.editUser(this.state);
            // console.log('data modal ', this.state);
        }

    }


    render() {
  
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={"modal-user-container"}
                size='lg'
            >
                <ModalHeader toggle={() => { this.toggle() }}> Edit user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div
                            className='input-container'>
                            <label>Email</label>
                            <input type='email' onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                value={this.state.email} disable />
                        </div>
                        <div
                            className='input-container'>
                            <label>password</label>
                            <input type='password'
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "password")
                                }}
                                value={this.state.password} disable />
                        </div>
                        <div
                            className='input-container'>
                            <label>first Name</label>
                            <input
                                type='text'
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "firstName")
                                }}
                                value={this.state.firstName} />
                        </div>
                        <div
                            className='input-container'>
                            <label>Last Name</label>
                            <input
                                type='text'
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "lastName")
                                }}
                                value={this.state.lastName} />
                        </div>
                        <div
                            className='input-container max-width-input'>
                            <label>address</label>
                            <input type='text'
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "address")
                                }}
                                value={this.state.address} />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className=' px-3' color="primary" onClick={() => { this.handleSaveUser() }}>
                        Save changes
                    </Button>{' '}
                    <Button className=' px-3' color="secondary" onClick={() => { this.toggle() }}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>


        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
