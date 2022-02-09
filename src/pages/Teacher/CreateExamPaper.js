import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const CreateExamPaper = () => {
    const {ExamID} = useParams();

    return(
        <div>testttttttttttttttttttttttttttttttttt {ExamID}</div>
    )
}

export default CreateExamPaper;