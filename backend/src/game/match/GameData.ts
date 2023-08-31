import { Socket } from 'socket.io';

export interface gameData {
  roomNbr: number;
  ballX: number;
  ballY: number;
  ballMoveSpeed: number;
  ballMoveDegree: number;
  racketLeftY: number;
  racketRightY: number;
  goalTriggerLeft: boolean;
  goalTriggerRight: boolean;
  goalsRight: number;
  goalsLeft: number;
  leftUserID: number;
  rightUserID: number;
  gameEnds: boolean;
}

export interface gameDataBE {
  leftUserSocket: Socket;
  rightUserSocket?: Socket;
  usersWatching: Socket[];
}

export interface onGoingGamesData {
  roomNbr: number;
  leftUserID: number;
  leftUserName: string;
  rightUserID: number;
  rightUserName: string;
  goalsLeft: number;
  goalsRight: number;
}
