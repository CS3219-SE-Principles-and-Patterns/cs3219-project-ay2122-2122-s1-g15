import React from 'react';
import ReactMarkdown from 'react-markdown'
import { Card } from "antd";
import './QuestionBox.css'

const QuestionBox = (props) => {
    return (
        <>
        <Card title={props?.question?.title}>
            <div className="question-box">

                <ReactMarkdown children={props?.question?.markdown}/>

            </div>
        </Card>
        </>
    );
}

export default QuestionBox;
