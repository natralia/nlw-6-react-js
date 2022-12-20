import { Link, useNavigate } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"

import '../styles/auth.scss'
import { Button } from "../componentes/Button"
import { database } from '../services/firebase'
import { ref, push } from 'firebase/database'
import { useAuth } from '../hooks/useAuth'


export function NewRoom() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = ref(database, 'rooms');
        const firebaseRoom = await push(roomRef, {
            title: newRoom,
            authorId: user?.id
        })

        navigate(`/rooms/${firebaseRoom.key}`)

    }
    return (
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas." />
                <strong>Toda pergunta tem uma resposta.</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala já existente? <Link to="/">Click aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}