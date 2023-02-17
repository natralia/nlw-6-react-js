import { useNavigate, useParams } from 'react-router-dom';

import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../componentes/Button';
import { Question } from '../componentes/Question';
import { RoomCode } from '../componentes/RoomCode';
import { database } from '../services/firebase';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';
import { ref, remove, update } from 'firebase/database';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // const { user } = useAuth();
    const navigate = useNavigate();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId!);


    async function handleEndRoom() {
        const roomRef = await ref(database, `rooms/${roomId}`)
        update(roomRef, { closedAt: new Date() })

        navigate('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm("Tem certeza que você deseja excluir essa pergunta?")) {
            const questionRef = await ref(database, `rooms/${roomId}/questions/${questionId}`)
            remove(questionRef)
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        const questionRef = await ref(database, `rooms/${roomId}/questions/${questionId}`)
        update(questionRef, {
            isAnswered: true,
        })
    }

    async function handleHighLightQuestion(questionId: string) {
        const questionRef = await ref(database, `rooms/${roomId}/questions/${questionId}`)
        update(questionRef, {
            isHighlighted: true,
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Leatmeask" />
                    <div>
                        <RoomCode code={roomId!} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className='test'>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => { handleCheckQuestionAsAnswered(question.id) }}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { handleHighLightQuestion(question.id) }}
                                        >
                                            <img src={answerImg} alt="Dar destaque á pergunta" />
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => { handleDeleteQuestion(question.id) }}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}