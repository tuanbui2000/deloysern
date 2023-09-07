import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss'
import { LANGUAGES } from '../../../utils';
import moment from 'moment';
import localization from 'moment/locale/vi'
import { getScheduleByDate } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {

    constructor (props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailbleTime: [],
            isOpenModalBooking: false,
            dataCheduleTimeModal: {}

        }
    }
    async componentDidMount() {
        let { language } = this.props
        let arrDate = this.getArrayDays(language);
        if (this.props.doctorIdfromparent) {
            let res = await getScheduleByDate(this.props.doctorIdfromparent, arrDate[0].value)
            this.setState({
                allAvailbleTime: res.data ? res.data : []

            })
        }


    
        this.setState({
            allDays: arrDate,
        })





    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let arrDate = this.getArrayDays(this.props.language);
            this.setState({
                allDays: arrDate,
            })

        }
        if (prevProps.doctorIdfromparent !== this.props.doctorIdfromparent) {
            let arrDate = this.getArrayDays(this.props.language);

            let res = await getScheduleByDate(this.props.doctorIdfromparent, arrDate[0].value)
            this.setState({
                allAvailbleTime: res.data ? res.data : []

            })
        }


    }

    getArrayDays = (language) => {
        let arrDate = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`
                    object.label = today
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi)
                }

            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`
                    object.label = today
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM');
                }

            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf()
            arrDate.push(object);
        }


        return arrDate
        // this.setState({
        //     allDays: arrDate,
        // })
    }



    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    handleOnchangeSelect = async (event) => {
        if (this.props.doctorIdfromparent && this.props.doctorIdfromparent !== -1) {

            let doctorId = this.props.doctorIdfromparent;
            let date = event.target.value;
            // console.log(doctorId, date);
            let res = await getScheduleByDate(doctorId, date)
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailbleTime: res.data ? res.data : []
                })
            }
            // console.log(res);


        }
    }


    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataCheduleTimeModal: time
        })

    }


    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }





    render() {

        // console.log()
        let { allDays, allAvailbleTime, isOpenModalBooking, dataCheduleTimeModal } = this.state
        let { language } = this.props
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className=' all-schedule'>
                        <select onChange={(event) => this.handleOnchangeSelect(event)}>
                            {allDays && allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (

                                        <option value={item.value} key={index} >{item.label}</option>
                                    )

                                })}

                        </select>
                    </div>
                    <div className='all-availble-time'>
                        <div className='text-calendar'>
                            <i className='fas fa-calendar-alt'> <span> <FormattedMessage id="patient.detail-doctor.schedule" /> </span></i>

                        </div>
                        <div className='time-content'>
                            {allAvailbleTime && allAvailbleTime.length > 0 ?
                                <><div className='time-content-btns'>


                                    {allAvailbleTime.map((item, index) => {
                                        let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                        return (
                                            <button key={index}
                                                onClick={() => this.handleClickScheduleTime(item)}
                                                className={language === LANGUAGES.VI ? "btn-vi" : "btn-en"}

                                            >{timeDisplay}</button>

                                        )
                                    })

                                    }
                                </div>
                                    <div className='book-free'>
                                        <span>
                                            < FormattedMessage id="patient.detail-doctor.book" />
                                            <i className='far fa-hand-point-up'></i>
                                            <  FormattedMessage id="patient.detail-doctor.free" />
                                        </span>
                                    </div>
                                </>
                                : <div className='no-schedule'>
                                    <FormattedMessage id="patient.detail-doctor.no-schedule" />
                                </div>
                            }

                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModalBooking={isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    dataTime={dataCheduleTimeModal}
                />
            </>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
