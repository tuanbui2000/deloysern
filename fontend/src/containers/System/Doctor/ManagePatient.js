import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss'
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatients, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay'

// import { FormattedMessage } from 'react-intl';

class ManagePatient extends Component {

    constructor (props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemdyModal: false,
            dataModal: {},
            isLoading: false
        }
    }
    componentDidMount() {
        this.getDataPatent()
    }


    getDataPatent = async () => {
        let { user } = this.props
        let { currentDate } = this.state
        let FormattedDate = new Date(currentDate).getTime();
        let res = await getAllPatients({
            doctorId: user.id,
            date: FormattedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.language !== this.props.language) {
        //     let arrDate = this.getArrayDays(this.props.language);
        //     this.setState({

        //     })
        // }



    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {

            await this.getDataPatent()

        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenRemdyModal: true,
            dataModal: data
        })

    }



    closeRemedyModal = () => {
        this.setState({
            isOpenRemdyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state
        this.setState({
            isLoading: true
        })

        let res = await postSendRemedy({
            ...dataChild,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName

        })
        if (res && res.errCode === 0) {
            this.closeRemedyModal()
            this.setState({ isLoading: false })
            toast.success('send remedy succeed')
            await this.getDataPatent()

        } else {
            this.setState({ isLoading: false })
            toast.error('Send remedy error')
            console.log("error send  remedy: ", res);
        }

    }
    render() {

        let { language } = this.props
        let { dataPatient, isOpenRemdyModal, dataModal, isLoading } = this.state
        return (
            <>

                <LoadingOverlay
                    active={isLoading}
                    spinner
                    text='Sending...'
                >

                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Quản lý bệnh nhân khám bệnh!
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label> Chọn ngày khám </label>
                                <DatePicker
                                    style={{ cursor: "pointer" }}
                                    className="form-control"
                                    onChange={this.handleOnChangeDatePicker}
                                    value={this.state.currentDate}

                                />
                            </div>
                            <div className='col-12 table-manage-patient'>

                                <table style={{ width: "100%" }} >
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>thời gian</th>
                                            <th>họ tên</th>
                                            <th>địa chỉ</th>
                                            <th>giới tính</th>
                                            <th>actions</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ? dataPatient.map((item, index) => {
                                            let gender = language === LANGUAGES.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                                            let time = language === LANGUAGES.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn
                                            return (

                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{time}</td>
                                                    <td>{item.patientData.firstName}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>{gender}</td>
                                                    <td>
                                                        <button className='confirm-btn'
                                                            onClick={() => this.handleBtnConfirm(item)}
                                                        >Xác nhận</button>

                                                    </td>
                                                </tr>
                                            )
                                        })

                                            : <tr>
                                                <td colSpan="6" style={{ textAlign: 'center' }}>no data</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>

                            </div>

                        </div>
                    </div>
                    <RemedyModal
                        dataModal={dataModal}
                        isOpenModal={isOpenRemdyModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,


    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
