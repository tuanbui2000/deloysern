import React, { Component } from 'react';
import { connect } from "react-redux";
import './VerifyEmail.scss'
import HomeHeader from '../HomePage/HomeHeader';
// import { FormattedMessage } from 'react-intl';
import { verifyBookAppointment } from '../../services/userService';

class VerifyEmail extends Component {

    constructor (props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0
        }
    }
    async componentDidMount() {

        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            // console.log("checktoken and id", token, doctorId);
            let res = await verifyBookAppointment({
                token: token,
                doctorId: doctorId
            })

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }



    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.language !== this.props.language) {
        //     let arrDate = this.getArrayDays(this.props.language);
        //     this.setState({

        //     })
        // }



    }


    render() {
        let { statusVerify, errCode } = this.state

        return (
            <>
                <HomeHeader />



                <div className='verify-booking-container'>
                    {statusVerify === false ?
                        <div className='container'>Loading...  </div> :
                        <div>

                            {+errCode === 0 ?
                                <div className='info-booking'>Xác nhận lịch hẹn thành công!!!!</div> :
                                <div className='info-booking'>Lịch hẹn không tồn tại hoặc đã được xác nhận !!!!</div>
                            }
                        </div>

                    }

                </div>

            </>


        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,


    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
