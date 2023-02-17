import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type fireBaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestion] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = ref(database, `rooms/${roomId}`);
        const unsubscribeRoomListener = onValue(roomRef, (params) => {
            const databaseRoom = params.val();
            const fireBaseQuestions: fireBaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(fireBaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                };
            });
            setTitle(databaseRoom.title);
            setQuestion(parsedQuestions);

        })

        return () => {
            unsubscribeRoomListener();
        };

    }, [roomId, user?.id])

    return { questions, title }
}