import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt.jsx'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import Markdown from 'react-markdown'
import { IKImage } from 'imagekitio-react'

function ChatPage() {

  const path = useLocation().pathname
  const chatId = path.split("/").pop()

  // console.log(chatId)

  const { isPending, error, data } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, { credentials: "include" }).then((res) =>
        res.json(),
      ),
  })

  // console.log(data);

  return (
    <div className='chatPage'>
      <div className="wrapper">
        <div className="chat">

          {isPending ? "Loading..." : error ? "Something went wrong..." : data?.history?.map((msg, i) => (

            <>
              {msg.img && (
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                  path={msg.img}
                  height="300"
                  width="400"
                  transformation={[{ height: 300, width: 400 }]}
                  loading='lazy'
                  lgip={{ active: true, quality: 20 }}

                />
              )}

              <div className={msg.role === "user" ? "message user" : "message"} key={i}>
                <Markdown>{msg.parts[0].text}</Markdown>
              </div>

            </>
          ))}


          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  )
}

export default ChatPage