import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./UserManage.scss"
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from "../../services/userService"
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';


class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        await this.getAllUserFromReact();


    }

    getAllUserFromReact = async () => {
        let response = await getAllUsers('ALL');
        // console.log('get user  from nodejs: ', response);
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })

        }

    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }
    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }
    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    //create new user
    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            console.log(response);
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            } else {
                await this.getAllUserFromReact()
                this.setState({
                    isOpenModalUser: false
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (e) {

            console.log(e);
        }

    }


    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await this.getAllUserFromReact();
            }
            else {
                console.log(res.errMessage);
            }
        } catch (error) {
            console.log(error)

        }
        //edit user


    }

    handleEditUser = (user) => {
        // console.log('check edit user', user);
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })

    }


    doEditUser = async (user) => {

try {
    let res = await editUserService(user)
    if (res && res.errCode===0) {
        this.setState({
            isOpenModalEditUser: false,
        })
        this.getAllUserFromReact()
        
    }else{
        alert(res.errCode)
    }
    
} catch (error) {
    console.log(error);
}

    }

    render() {
        let arrUsers = this.state.arrUsers;
        // console.log('check render', this.state);
        return (
            <div className="user-container">
                <ModalUser

                    isOpen={this.state.isOpenModalUser}
                    toggleFormParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&

                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFormParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    //   createNewUser={this.createNewUser}
                    />
                }
                <div className='title text-center'>manage users</div>
                <div className='mx-1'>
                    <button
                        className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewUser()}>
                        <i className="fas fa-plus"></i> Add new users</button>
                </div>


                <div className='user-table mt-3 mx-1'>
                    <table id="customers">
                        <tbody>

                            <tr>
                                <th>Email</th>
                                <th>FirstName</th>
                                <th>LastName</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                            {arrUsers && arrUsers.map((item, index) => {
                                // console.log('check map: ', item, index);
                                return (
                                    <tr key={index}>

                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                      





                                    </tr>
                                )
                            })}

                        </tbody>
                    </table></div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
