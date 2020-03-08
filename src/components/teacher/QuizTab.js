import React, { useState, useEffect } from "react";
import { Formik} from "formik";
import {fetchQuestions,getTopics,getTags} from "../../service/Request";
import { quizValidationSchema } from "../../service/Validation";
import {quizValues} from "../../service/FormProps"
import QuestionPreview from "./QuestionPreview";
import QuizForm from "./Quizform"
import QuizPreview from "./QuizPreview";
import useToggle from "../hooks/useToggle"
import Modal from "react-bootstrap/Modal";
import { uuid } from "uuidv4";

export default function QuizTab() {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [title, setTitle] = useState("");
  const [suggestions, setSuggestions] = useState();
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0)

  //Tuodaan toggle-hook komponentin käyttöön
  const {show, toggleShow, content, showQuiz, showQuestion} = useToggle();

   //Hakee aihealueet tietokannasta lomakekenttää varten
   useEffect(() => {
    getTopics().then(res => setTopics(res));
    getTags().then(res => setSuggestions(res));
  }, []);

  //Muodostetaan tietokantaan lähetettävä tag-Array (array koostuu pelkistä stringeistä)
  const tagArray = Object.values(tags && tags.map(item => item.name));

  //Tagien poistofunktio
  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  //Tagien lisäysfunktio
  const handleAddition = tag => {
    tag["id"] = uuid();
    setTags(tags => [...tags, tag]);
  };

  //Funktio, joka sulkee modaali-ikkunan ja samalla resetoi komponentin tilan
  const handleClose = () => {
    setTitle("")
    setTags([])
    toggleShow();
  };

  //Mapataan auki aiheet Formikia varten
  let topicInput = topics && topics[0] && topics.map(option => {
    return <option key={option.id} value={option.id} label={option.title} />;
  });

  //Kerätään yhteen kaikki propsit, jotka komponentin täytyy välittää lapsille.
  const formProps = {
    handleAddition: handleAddition,
    handleDelete: handleDelete,
    handleClose: handleClose,
    title:title,
    topicInput: topicInput,
    tags: tags,
    suggestions: suggestions,
    tagArray: tagArray,
    questions: questions,
    timer: timer
  }

  return (
    <>
      <div className="qFormContainer text-white">
        <h3 className="detail_header formTitle">Luo uusi tentti</h3>
        <br />
        <p>tunnuksesi on: {sessionStorage.getItem("badge")}</p>
        <div className="user">
          <Formik
            initialValues={quizValues}
            validationSchema={quizValidationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              console.log(values)
              fetchQuestions(values)
                .then(res => {
                  if (res.message) {
                    setQuestions([])
                    setMessage(res.message)}
                  else { 
                    setQuestions(res)
                    }})
                .then(() => setTags([]))
                .then(() => setTitle(values.name))
                .then(() => setTimer(values.timer))
                .then(() => showQuiz())
                .then(() => toggleShow());
              resetForm();
              setSubmitting(false);
            }}
          >
            {props => (
              <QuizForm
              {...props}
              formProps={formProps}
              toggleShow={toggleShow}
              showQuestion={showQuestion}/>
            )}
          </Formik>

          <Modal show={show} onHide={handleClose} title={title}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {content ? ("Esikatselu Quizille " + title) : ("Luo uusi kysymys ja tentti")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  {message.length > 1 && (
                    <div>{message}</div>)}
                <div className="quizPreview">
                  {content ? (<QuizPreview
                    formProps={formProps}
                  />) : (<QuestionPreview
                  formProps={formProps} />)}
                </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div>
                  <br/>
                </div>
              </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}