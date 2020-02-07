import {ApplicationEvent} from '@iwent/core';
import {send} from './utils';
import {AddLaneEvent} from '../handlers/add-lane/add-lane.event';
import {RemoveCardEvent} from '../handlers/remove-card/remove-card.event';
import {AddCardEvent} from '../handlers/add-card/add-card.event';

const laneCount = 4;
const cardsPerLane = 20;
const removeCycles = 2;

async function main() {
  const lanes: { id: string, cardIds: string[] }[] = [];
  for (let l = 0; l < laneCount; l++) {
    const laneId = ApplicationEvent.generateId();
    const lane: { id: string, cardIds: string[] } = {id: laneId, cardIds: []};
    lanes.push(lane);

    await send({
      id: ApplicationEvent.generateId(),
      data: {
        laneId,
      },
      type: AddLaneEvent.type,
    });

    for (let c = 0; c < cardsPerLane; c++) {
      const cardId = ApplicationEvent.generateId();
      lane.cardIds.push(cardId);
      await send({
        id: ApplicationEvent.generateId(),
        data: {
          laneId,
          title: ApplicationEvent.generateId(),
          cardId: cardId,
        },
        type: AddCardEvent.type,
      });
    }
  }

  for (let r = 0; r < removeCycles; r++) {
    for(const lane of lanes) {
      for(const cardId of lane.cardIds) {
        await send({
          id: ApplicationEvent.generateId(),
          data: {
            laneId: lane.id,
            cardId,
          },
          type: RemoveCardEvent.type,
        });
      }
      for(let c = 0; c < lane.cardIds.length; c++) {
        const newCardId = ApplicationEvent.generateId();
        lane.cardIds[c] = newCardId;
        await send({
          id: ApplicationEvent.generateId(),
          data: {
            laneId: lane.id,
            title: newCardId,
            cardId: newCardId,
          },
          type: AddCardEvent.type,
        });
      }
    }
  }
}

main();