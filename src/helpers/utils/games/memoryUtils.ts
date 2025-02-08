import {MemoryCard} from "../../shared/interfaces/games/memoryInterfaces";
import {MemoryTheme} from "../../shared/types";
import {shuffleArray} from "../shuffleArray";
import {generateRandomString, getRandomIndexFromArray} from "../utils";

const FRUIT_THEME_CARD_NAMES = [
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/games/memory/cards/fruits/pear.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/games/memory/cards/fruits/durian.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/games/memory/cards/fruits/cranberry.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/tomato.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/pineapple.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/walnut.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/green-grapes.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/bananas.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/dragon.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/papaya.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/cherries.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/grapes.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/raspberry.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/mangosteen.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/lychee.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/apple.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/coconut.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/pomegranate.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/star-fruit.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/tamarind.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/almond.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/passion.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/fruits/lemon.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/cantaloupe.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/kiwi.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/watermelon.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/orange.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/peach.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/strawberry.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/avocado.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/berry.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/fruits/mango.png.png",
];

const ANIMAL_THEME_CARD_NAMES = [
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/snail.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/cat.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/turtle.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/penguin.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/mouse.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/squirrel.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/shark.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/fox.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/sheep.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory/cards/animals/chick.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/dolphin.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/panda.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/sloth.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/rabbit.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/cow.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/lion.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/parrot.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/bee.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/snake.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/horse.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/butterfly.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/whale.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/crab.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/jellyfish.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/monkey.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/koala.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/crocodile.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/dog.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/elephant.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/owl.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/frog.png.png",
    "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/memory/cards/animals/hamster.png.png",
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
