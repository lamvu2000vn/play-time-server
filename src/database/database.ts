import mongoose from "mongoose";
import {Game, Item, ItemType, SystemConfiguration} from "./models";

export default async function connectDB() {
    try {
        const uri = process.env.DATABASE_URL || "";

        const clientOptions: mongoose.ConnectOptions = {
            serverApi: {
                version: "1",
                strict: true,
                deprecationErrors: true,
            },
        };

        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db?.admin().command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        await initialData();
    } catch (err) {
        console.log(err);
        await mongoose.disconnect();
    } finally {
        // Ensures that the client will close when you finish/error
        // await mongoose.disconnect();
    }
}

const initialData = async () => {
    try {
        const [gamesCount, systemConfigCount, itemTypeCount, itemCount] = await Promise.all([
            Game.countDocuments(),
            SystemConfiguration.countDocuments(),
            ItemType.countDocuments(),
            Item.countDocuments(),
        ]);

        if (gamesCount === 0) {
            await Game.insertMany([
                {
                    name: "Tic Tac Toe",
                    alternativeName: "tic-tac-toe",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/tic-tac-toe-game.png.png",
                    translation: "{}",
                },
                {
                    name: "15 Puzzle",
                    alternativeName: "15-puzzle",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/games/15-puzzle-game.png.png",
                    translation: "{}",
                },
                {
                    name: "Memory",
                    alternativeName: "memory",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/games/memory-game.png.png",
                    translation: "{}",
                },
            ]);
        }

        if (systemConfigCount === 0) {
            await SystemConfiguration.insertMany([
                {
                    option: "gameScore",
                    value: JSON.stringify({
                        winScore: 50,
                        loseScore: 30,
                        drawScore: 30,
                        maxLevel: 100,
                        winCoin: 50,
                        loseCoin: 30,
                        drawCoin: 30,
                    }),
                },
            ]);
        }

        if (itemTypeCount === 0) {
            await ItemType.insertMany([
                {
                    name: "Avatar",
                    alternativeName: "avatar",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007988/images/items/avatars/avatar-image.png.png",
                    status: 1,
                },
                {
                    name: "Sticker",
                    alternativeName: "sticker",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/sticker-image.png.png",
                    status: 1,
                },
            ]);
        }

        if (itemCount === 0) {
            const itemTypes = await ItemType.find({});
            const avatarTypeId = itemTypes.find((itemType) => itemType.name === "Avatar")?._id;
            const stickerTypeId = itemTypes.find((itemType) => itemType.name === "Sticker")?._id;

            await Item.insertMany([
                {
                    typeId: avatarTypeId,
                    name: "Khỉ ngộ ngỉnh",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/animal-1.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Chó nâu vui vẻ",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/animal-2.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Chồn đại ca",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/animal-3.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Gấu cam hài",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/avatars/animal-4.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Cáo tinh khôi",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/avatars/animal-5.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Chó nâu nâu",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/avatars/animal-6.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Heo hồng",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/animal-7.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Chó thông minh",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/animal-8.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Hưu sừng tấm",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/avatars/animal-9.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Nai ngơ ngác",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/avatars/animal-10.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Gấu nâu dễ thương",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/avatars/animal-11.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Mèo cam",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/animal-12.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Gấu panda",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/avatars/animal-13.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Ngựa vằn nhanh nhẹn",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/avatars/animal-14.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Voi trắng",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/animal-15.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Thỏ tinh nghịch",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/animal-16.png.png",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: avatarTypeId,
                    name: "Gà con chíp chíp",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/avatars/default-avatar.png.png",
                    price: 0,
                    isDefault: true,
                    status: 1,
                },
                // Stickers

                {
                    typeId: stickerTypeId,
                    name: "laugh-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/laugh-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "laugh-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/laugh-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "laugh-3",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/laugh-3.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "laugh-4",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/laugh-4.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "laugh-5",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/laugh-5.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "like-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/like-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "like-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007984/images/items/stickers/like-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cool-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007985/images/items/stickers/cool-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cool-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/cool-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cool-3",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/cool-3.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cool-4",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007981/images/items/stickers/cool-4.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cool-5",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/cool-5.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "nervous-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/nervous-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "nervous-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/nervous-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "nervous-3",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/nervous-3.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "nervous-4",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/nervous-4.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "nervous-5",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/nervous-5.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "happy-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/happy-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "happy-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007984/images/items/stickers/happy-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "happy-3",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/happy-3.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "happy-4",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007977/images/items/stickers/happy-4.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "happy-5",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007984/images/items/stickers/happy-5.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "angry-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/angry-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "angry-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/angry-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "angry-3",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/angry-3.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "angry-4",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/angry-4.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "angry-5",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/angry-5.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cry-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/cry-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cry-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/cry-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cry-3",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/cry-3.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cry-4",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/cry-4.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "cry-5",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007982/images/items/stickers/cry-5.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "bye-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/bye-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "bye-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/bye-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "bye-3",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/bye-3.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "bye-4",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/bye-4.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "bye-5",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/bye-5.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "send-love-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/send-love-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "send-love-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007981/images/items/stickers/send-love-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "send-love-3",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/send-love-3.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "send-love-4",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/send-love-4.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "thumb-down-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/thumb-down-1.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "thumb-down-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007980/images/items/stickers/thumb-down-2.webp.webp",
                    price: 100,
                    isDefault: false,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "default-sticker-1",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007981/images/items/stickers/default-1.webp.webp",
                    price: 0,
                    isDefault: true,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "default-sticker-2",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007978/images/items/stickers/default-2.webp.webp",
                    price: 0,
                    isDefault: true,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "default-sticker-3",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007981/images/items/stickers/default-3.webp.webp",
                    price: 0,
                    isDefault: true,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "default-sticker-4",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007981/images/items/stickers/default-4.webp.webp",
                    price: 0,
                    isDefault: true,
                    status: 1,
                },
                {
                    typeId: stickerTypeId,
                    name: "default-sticker-5",
                    imageUrl:
                        "https://res.cloudinary.com/dorvt3ync/image/upload/v1739007979/images/items/stickers/default-5.webp.webp",
                    price: 0,
                    isDefault: true,
                    status: 1,
                },
            ]);
        }

        console.log("Successfully initialize data");
    } catch (err: Error | unknown) {
        console.log("🚀 ~ initialData ~ err:", err);
    }
};
