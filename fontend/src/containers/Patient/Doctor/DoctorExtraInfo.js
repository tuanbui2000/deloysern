import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfo.scss'
import { LANGUAGES } from '../../../utils';
import { getExtraInfoDoctorById } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';

class DoctorExtraInfo extends Component {

    constructor (props) {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfor: {}
        }
    }
    async componentDidMount() {
if( this.props.doctorIdfromparent){
        let res = await getExtraInfoDoctorById(this.props.doctorIdfromparent);
        // console.log("chjeckk", res.data);
        if (res && res.errCode === 0) {
            this.setState({
                extraInfor: res.data
            })
        }
    }




    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.language !== this.props.language) {
        //     let arrDate = this.getArrayDays(this.props.language);
        //     this.setState({
        //         allDays: arrDate,
        //     })
        // }



        if (prevProps.doctorIdfromparent !== this.props.doctorIdfromparent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdfromparent);
            // console.log("chjeckk", res.data);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }

        }


    }


    showHideDetaiInfo = (status) => {
        this.setState({
            isShowDetailInfo: status
        })
    }

    render() {


        let { language } = this.props
        let { isShowDetailInfo, extraInfor } = this.state
        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'> <FormattedMessage id='patient.extra-info-doctor.text-address' /></div>
                    <div className='name-clinic'> {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}</div>
                    <div className='detail-address' > {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}</div>
                </div>
                <div className='content-down'>

                    {isShowDetailInfo === false &&

                        <div className='short-info'>
                            <FormattedMessage id='patient.extra-info-doctor.price' />
                            {extraInfor && extraInfor.priceData && language === LANGUAGES.VI &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfor.priceData.valueVi}
                                    suffix="VND"
                                    displayType="text"
                                    thousandSeparator=","
                                />
                            }

                            {extraInfor && extraInfor.priceData && language === LANGUAGES.EN &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfor.priceData.valueEn}
                                    suffix="$"
                                    displayType="text"
                                    thousandSeparator=","
                                />
                            }


                            <span className='detail' onClick={() => this.showHideDetaiInfo(true)}                       >
                                <FormattedMessage id='patient.extra-info-doctor.detail' /> </span> </div>

                    }{isShowDetailInfo === true &&
                        <>
                            <div className='title-price'> <FormattedMessage id='patient.extra-info-doctor.price' /></div>
                            <div className='detail-info'>
                                <div className='price'>
                                    <span className='left' ><FormattedMessage id='patient.extra-info-doctor.price' /></span>
                                    <span className='rigt'>{extraInfor && extraInfor.priceData && language === LANGUAGES.VI &&
                                        <NumberFormat
                                            className='currency'
                                            value={extraInfor.priceData.valueVi}
                                            suffix="VND"
                                            displayType="text"
                                            thousandSeparator=","
                                        />
                                    }

                                        {extraInfor && extraInfor.priceData && language === LANGUAGES.EN &&
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfor.priceData.valueEn}
                                                suffix="$"
                                                displayType="text"
                                                thousandSeparator=","
                                            />
                                        }</span>
                                </div>

                                <div className='note'> {extraInfor && extraInfor.note ? extraInfor.note : ''} </div>

                            </div>

                            <div className='payment'>
                                <FormattedMessage id='patient.extra-info-doctor.payment' />
                                {extraInfor && extraInfor.paymentData && LANGUAGES.VI === language ? extraInfor.paymentData.valueVi : ''}
                                {extraInfor && extraInfor.paymentData && LANGUAGES.EN === language ? extraInfor.paymentData.valueEn : ''}
                            </div>


                            <div className='hide-price'>
                                <span onClick={() => this.showHideDetaiInfo(false)}  >
                                    <FormattedMessage id='patient.extra-info-doctor.hide-price' />
                                </span>
                            </div>
                        </>
                    }


                </div>



            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
