import React, { Component } from 'react';
import { connect } from "react-redux";
import './ProfileDoctor.scss'
import { FormattedMessage } from 'react-intl';
import { getProfileDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment/moment';
import {Link} from 'react-router-dom'

class ProfileDoctor extends Component {

    constructor (props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }
    async componentDidMount() {

        let data = await this.getInfoDoctor(this.props.doctorId)
        // console.log("log data", data);
        this.setState({
            dataProfile: data
        })



    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.language !== this.props.language) {
        //     let arrDate = this.getArrayDays(this.props.language);
        //     this.setState({
        //     })
        // }
        if (prevProps.doctorId !== this.props.doctorId) {
            // this.getInfoDoctor(this.props.doctorId)

        }

    }


    getInfoDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result;
    }

    renderTimeBooking = (dataTime) => {
        // console.log(dataTime);
        let { language } = this.props
        let time = language === LANGUAGES.VI ?
            dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
        if (dataTime && !_.isEmpty(dataTime)) {
            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd-MM/DD/YYYY')

            return (
                <>
                    <div>{time} {date}     </div>
                    <div>  <FormattedMessage id="patient.booking-modal.priceBooking" />     </div>
                </>
            )
        }
        return <></>

    }

    render() {
        // console.log(this.state.dataProfile);
        let { dataProfile } = this.state
        let { language, isShowDescriptionDoctor, dataTime, isShowPrice, isShowLinkDetail, doctorId } = this.props
        let nameVi = '';
        let nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left'
                        style={{ backgroundImage: `url(${dataProfile.image ? dataProfile.image : ''})` }}

                    > </div>
                    <div className='content-right'>

                        <div className='up'>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description &&

                                        <span>
                                            {dataProfile.Markdown.description}

                                        </span>

                                    }
                                </> :
                                <>
                                    {this.renderTimeBooking(dataTime)}

                                </>
                            }
                        </div>


                    </div>

                </div>

                {isShowLinkDetail === true && <div className='view-detai-doctor'>
                    <Link to={`/detail-doctor/${doctorId}`}> Xem thêm</Link>
                    

                   

                    
                </div>}

                {isShowPrice  === true && 

                    <div className='price'>
                        <FormattedMessage id="patient.booking-modal.price" />
                        {dataProfile && dataProfile.Doctor_infor && language === LANGUAGES.VI ?
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_infor.priceData.valueVi}
                                suffix="VND"
                                displayType="text"
                                thousandSeparator=","
                            /> : ''}
                        {dataProfile && dataProfile.Doctor_infor && language === LANGUAGES.EN ?
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_infor.priceData.valueEn}
                                suffix="$"
                                displayType="text"
                                thousandSeparator=","
                            /> : ''}
                    </div>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
