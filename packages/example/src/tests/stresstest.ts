import {send} from './utils';
import {ApplicationEvent} from '@iwent/core';
import {AddLaneEvent} from '../handlers/add-lane/add-lane.event';
import {AddCardEvent} from '../handlers/add-card/add-card.event';
import {RemoveCardEvent} from '../handlers/remove-card/remove-card.event';
import {RemoveLaneEvent} from '../handlers/remove-lane/remove-lane.event';

const eventsPerSecond = 30;
const laneIds: string[] = [];
const cards: { id: string, laneId: string }[] = [];

function run() {
  setTimeout(() => {
    if (laneIds.length === 0) {
      addLane();
    } else if (laneIds.length > 4) {
      removeLane();
    } else {
      if (cards.length < 10) {
        addCard();
      } else if (cards.length > 40) {
        removeCard();
      } else {
        const rand = Math.random();
        if (rand < 0.5) {
          addCard();
        } else if (rand < 0.6) {
          addLane();
        } else if(rand < 0.9) {
          removeCard();
        } else {
          removeLane();
        }
      }
    }

    console.log(`lanes: ${laneIds.length}, cards: ${cards.length}`);
    run();
  }, 1000 / eventsPerSecond);
}

run();

function removeLane() {
  const laneId = laneIds[0];
  laneIds.splice(0, 1);
  send({
    id: ApplicationEvent.generateId(),
    data: {
      laneId: laneId,
    },
    type: RemoveLaneEvent.type,
  });
}

function addLane() {
  const laneId = ApplicationEvent.generateId();
  laneIds.push(laneId);
  send({
    id: ApplicationEvent.generateId(),
    data: {
      laneId,
    },
    type: AddLaneEvent.type,
  });
}

function addCard() {
  const laneId = laneIds[Math.floor(Math.random() * laneIds.length)];
  const cardId = ApplicationEvent.generateId();
  cards.push({laneId, id: cardId});
  send({
    id: ApplicationEvent.generateId(),
    data: {
      laneId,
      cardId,
      title: ApplicationEvent.generateId(),
    },
    type: AddCardEvent.type,
  });
}

function removeCard() {
  const index = Math.floor(Math.random() * cards.length);
  const card = cards[index];
  cards.splice(index, 1);
  send({
    id: ApplicationEvent.generateId(),
    data: {
      laneId: card.laneId,
      cardId: card.id,
    },
    type: RemoveCardEvent.type,
  });
}