import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game, GameHistory } from '../../objects/game';
import { GAMES } from '../../objects/mock_games';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  games = GAMES;

  constructor() { }

  getActiveMatches() {
    const activeMatches: Array<Game> = this.games.filter(game => game.game_running === true);
    return(activeMatches);
  }

  getMatchesOfUser(id: number | undefined) {
    if (typeof id === "undefined")
      return;
    const matches: Array<Game> = this.games.filter(game => game.player1_id === id || game.player2_id === id);
    const history: Array<GameHistory> = [];
    
    for (let entry of matches)
    {
      let newentry: GameHistory;

      if (entry.game_running === true)
        continue;
      if (entry.player1_id === id)
      {
        let result: string;
        let xp: number;
        if (entry.player1_score > entry.player2_score)
          result = 'win';
        else if (entry.player1_score === entry.player2_score)
          result = 'draw';
        else
          result = 'loss'
        newentry = { 
          game_id: entry.id,
          player_score: entry.player1_score,
          other_score: entry.player2_score,
          other_id: entry.player2_id,
          other_name: entry.player2_name,
          other_img: entry.player2_profile_pic,
          result: result,
          xp: 0
        };
        history.push(newentry);
      }
      else
      {
        let result: string;
        let xp: number;
        if (entry.player2_score > entry.player1_score)
          result = 'win';
        else if (entry.player2_score === entry.player1_score)
          result = 'draw';
        else
          result = 'loss'
        newentry = {
          game_id: entry.id,
          player_score: entry.player2_score,
          other_score: entry.player1_score,
          other_id: entry.player1_id,
          other_name: entry.player1_name,
          other_img: entry.player1_profile_pic,
          result: result,
          xp: 0
        };
        history.push(newentry);
      }
    }
    return(history);
  }
}
