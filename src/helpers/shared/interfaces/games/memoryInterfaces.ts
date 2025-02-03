export interface MemoryCard {
    id: string;
    imageUrl: string;
}

export interface MemoryFlipCardUpPayload {
    roomId: string;
    playerId: string;
    cardStateIndex: number;
}

export interface MemoryFinishTheMatchPayload {
    roomId: string;
    playerId: string;
    numOfMyCards: number;
    numOfOpponentCards: number;
}
