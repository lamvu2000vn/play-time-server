import {MemoryCard} from "../../shared/interfaces/games/memoryInterfaces";
import {MemoryTheme} from "../../shared/types";
import {shuffleArray} from "../shuffleArray";
import {generateRandomString, getRandomIndexFromArray} from "../utils";

const FRUIT_THEME_CARD_NAMES = [
    "/assets/images/games/memory/cards/fruits/almond.png",
    "/assets/images/games/memory/cards/fruits/apple.png",
    "/assets/images/games/memory/cards/fruits/avocado.png",
    "/assets/images/games/memory/cards/fruits/bananas.png",
    "/assets/images/games/memory/cards/fruits/berry.png",
    "/assets/images/games/memory/cards/fruits/cherries.png",
    "/assets/images/games/memory/cards/fruits/dragon.png",
    "/assets/images/games/memory/cards/fruits/grapes.png",
    "/assets/images/games/memory/cards/fruits/kiwi.png",
    "/assets/images/games/memory/cards/fruits/lemon.png",
    "/assets/images/games/memory/cards/fruits/mango.png",
    "/assets/images/games/memory/cards/fruits/mangosteen.png",
    "/assets/images/games/memory/cards/fruits/orange.png",
    "/assets/images/games/memory/cards/fruits/papaya.png",
    "/assets/images/games/memory/cards/fruits/passion.png",
    "/assets/images/games/memory/cards/fruits/pear.png",
    "/assets/images/games/memory/cards/fruits/pineapple.png",
    "/assets/images/games/memory/cards/fruits/strawberry.png",
    "/assets/images/games/memory/cards/fruits/tomato.png",
    "/assets/images/games/memory/cards/fruits/watermelon.png",
    "/assets/images/games/memory/cards/fruits/pomegranate.png",
    "/assets/images/games/memory/cards/fruits/durian.png",
    "/assets/images/games/memory/cards/fruits/lychee.png",
    "/assets/images/games/memory/cards/fruits/raspberry.png",
    "/assets/images/games/memory/cards/fruits/cranberry.png",
    "/assets/images/games/memory/cards/fruits/cantaloupe.png",
    "/assets/images/games/memory/cards/fruits/walnut.png",
    "/assets/images/games/memory/cards/fruits/green-grapes.png",
    "/assets/images/games/memory/cards/fruits/coconut.png",
    "/assets/images/games/memory/cards/fruits/peach.png",
    "/assets/images/games/memory/cards/fruits/star-fruit.png",
    "/assets/images/games/memory/cards/fruits/tamarind.png",
];

const ANIMAL_THEME_CARD_NAMES = [
    "/assets/images/games/memory/cards/animals/bee.png",
    "/assets/images/games/memory/cards/animals/butterfly.png",
    "/assets/images/games/memory/cards/animals/cat.png",
    "/assets/images/games/memory/cards/animals/chick.png",
    "/assets/images/games/memory/cards/animals/cow.png",
    "/assets/images/games/memory/cards/animals/crab.png",
    "/assets/images/games/memory/cards/animals/crocodile.png",
    "/assets/images/games/memory/cards/animals/dog.png",
    "/assets/images/games/memory/cards/animals/dolphin.png",
    "/assets/images/games/memory/cards/animals/elephant.png",
    "/assets/images/games/memory/cards/animals/fox.png",
    "/assets/images/games/memory/cards/animals/frog.png",
    "/assets/images/games/memory/cards/animals/hamster.png",
    "/assets/images/games/memory/cards/animals/horse.png",
    "/assets/images/games/memory/cards/animals/jellyfish.png",
    "/assets/images/games/memory/cards/animals/koala.png",
    "/assets/images/games/memory/cards/animals/lion.png",
    "/assets/images/games/memory/cards/animals/monkey.png",
    "/assets/images/games/memory/cards/animals/mouse.png",
    "/assets/images/games/memory/cards/animals/owl.png",
    "/assets/images/games/memory/cards/animals/panda.png",
    "/assets/images/games/memory/cards/animals/parrot.png",
    "/assets/images/games/memory/cards/animals/penguin.png",
    "/assets/images/games/memory/cards/animals/rabbit.png",
    "/assets/images/games/memory/cards/animals/shark.png",
    "/assets/images/games/memory/cards/animals/sheep.png",
    "/assets/images/games/memory/cards/animals/sloth.png",
    "/assets/images/games/memory/cards/animals/snail.png",
    "/assets/images/games/memory/cards/animals/snake.png",
    "/assets/images/games/memory/cards/animals/squirrel.png",
    "/assets/images/games/memory/cards/animals/turtle.png",
    "/assets/images/games/memory/cards/animals/whale.png",
];

export const generateCards = (numOfCards: number, theme: MemoryTheme): MemoryCard[] => {
    const loopTimes = numOfCards / 2;
    const distinctCards: MemoryCard[] = [];
    const cardsAvailable = theme === "animal" ? [...ANIMAL_THEME_CARD_NAMES] : [...FRUIT_THEME_CARD_NAMES];

    for (let i = 0; i < loopTimes; i++) {
        const index = getRandomIndexFromArray(cardsAvailable);
        const imageUrl = cardsAvailable[index];

        distinctCards.push({
            id: generateRandomString(10),
            imageUrl,
        });

        cardsAvailable.splice(index, 1);
    }

    return shuffleArray([...distinctCards, ...distinctCards]);
};
