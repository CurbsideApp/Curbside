import { useRef, useState, useEffect } from 'react';
import InputField from './InputField';
import { useApi } from '../contexts/ApiProvider';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Socket } from 'socket.io-client';
import ChatHeader from './ChatHeader';
import { listingChatPreview } from '../interfaces/Listing';
import '../styling/Chat.scss';
import ButtonWide from './ButtonWide';
import { Modal } from 'react-bootstrap';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

let socket: Socket;

const ChatView = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  let { listingId } = useParams();
  let chatId = useRef<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const { state } = useLocation() as { state: listingChatPreview };
  if (!currentUser) {
    navigate('/');
  }
  const newMsgField = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [curentUserIsConfirmedBuyerAndRatingIsNotGiven, setCurrentUserIsConfirmedBuyerAndRatingIsNotGiven] =
    useState<boolean>(false);
  const [ratingVisible, setRatingVisible] = useState<boolean>(false);

  const handleRatingVisible = () => {
    setRatingVisible((prev) => !prev);
  };
  const initialStars = [{ active: true }, { active: true }, { active: true }, { active: false }, { active: false }];
  const [stars, setStars] = useState<{ active: boolean }[]>(initialStars);

  useEffect(() => {
    const getData = async () => {
      const response = await api.get(`/transactions?sellerId=${state.sellerId}&buyerId=${state.buyerId}`);
      if (response.body.data?.ratingGiven === false) {
        setCurrentUserIsConfirmedBuyerAndRatingIsNotGiven(true);
      }
    };
    getData();
  }, [api, state.buyerId, state.sellerId]);

  const handleStarClick = (index: number) => {
    const newStars = [];
    for (let i = 0; i < 5; i++) {
      if (i <= index) {
        newStars.push({ active: true });
      } else {
        newStars.push({ active: false });
      }
    }
    setStars(newStars);
  };

  const handleSaveClick = async () => {
    try {
      const body = {
        rating: stars.reduce((prev, curr) => (curr.active ? prev + 1 : prev), 0),
        buyerId: state.buyerId,
        sellerId: state.sellerId,
      };
      await api.post('/ratings', body);
      setRatingVisible(false);
      setCurrentUserIsConfirmedBuyerAndRatingIsNotGiven(false);
    } catch (e) {
      console.log(e);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMsgField.current && newMsgField.current.value) {
      const msg = newMsgField.current.value.trim();
      if (msg !== '' && socket) {
        socket.emit('message', msg, listingId, chatId.current, (res: any) => {
          // console.log('message callback');
          if (res.ok) {
            if (!chatId.current) {
              // console.log('joining chat after new message');
              chatId.current = res.data.chatId;
              socket.emit('joinChat', chatId.current);
              setMessages([res.data.message]);
            } else {
              setMessages((messages) => [...messages, res.data.message]);
            }
          }
        });
      }
      newMsgField.current.value = '';
    }
  };

  useEffect(() => {
    async function init() {
      if (!socket) {
        const io = await api.getSocket();
        socket = io as Socket;
      }
      const buyerId = state.buyerId ? state.buyerId : currentUser?.id;
      if (socket) {
        // console.log('socket connection exists');
        socket.connect();
        socket.emit('getChat', listingId, buyerId, (res: { ok: boolean; data: any }) => {
          if (res.ok) {
            chatId.current = res.data.chatId;
            socket.emit('joinChat', chatId.current);
            setMessages(res.data.messages);
          }
        });

        socket.on('messageResponse', (res: { ok: boolean; data: any }) => {
          if (res.ok) {
            setMessages((messages) => {
              return [...messages, res.data.message];
            });
          }
        });
      } else {
        // console.log('no socket connection');
      }
    }
    init();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [api, state, listingId, currentUser]);

  return (
    <div className="Chat">
      {curentUserIsConfirmedBuyerAndRatingIsNotGiven && (
        <div className="ratingButton" onClick={handleRatingVisible}>
          Rate User
        </div>
      )}
      <ChatHeader listing={state} />
      <div className="messages">
        {messages.length > 0 &&
          messages.map((message) => {
            return (
              <div className="messageWrapper" key={message.id}>
                <div className={message.senderId === currentUser?.id ? 'message selfMessage' : 'message'}>
                  {message.body}
                </div>
                <div className={message.senderId === currentUser?.id ? 'timeStamp selfTimeStamp' : 'timeStamp'}>
                  {new Date(message.createdAt).toLocaleDateString('en-BE', {
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div ref={messagesEndRef} />
              </div>
            );
          })}
      </div>
      <div className="messageInput">
        <InputField
          name={'newMessage'}
          fieldref={newMsgField}
          onKeyPress={(event: any) => {
            if (event.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button type="submit" onClick={sendMessage}>
          Send
        </button>
      </div>
      <Modal size="sm" centered show={ratingVisible} onHide={() => setRatingVisible(false)}>
        <Modal.Header closeButton>Rate {state.userFirstName}</Modal.Header>
        <Modal.Body>
          <div className="ratingModalWrapper">
            <div className="stars">
              {[...stars].map((star, i) =>
                star.active ? (
                  <div key={i} onClick={() => handleStarClick(i)}>
                    <StarRoundedIcon fontSize="large" htmlColor="rgba(255,210,0,1)"></StarRoundedIcon>
                  </div>
                ) : (
                  <div onClick={() => handleStarClick(i)}>
                    <StarBorderRoundedIcon fontSize="large" htmlColor="rgba(255,210,0,1)"></StarBorderRoundedIcon>
                  </div>
                )
              )}
            </div>
            <ButtonWide fill={true} clickFunction={handleSaveClick} content="Save"></ButtonWide>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChatView;
