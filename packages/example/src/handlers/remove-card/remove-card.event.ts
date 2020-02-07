export class RemoveCardEvent {
  static type = 'remove_card';

  laneId: string;
  cardId: string;
}
