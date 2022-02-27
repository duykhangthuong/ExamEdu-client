import Heading from "components/Heading";
import Wrapper from "components/Wrapper";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import style from "styles/CreateExamPaper.module.css";
import { API, REQUIRED } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import Swal from "sweetalert2";
import Loading from "pages/Loading";
import { useWindowSize } from "utilities/useWindowSize";

const CreateExamPaper = () => {
  const { ExamID } = useParams();
  const { moduleId } = useParams();
  const { isFinalExam } = useParams();

  const [selectTabIndex, setSelectTabIndex] = useState(0); //index of the tab which is show

  const [isQuestion1Open, setIsQuestion1Open] = useState([false, false]); // first index show dropdown is open or not, second index show is datafetch or not
  const [isQuestion2Open, setIsQuestion2Open] = useState([false, false]);
  const [isQuestion3Open, setIsQuestion3Open] = useState([false, false]);

  const [questionListInfor, setQuestionListInfor] = useState([]);

  const [noMCQLevel1, setNoMCQLevel1] = useState(0);
  const [noMCQLevel2, setNoMCQLevel2] = useState(0);
  const [noMCQLevel3, setNoMCQLevel3] = useState(0);

  const [noEssayLevel1, setNoEssayLevel1] = useState(0);
  const [noEssayLevel2, setNoEssayLevel2] = useState(0);
  const [noEssayLevel3, setNoEssayLevel3] = useState(0);

  const [MarkLevel1, setMarkLevel1] = useState(0);
  const [MarkLevel2, setMarkLevel2] = useState(0);
  const [MarkLevel3, setMarkLevel3] = useState(0);

  const [variantNumber, setVariantNumber] = useState(1);
  const { width, height } = useWindowSize();
  const addQuestion = (id, level, questionType) => {
    setQuestionListInfor([
      ...questionListInfor,
      {
        id: id,
        level: level,
        questionType: questionType,
      },
    ]);
  };

  const removeQuestion = (id, questionType) => {
    setQuestionListInfor(
      questionListInfor.filter(
        (question) =>
          !(question.id === id && question.questionType === questionType)
      )
    );
  };

  const [fetchdataByHand, fetchResultByHand] = useLazyFetch(
    `${API}/Exam/byHand`,
    {
      method: "POST",
      body: {
        IsFinal: isFinalExam === "true",
        VariantNumber: variantNumber,
        ExamId: ~~ExamID,
        MCQuestionByLevel: {
          1: questionListInfor
            .filter(
              (question) => question.level === 1 && question.questionType === 1
            )
            .map((question) => question.id),
          2: questionListInfor
            .filter(
              (question) => question.level === 2 && question.questionType === 1
            )
            .map((question) => question.id),
          3: questionListInfor
            .filter(
              (question) => question.level === 3 && question.questionType === 1
            )
            .map((question) => question.id),
        },
        NumberOfMCQuestionByLevel: {
          1: ~~noMCQLevel1,
          2: ~~noMCQLevel2,
          3: ~~noMCQLevel3,
        },
        NonMCQuestionByLevel: {
          1: questionListInfor
            .filter(
              (question) => question.level === 1 && question.questionType === 2
            )
            .map((question) => question.id),
          2: questionListInfor
            .filter(
              (question) => question.level === 2 && question.questionType === 2
            )
            .map((question) => question.id),
          3: questionListInfor
            .filter(
              (question) => question.level === 3 && question.questionType === 2
            )
            .map((question) => question.id),
        },
        NumberOfNonMCQuestionByLevel: {
          1: ~~noEssayLevel1,
          2: ~~noEssayLevel2,
          3: ~~noEssayLevel3,
        },
        MarkByLevel: {
          1: parseFloat(MarkLevel1),
          2: parseFloat(MarkLevel2),
          3: parseFloat(MarkLevel3),
        },
      },
      onCompletes: () => {
        Swal.fire("Success", "Exam paper created", "success");
      },
      onError: (error) => {
        Swal.fire("Error", error.message, "error");
      },
    }
  );

  const [fetchdataAuto, fetchResultAuto] = useLazyFetch(
    `${API}/Exam/autoGenerate`,
    {
      method: "POST",
      body: {
        IsFinal: isFinalExam === "true",
        VariantNumber: variantNumber,
        ExamId: ~~ExamID,
        NumberOfMCQuestionByLevel: {
          1: ~~noMCQLevel1,
          2: ~~noMCQLevel2,
          3: ~~noMCQLevel3,
        },
        NumberOfNonMCQuestionByLevel: {
          1: ~~noEssayLevel1,
          2: ~~noEssayLevel2,
          3: ~~noEssayLevel3,
        },
        MarkByLevel: {
          1: parseFloat(MarkLevel1),
          2: parseFloat(MarkLevel2),
          3: parseFloat(MarkLevel3),
        },
      },
      onCompletes: () => {
        Swal.fire("Success", "Exam paper created", "success");
      },
      onError: (error) => {
        Swal.fire("Error", error.message, "error");
      },
    }
  );

  const SubmitFormByHand = () => {
    Swal.fire("Success", "Processing", "success");
    fetchdataByHand();
  };

  const SubmitFormAuto = () => {
    Swal.fire("Success", "Processing", "success");
    fetchdataAuto();
  };

  //Question Level 1
  const [fetchQuestion1Data, fetchQuestion1Result] = useLazyFetch(
    `${API}/Question/${moduleId}/1/${isFinalExam}`
  );
  // Question Level 2
  const [fetchQuestion2Data, fetchQuestion2Result] = useLazyFetch(
    `${API}/Question/${moduleId}/2/${isFinalExam}`
  );
  // Question Level 3
  const [fetchQuestion3Data, fetchQuestion3Result] = useLazyFetch(
    `${API}/Question/${moduleId}/3/${isFinalExam}`
  );

  const loadQuestion1 = () => {
    if (isQuestion1Open[0] === false && isQuestion1Open[1] === false) {
      fetchQuestion1Data();
      setIsQuestion1Open([true, true]);
      return;
    }
    if (isQuestion1Open[0] === false && isQuestion1Open[1] === true) {
      setIsQuestion1Open([true, true]);
      console.log(fetchQuestion1Result.data);
      return;
    }
    if (isQuestion1Open[0] === true && isQuestion1Open[1] === true) {
      setIsQuestion1Open([false, true]);
      console.log(fetchQuestion1Result.data);
      return;
    }
  };

  const loadQuestion2 = () => {
    if (isQuestion2Open[0] === false && isQuestion2Open[1] === false) {
      fetchQuestion2Data();
      setIsQuestion2Open([true, true]);
      return;
    }
    if (isQuestion2Open[0] === false && isQuestion2Open[1] === true) {
      setIsQuestion2Open([true, true]);
      console.log(fetchQuestion2Result.data);
      return;
    }
    if (isQuestion2Open[0] === true && isQuestion2Open[1] === true) {
      setIsQuestion2Open([false, true]);
      console.log(fetchQuestion2Result.data);
      return;
    }
  };

  const loadQuestion3 = () => {
    if (isQuestion3Open[0] === false && isQuestion3Open[1] === false) {
      fetchQuestion3Data();
      setIsQuestion3Open([true, true]);
      return;
    }
    if (isQuestion3Open[0] === false && isQuestion3Open[1] === true) {
      setIsQuestion3Open([true, true]);
      console.log(fetchQuestion3Result.data);
      return;
    }
    if (isQuestion3Open[0] === true && isQuestion3Open[1] === true) {
      setIsQuestion3Open([false, true]);
      console.log(fetchQuestion3Result.data);
      return;
    }
  };
  if(width < 1400)
    return <Wrapper>Not support small screen</Wrapper>
  // `${API}/Question/${fetchExamResult.data["moduleId"]}/3/${fetchExamResult.data["isFinalExam"]}`
  return (
    <Wrapper className={style.wrapper}>
      <Heading className="d-none d-md-block">
        Create Exam - Add question
      </Heading>
      <button
        className={`${style.butn} ${selectTabIndex === 0 && style.btn_picked}`}
        onClick={() => setSelectTabIndex(0)}
      >
        Set number MCQuestion
      </button>
      <button
        className={`${style.butn} ${selectTabIndex === 1 && style.btn_picked}`}
        onClick={() => setSelectTabIndex(1)}
      >
        Set number essay Question
      </button>
      <button
        className={`${style.butn} ${selectTabIndex === 2 && style.btn_picked}`}
        onClick={() => setSelectTabIndex(2)}
      >
        Pick Question
      </button>
      <form>
        {/* set Number MCQuestion */}
        <div className={`${style.tab} ${selectTabIndex !== 0 && style.hide}`}>
          {/* left div */}
          <div className={`${style.column_left}`}>
            <label className={`${style.input_label}`}>
              Number of level 1 question
            </label>
            <br />
            <input
              className={`${style.input_box}`}
              type="number"
              onChange={(e) => setNoMCQLevel1(e.target.value)}
            />
            <br />

            <label className={`${style.input_label}`}>
              Number of level 2 question
            </label>
            <br />
            <input
              className={`${style.input_box}`}
              type="number"
              onChange={(e) => setNoMCQLevel2(e.target.value)}
            />
            <br />

            <label className={`${style.input_label}`}>
              Number of level 3 question
            </label>
            <br />

            <input
              className={`${style.input_box}`}
              type="number"
              onChange={(e) => setNoMCQLevel3(e.target.value)}
            />
            <br />
          </div>
          {/* right div */}
          <div className={`${style.column_right}`}>
            <h5 className={`${style.title}`}>Question selected</h5>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 1 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                {
                  questionListInfor.filter(
                    (question) =>
                      question.level === 1 && question.questionType === 1
                  ).length
                }{" "}
                questions
              </div>
            </div>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 2 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                {
                  questionListInfor.filter(
                    (question) =>
                      question.level === 2 && question.questionType === 1
                  ).length
                }{" "}
                questions
              </div>
            </div>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 3 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                {
                  questionListInfor.filter(
                    (question) =>
                      question.level === 3 && question.questionType === 1
                  ).length
                }{" "}
                questions
              </div>
            </div>
          </div>
        </div>

        {/* set Number essay */}
        <div className={`${style.tab} ${selectTabIndex !== 1 && style.hide}`}>
          {/* left div */}
          <div className={`${style.column_left}`}>
            <label className={`${style.input_label}`}>
              Number of level 1 question
            </label>
            <br />
            <input
              className={`${style.input_box_essay}`}
              type="number"
              onChange={(e) => setNoEssayLevel1(e.target.value)}
            />
            <label className={`${style.input_label}`}>Mark</label>
            <input
              className={`${style.input_box_essay}`}
              type="number"
              onChange={(e) => setMarkLevel1(e.target.value)}
            />
            <br />

            <label className={`${style.input_label}`}>
              Number of level 2 question
            </label>
            <br />
            <input
              className={`${style.input_box_essay}`}
              type="number"
              onChange={(e) => setNoEssayLevel2(e.target.value)}
            />
            <label className={`${style.input_label}`}>Mark</label>
            <input
              className={`${style.input_box_essay}`}
              type="number"
              onChange={(e) => setMarkLevel2(e.target.value)}
            />
            <br />

            <label className={`${style.input_label}`}>
              Number of level 3 question
            </label>
            <br />
            <input
              className={`${style.input_box_essay}`}
              type="number"
              onChange={(e) => setNoEssayLevel3(e.target.value)}
            />
            <label className={`${style.input_label}`}>Mark</label>
            <input
              className={`${style.input_box_essay}`}
              type="number"
              onChange={(e) => setMarkLevel3(e.target.value)}
            />
            <br />
          </div>
          {/* right div */}
          <div className={`${style.column_right}`}>
            <h5 className={`${style.title}`}>Question selected</h5>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 1 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                {
                  questionListInfor.filter(
                    (question) =>
                      question.level === 1 && question.questionType === 2
                  ).length
                }{" "}
                questions
              </div>
            </div>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 1 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                {
                  questionListInfor.filter(
                    (question) =>
                      question.level === 2 && question.questionType === 2
                  ).length
                }{" "}
                questions
              </div>
            </div>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 1 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                {
                  questionListInfor.filter(
                    (question) =>
                      question.level === 3 && question.questionType === 2
                  ).length
                }{" "}
                questions
              </div>
            </div>
          </div>
        </div>
        {/* question bank tab */}
        <div
          className={`${style.questionbank_tab} ${
            selectTabIndex !== 2 && style.hide
          }`}
        >
          <div style={{ margin: "0 auto" }}>
            <div
              className={`${style.dropdown_title} `}
              onClick={() => loadQuestion1()}
            >
              <div className={`${style.dropdown_title_div}`}>
                level 1 Question
              </div>
              <div
                className={`${style.dropdown_title_div_down_Arrow} dropdown-toggle`}
              ></div>
            </div>
            <br />

            {/* question bank */}
            {fetchQuestion1Result.loading && (
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ marginLeft: "1vw" }}
              >
                <span className="sr-only">Loading...</span>
              </div>
            )}
            {isQuestion1Open[0] &&
              fetchQuestion1Result.data?.map((question) => {
                return (
                  <div className={`${style.question_answer_div}`}>
                    <div className={`${style.checkbox_column}`}>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            addQuestion(
                              question.questionId,
                              1,
                              question.questionTypeID
                            );
                          } else {
                            removeQuestion(
                              question.questionId,
                              question.questionTypeID
                            );
                          }
                        }}
                      ></input>
                    </div>
                    <div className={`${style.question_column}`}>
                      <div className={`${style.question_content_div}`}>
                        {question.questionContent}
                      </div>
                      {question.questionImageURL != null && (
                        <img
                          className={`${style.question_img}`}
                          src={question.questionImageURL}
                        ></img>
                      )}
                      {question.answers.map((answer) => {
                        return (
                          <div
                            className={`${style.anwer_content_div} ${
                              answer.isCorrect && style.blue_color_text
                            }`}
                          >
                            {answer.answerContent}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            <div
              className={`${style.dropdown_title}`}
              onClick={() => loadQuestion2()}
            >
              <div className={`${style.dropdown_title_div}`}>
                level 2 Question
              </div>
              <div
                className={`${style.dropdown_title_div_down_Arrow} dropdown-toggle`}
              ></div>
            </div>
            <br />
            {/* question bank */}
            {fetchQuestion2Result.loading && (
              <div
                class="spinner-border text-primary"
                role="status"
                style={{ marginLeft: "1vw" }}
              >
                <span class="sr-only">Loading...</span>
              </div>
            )}
            {isQuestion2Open[0] &&
              fetchQuestion2Result.data?.map((question) => {
                return (
                  <div className={`${style.question_answer_div}`}>
                    <div className={`${style.checkbox_column}`}>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            addQuestion(
                              question.questionId,
                              2,
                              question.questionTypeID
                            );
                          } else {
                            removeQuestion(
                              question.questionId,
                              question.questionTypeID
                            );
                          }
                        }}
                      ></input>
                    </div>
                    <div className={`${style.question_column}`}>
                      <div className={`${style.question_content_div}`}>
                        {question.questionContent}
                      </div>
                      {question.questionImageURL != null && (
                        <img
                          className={`${style.question_img}`}
                          src={question.questionImageURL}
                        ></img>
                      )}
                      {question.answers.map((answer) => {
                        return (
                          <div
                            className={`${style.anwer_content_div} ${
                              answer.isCorrect && style.blue_color_text
                            }`}
                          >
                            {answer.answerContent}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            <div
              className={`${style.dropdown_title}`}
              onClick={() => loadQuestion3()}
            >
              <div className={`${style.dropdown_title_div}`}>
                level 3 Question
              </div>
              <div
                className={`${style.dropdown_title_div_down_Arrow} dropdown-toggle`}
              ></div>
              <br />
              {/* question bank */}
            </div>
            <br />
            {fetchQuestion3Result.loading && (
              <div
                class="spinner-border text-primary"
                role="status"
                style={{ marginLeft: "1vw" }}
              >
                <span class="sr-only">Loading...</span>
              </div>
            )}
            {isQuestion3Open[0] &&
              fetchQuestion3Result.data?.map((question) => {
                return (
                  <div className={`${style.question_answer_div}`}>
                    <div className={`${style.checkbox_column}`}>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            addQuestion(
                              question.questionId,
                              3,
                              question.questionTypeID
                            );
                          } else {
                            removeQuestion(
                              question.questionId,
                              question.questionTypeID
                            );
                          }
                        }}
                      ></input>
                    </div>
                    <div className={`${style.question_column}`}>
                      <div className={`${style.question_content_div}`}>
                        {question.questionContent}
                      </div>
                      {question.questionImageURL != null && (
                        <img
                          className={`${style.question_img}`}
                          src={question.questionImageURL}
                        ></img>
                      )}
                      {question.answers.map((answer) => {
                        return (
                          <div
                            className={`${style.anwer_content_div} ${
                              answer.isCorrect && style.blue_color_text
                            }`}
                          >
                            {answer.answerContent}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <label style={{ color: "#3D5AF1", fontSize: "20px" }}>Variant</label>
        <input
          type="number"
          className={`${style.input_box}`}
          onChange={(e) => setVariantNumber(e.target.value)}
        />
        <br></br>
        <button
          style={{ marginRight: "31rem" }}
          className={`${style.btn_submit}`}
          onClick={(e) => {
            SubmitFormAuto();
            e.preventDefault();
          }}
        >
          Random From Question Bank
        </button>
        <button
          onClick={(e) => {
            SubmitFormByHand();
            e.preventDefault();
          }}
          className={`${style.btn_submit}`}
        >
          Create From Picked Question
        </button>
      </form>
      <label>Variant</label>
      <input type="number" onChange={(e) => setVariantNumber(e.target.value)} />
    </Wrapper>
  );
};

export default CreateExamPaper;
