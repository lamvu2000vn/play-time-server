import {MemoryCard} from "../../shared/interfaces/games/memoryInterfaces";
import {MemoryTheme} from "../../shared/types";
import {shuffleArray} from "../shuffleArray";
import {generateRandomString, getRandomIndexFromArray} from "../utils";

const FRUIT_THEME_CARD_NAMES = [
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/games/memory/cards/fruits/pear.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/games/memory/cards/fruits/durian.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/games/memory/cards/fruits/cranberry.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/tomato.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/pineapple.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/walnut.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/green-grapes.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/bananas.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/dragon.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/papaya.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/cherries.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/grapes.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/raspberry.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/mangosteen.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/lychee.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/apple.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/coconut.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/pomegranate.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/star-fruit.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/tamarind.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/almond.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/passion.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/lemon.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/cantaloupe.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/kiwi.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/watermelon.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/orange.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/peach.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/strawberry.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/avocado.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/berry.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/mango.png.png",
];

const ANIMAL_THEME_CARD_NAMES = [
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/snail.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/cat.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/turtle.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/penguin.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/mouse.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/squirrel.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/shark.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/fox.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/sheep.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/chick.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/dolphin.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/panda.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/sloth.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/rabbit.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/cow.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/lion.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/parrot.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/bee.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/snake.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/horse.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/butterfly.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/whale.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/crab.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/jellyfish.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/monkey.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/koala.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/crocodile.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/dog.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/elephant.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/owl.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/frog.png.png",
    "http://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/hamster.png.png",
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
