import React from 'react'
import './chatList.css'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const ChatList = () => {

    const { isPending, error, data } = useQuery({
        queryKey: ['userChats'],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, { credentials: "include" }).then((res) =>
                res.json(),
            ),
    })


    return (
        <div className='chatList'>
            <span className='title'>Dashboard</span>
            <Link to='/dashboard'>Create a new Chat</Link>
            <Link to='/'>Explore ChatAI</Link>
            <Link to='/'>Contact</Link>
            <hr />
            <span className='title'>Recent Chats</span>
            <div className="list">
                {isPending ? "Loading..." : error ? "something went wrong..." : data.map(chat => (
                    <Link to={`/dashboard/chats/${chat._id}`} key={chat._id} >{chat.title}</Link>
                ))}

            </div>
            <hr />
            <div className="upgrade">
                <img src="/logo.png" alt="" />
                <div className="texts">
                    <span>Upgrade to ChatAI Pro</span>
                    <span>Get unlimited access to all features</span>
                </div>
            </div>
        </div>
    )
}

export default ChatList
