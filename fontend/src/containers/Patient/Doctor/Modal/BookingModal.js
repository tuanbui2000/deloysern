import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss'
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientAppointment } from '../../../../services/userService'
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment/moment';

class BookingModal extends Component {

    constructor (props) {
        super(props);
        this.state = {
            vailedEmail: true,
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            genders: '',
            selectedGenders: '',
            doctorId: '',
            timeType: "",
            vailedName: true
        }
    }
    async componentDidMount() {

        this.props.getGenderStart()


    }

    buildDataGender = (data) => {
        let result = [];
        let { language } = this.props
        if (data && data.length > 0) {
            data.map(item => {
                let object = {}
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap
                result.push(object)
            })
        }
        return result

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (prevProps.genders !== this.props.genders) {

            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (prevProps.dataTime !== this.props.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId
                let timeType = this.props.dataTime.timeType

                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }



    }


    checkVailedInput = (input) => {
        let regex = new RegExp("^[a-zA-Z ]+$");
        return (regex.test(input))

    }

    validateEmail = (email) => {
        let regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");

        return (regex.test(email))
    };



    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let copyState = { ...this.state };


        copyState[id] = valueInput
        this.setState({
            ...copyState
        })
    }




    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }



    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGenders: selectedOption });

    }




    handleConfirmBooking = async () => {
        let date = new Date(this.state.birthday).getTime()
        let timeString = this.buildTimeBooking(this.props.dataTime)
        let doctorName = this.buildDoctorName(this.props.dataTime)
        let vailedName = this.checkVailedInput(this.state.fullName)
        let validatedEmail = this.validateEmail(this.state.email)
        this.setState({
            vailedName: vailedName,
            vailedEmail: validatedEmail
        })


        if (validatedEmail && vailedName) {
            let res = await postPatientAppointment({
                fullName: this.state.fullName,
                phoneNumber: this.state.phoneNumber,
                email: this.state.email,
                address: this.state.address,
                reason: this.state.reason,
                date: this.props.dataTime.date,
                birthday: date,
                selectedGenders: this.state.selectedGenders.value,
                doctorId: this.state.doctorId,
                timeType: this.state.timeType,
                language: this.props.language,
                timeString: timeString,
                doctorName: doctorName
            })
            if (res && res.errCode === 0) {
                toast.success("Booking a new appointment succeed!")
                this.props.closeBookingModal()
            } else {
                toast.error("Booking a new appointment failed!")
            }
            console.log(this.state);
        }
    }


    buildTimeBooking = (dataTime) => {
        let { language } = this.props

        if (dataTime && !_.isEmpty(dataTime)) {

            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn


            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd-MM/DD/YYYY')

            return (`${time} - ${date}`)
        }
        return <></>

    }
    buildDoctorName = (dataTime) => {
        let { language } = this.props

        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                ` ${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name
        }
        return ''
    }

    render() {
        let { isOpenModalBooking, closeBookingModal, dataTime, language } = this.props;
        let { vailedEmail, vailedName } = this.state
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId
        }
        return (
            <Modal isOpen={isOpenModalBooking}
                size='lg'
                className='booking-modal-container'
                centered
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'> <FormattedMessage id="patient.booking-modal.title" /></span>
                        <span

                            onClick={closeBookingModal}
                            className='right'><i className='fas fa-times'></i> </span>
                    </div>
                    <div className='booking-modal-body'>


                        {/* {JSON.stringify(dataTime)} */}
                        <div className='doctor-info'>
                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescriptionDoctor={false}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>  <FormattedMessage id="patient.booking-modal.fullName" />

                                    {!vailedName && language === LANGUAGES.VI &&
                                        <span style={{ color: "red" }}>&#10071; Tên không hợp lệ</span>
                                    }
                                    {!vailedName && language === LANGUAGES.EN &&
                                        <span style={{ color: "red" }}>&#10071; Name is not vailed</span>

                                    }



                                </label>
                                <input className='form-control' value={this.state.fullName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                />

                            </div>
                            <div className='col-6 form-group'>
                                <label> <FormattedMessage id="patient.booking-modal.phoneNumber" />   </label>
                                <input className='form-control' value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')} />
                            </div>
                            <div className='col-6 form-group'>
                                <label> <FormattedMessage id="patient.booking-modal.email" />
                                    {!vailedEmail && language === LANGUAGES.VI &&
                                        <span style={{ color: "red" }}>&#10071; Email không hợp lệ</span>
                                    }
                                    {!vailedEmail && language === LANGUAGES.EN &&
                                        <span style={{ color: "red" }}>&#10071; Email is not vailed</span>

                                    }

                                </label>
                                <input type='email' className='form-control' value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')} />
                            </div>
                            <div className='col-6 form-group'>
                                <label> <FormattedMessage id="patient.booking-modal.address" /></label>
                                <input className='form-control' value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')} />
                            </div>
                            <div className='col-12 form-group'>
                                <label> <FormattedMessage id="patient.booking-modal.reason" /></label>
                                <input className='form-control' value={this.state.reason}
                                    onChange={(event) => this.handleOnChangeInput(event, 'reason')} />

                            </div>
                            <div className='col-6 form-group'>
                                <label> <FormattedMessage id="patient.booking-modal.birthday" /></label>
                                <DatePicker
                                    className="form-control"
                                    onChange={this.handleOnChangeDatePicker}
                                    value={this.state.birthday}
                                // minDate={yesterday}

                                />

                            </div>
                            <div className='col-6 form-group'>
                                <label> <FormattedMessage id="patient.booking-modal.gender" /></label>
                                <Select
                                    value={this.state.selectedGenders}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                />
                            </div>

                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button onClick={() => this.handleConfirmBooking()}
                            className='btn-booking-confirm'
                        ><FormattedMessage id="patient.booking-modal.btn-confirm" />
                        </button>
                        <button onClick={closeBookingModal}
                            className='btn-booking-cancel'>
                            <FormattedMessage id="patient.booking-modal.btn-cancel" />
                        </button>
                    </div>
                </div>


            </Modal >
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,


    };
};

const mapDispatchToProps = dispatch => {
    return {

        getGenderStart: () => dispatch(actions.fetchGenderStart()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
