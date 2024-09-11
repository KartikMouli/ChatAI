import express, { text } from 'express'
import ImageKit from 'imagekit';
import cors from 'cors'
import path from 'path'
import url, { fileURLToPath } from 'url'

import mongoose from 'mongoose';

import Chat from './models/chat.js'
import UserChats from './models/userChats.js'

import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'


const port = process.env.PORT || 3000;
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
    credentials: true
}))

app.use(express.json())

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("connected to mongoDB")
    } catch (err) {
        console.log(err)
    }
}


const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})



app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {

    const userId = req.auth.userId;
    const { text } = req.body;


    try {
        //create a new chat
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }]
        })

        const savedChat = await newChat.save();

        // check userchat exists
        const userChats = await UserChats.find({ userId: userId })

        //if not exists crate a new chat
        if (!userChats.length) {
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40)

                    }
                ]
            })

            await newUserChats.save()
        }
        else {
            //if exists add to chat to it
            await UserChats.updateOne({ userId: userId }, {
                $push: {
                    chats: {
                        _id: savedChat._id,
                        title: text.substring(0, 40)
                    }
                }
            })

            res.status(201).send(newChat._id);
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("Error creating chat!")
    }

})

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChats.find({ userId });
        // console.log(userChats)
        res.status(200).send(userChats[0].chats)
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching userchats !")
    }
})

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId });


        res.status(200).send(chat)
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching chat !")
    }
})

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    const { question, answer, img } = req.body;

    const newItems = [
        ...(question ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }] : []),
        {
            role: "model",
            parts: [{ text: answer }]
        }

    ]


    try {
        const updatedChat = await Chat.updateOne({
            _id: req.params.id, userId
        },
            {
                $push: {
                    history: {
                        $each: newItems,
                    }
                }
            })

        res.status(200).send(updatedChat)

    } catch (error) {
        console.log(error)
        res.status(500).send("Error adding conversation !")
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
})


app.use(express.static(path.join(__dirname, "../client")))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "index.html"))
})

app.listen(port, () => {
    connect()
    console.log("Server running on 3000.")
})