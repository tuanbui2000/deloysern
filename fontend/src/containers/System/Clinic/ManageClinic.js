import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageClinic.scss'
// import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from "../../../utils";
import { createNewClinic } from "../../../services/userService"
import { toast } from 'react-toastify';



const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {

    constructor (props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            address:''
        }
    }
    async componentDidMount() {









    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.language !== this.props.language) {
        //     let arrDate = this.getArrayDays(this.props.language);
        //     this.setState({

        //     })
        // }



    }



    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })

    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        }
        )
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);

            this.setState({
                imageBase64: base64,
            })
        }
    }



    handleSaveClinic = async () => {


       let res = await   createNewClinic(this.state)
        if (res &&res.errCode===0) {
            toast.success("Save clinic cusseed!") 
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        } else {
            toast.error("Save clinic failed!")
        }
    }
    render() {


        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'> Quản lý phòng khám    </div>


                <div className='add-new-specialty row'>

                    <div className=' col-6 form-group'>
                        <label> Tên phòng khám</label>
                        <input type='text' className='form-control'
                            value={this.state.name}
                            onChange={(event) => this.handleOnchangeInput(event, 'name')}
                        />
                    </div>
                    <div className=' col-6 form-group'>
                        <label> upload ảnh phòng khám</label>
                        <input type='file' className='form-control-file' 
                            onChange={(event) => this.handleOnchangeImage(event)}
                        />
                    </div>
                    <div className=' col-6 form-group'>
                        <label> Địa chỉ phòng khám</label>
                        <input type='text' className='form-control'
                            value={this.state.address}
                            onChange={(event) => this.handleOnchangeInput(event, 'address')}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor style={{ height: '400px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={() => this.handleSaveClinic()}

                        >save </button>
                    </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
