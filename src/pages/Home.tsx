import { useNavigate } from 'react-router-dom';

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImage from "../assets/images/google-icon.svg";

import '../styles/auth.scss';
import { Button } from "../componentes/Button";
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { get, ref } from 'firebase/database';
import { database } from '../services/firebase';
import toast from 'react-hot-toast';


export function Home() {
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        navigate('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await ref(database, 'rooms/' + roomCode)
        const room = await get(roomRef);

        if (!room.exists()) {
            toast.error("Room does not exists.")
            return;
        }

        if(room.val().closedAt) {
            alert("Room already closed.")
        }

        navigate(`/rooms/${roomCode}`)
    }

    return (
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas." />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button className="create-room" onClick={handleCreateRoom} >
                        <img src={googleIconImage} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}