import Heading from "components/Heading";
import Wrapper from "components/Wrapper";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import style from "styles/CreateExamPaper.module.css";
import { API } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";

const CreateExamPaper = () => {
  const { ExamID } = useParams();

  const [selectTabIndex, setSelectTabIndex] = useState(0); //index of the tab which is show

  const [isQuestion1Open, setIsQuestion1Open] = useState([false, false]); // first index show dropdown is open or not, second index show is datafetch or not
  const [isQuestion2Open, setIsQuestion2Open] = useState([false, false]);
  const [isQuestion3Open, setIsQuestion3Open] = useState([false, false]);

  const [fetchExamData, fetchExamResult] = useLazyFetch(
    `${API}/exam/examInfor/${ExamID}`
  );

  var moduleId = 1;
  var isFinalExam = true;
  useEffect(() => {
    fetchExamData();
  }, []);

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
  // `${API}/Question/${fetchExamResult.data["moduleId"]}/3/${fetchExamResult.data["isFinalExam"]}`
  if (fetchExamResult.loading) return <Wrapper>Loading...</Wrapper>;

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
            <input className={`${style.input_box}`} type="number" />
            <br />

            <label className={`${style.input_label}`}>
              Number of level 2 question
            </label>
            <br />
            <input className={`${style.input_box}`} type="number" />
            <br />

            <label className={`${style.input_label}`}>
              Number of level 3 question
            </label>
            <br />

            <input className={`${style.input_box}`} type="number" />
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
                10 questions
              </div>
            </div>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 1 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                10 questions
              </div>
            </div>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 1 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                10 questions
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
            <input className={`${style.input_box_essay}`} type="number" />
            <label className={`${style.input_label}`}>Mark</label>
            <input className={`${style.input_box_essay}`} type="number" />
            <br />

            <label className={`${style.input_label}`}>
              Number of level 2 question
            </label>
            <br />
            <input className={`${style.input_box_essay}`} type="number" />
            <label className={`${style.input_label}`}>Mark</label>
            <input className={`${style.input_box_essay}`} type="number" />
            <br />

            <label className={`${style.input_label}`}>
              Number of level 3 question
            </label>
            <br />
            <input className={`${style.input_box_essay}`} type="number" />
            <label className={`${style.input_label}`}>Mark</label>
            <input className={`${style.input_box_essay}`} type="number" />
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
                10 questions
              </div>
            </div>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 1 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                10 questions
              </div>
            </div>
            <div className={`${style.question_number_box}`}>
              <div className={`${style.question_number_box_div}`}>Level 1 </div>
              <div
                className={`${style.question_number_box_div}`}
                style={{ fontWeight: "bold" }}
              >
                10 questions
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
              <div class="spinner-border text-primary" role="status" style={{marginLeft: "1vw"}}>
                <span class="sr-only">Loading...</span>
              </div>
            )}
            {isQuestion1Open[0] &&
              fetchQuestion1Result.data?.map((question) => {
                return (
                  <div className={`${style.question_answer_div}`}>
                    <div className={`${style.checkbox_column}`}>
                      <input type="checkbox"></input>
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
              <div class="spinner-border text-primary" role="status" style={{marginLeft: "1vw"}}>
                <span class="sr-only">Loading...</span>
              </div>
            )}
            {isQuestion2Open[0] &&
              fetchQuestion2Result.data?.map((question) => {
                return (
                  <div className={`${style.question_answer_div}`}>
                    <div className={`${style.checkbox_column}`}>
                      <input type="checkbox"></input>
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
              <div class="spinner-border text-primary" role="status" style={{marginLeft: "1vw"}}>
                <span class="sr-only">Loading...</span>
              </div>
            )}
            {isQuestion3Open[0] &&
              fetchQuestion3Result.data?.map((question) => {
                return (
                  <div className={`${style.question_answer_div}`}>
                    <div className={`${style.checkbox_column}`}>
                      <input type="checkbox"></input>
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
      </form>
    </Wrapper>
  );
};

export default CreateExamPaper;
