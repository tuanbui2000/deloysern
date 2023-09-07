import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageHandbook.scss'
// import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from "../../../utils";
import { createNewHandbook } from "../../../services/userService"
import { toast } from 'react-toastify';



const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageHandbook extends Component {

    constructor (props) {
        super(props);
        this.state = {
            imageBase64: '',
            name: '',
            hanbookContentHTML: '',
            hanbookContentMarkdown: '',
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
            hanbookContentHTML: html,
            hanbookContentMarkdown: text,
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



    handleSaveHandbook = async () => {
     



       let res = await   createNewHandbook(this.state)
    //    console.log("check before save",this.state);
        if (res && res.errCode === 0) {
            toast.success("Save specialty cusseed!") 
            this.setState({
                imageBase64: '',
                name: '',
                hanbookContentHTML: '',
                hanbookContentMarkdown: '',
            })
        } else {
            toast.error("Save specialty failed!")
        }
    
    }




    render() {


        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'> Quản lý Cẩm nang              </div>


                <div className='add-new-specialty row'>

                    <div className=' col-6 form-group'>
                        <label> Tên cẩm nang</label>
                        <input type='text' className='form-control'
                            value={this.state.name}
                            onChange={(event) => this.handleOnchangeInput(event, 'name')}
                        />
                    </div>
                    <div className=' col-6 form-group'>
                        <label> upload ảnh cẩm nang</label>
                        <input type='file' className='form-control-file' 
                            onChange={(event) => this.handleOnchangeImage(event)}
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
                        <button className='btn-save-handbook'
                            onClick={() => this.handleSaveHandbook()}

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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
