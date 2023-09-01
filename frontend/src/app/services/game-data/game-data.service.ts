import { Injectable } from '@angular/core';
import { Match } from '../../models/game';
import graphQLService from '../graphQL/GraphQLService';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  
  constructor() {}

  async getMatchesOfUser(id: number | undefined): Promise<Match[]> {
    const response = await graphQLService.query(
      `
      query getMatchesOfUser($id: Int!){
        findMatchesByPlayerId (id: $id) {
          gameID
          firstPlayer {
            id
            username
            picture
          }
          secondPlayer {
            id
            username
            picture
          }
          goalsFirstPlayer
          goalsSecondPlayer
          xpFirstPlayer
          xpSecondPlayer
          timestamp
        }
      }
      `,
      { id },
      { fetchPolicy: 'network-only' },
      );
      if (typeof response === "undefined")
        throw new Error('Empty match data');
      const matches: Match[] = response.findMatchesByPlayerId;
      const plainMatches = matches.map(match => ({...match}));
      for (let match of plainMatches) {
        match.timestamp = new Date(match.timestamp);
      }
      return plainMatches;
  }
}
