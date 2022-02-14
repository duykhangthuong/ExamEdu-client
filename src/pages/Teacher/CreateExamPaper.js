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

  const [isQuestion1Open, setIsQuestion1Open] = useState([false,false]) // first index show dropdown is open or not, second index show is datafetch or not
  const [isQuestion2Open, setIsQuestion2Open] = useState([false,false])
  const [isQuestion3Open, setIsQuestion3Open] = useState([false,false])

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
    if(isQuestion1Open[0] === false && isQuestion1Open[1] === false){
      fetchQuestion1Data();
      setIsQuestion1Open([true,true]);
      return;
    }
    if(isQuestion1Open[0] === false && isQuestion1Open[1] === true){
      setIsQuestion1Open([true,true]);
      console.log(fetchQuestion1Result.data);
      return;
    }
  }
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
            <div className={`${style.dropdown_title} `} onClick={() => loadQuestion1()}>
              <div className={`${style.dropdown_title_div}`}>
                level 1 Question
              </div>
              <div
                className={`${style.dropdown_title_div_down_Arrow} dropdown-toggle`}
              ></div>
            </div>
            <br />
            {/* question bank */}
            {fetchQuestion1Result.data?.map((question) => {
                    return (
                        <div>
                          <div>{question.questionContent}</div>
                          {question.questionImageURL != null && 
                          <img src={question.questionImageURL}></img>}
                        </div>
                    );
                })}
              
            <div className={`${style.dropdown_title}`}>
            <div className={`${style.dropdown_title_div}`}>
                level 2 Question
              </div>
              <div
                className={`${style.dropdown_title_div_down_Arrow} dropdown-toggle`}
              ></div>
            </div>
            <br />
            
            <div className={`${style.dropdown_title}`}>
            <div className={`${style.dropdown_title_div}`}>
                level 3 Question
              </div>
              <div
                className={`${style.dropdown_title_div_down_Arrow} dropdown-toggle`}
              ></div>
            </div>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default CreateExamPaper;
