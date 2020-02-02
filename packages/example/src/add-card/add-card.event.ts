export class AddCardEvent {
  static type = 'add_card';

  laneId: string;
  title: string;
  cardId: string;
}
