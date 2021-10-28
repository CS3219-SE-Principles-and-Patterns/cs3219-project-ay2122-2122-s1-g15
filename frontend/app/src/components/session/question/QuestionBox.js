import React from 'react';
import ReactMarkdown from 'react-markdown'
import { Card } from "antd";
import './QuestionBox.css'

const QuestionBox = (props) => {
    return (
        <>
        <Card title="Two Sum">
            <div className="question-box"> 

                <ReactMarkdown children={props.question}/>

            </div>
        </Card>
        </>
    );
}

export default QuestionBox;