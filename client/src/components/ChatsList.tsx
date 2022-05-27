import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthContext';
import FullScreenLoadingIndicator from '../components/FullScreenLoadingIndicator';
import '../styling/ChatsList.scss';

const ChatsList = () => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const res = await api.get(`/chats`);
      if (res.ok) {
        setChats(res.body.data);
        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.log('failing to load user chats data');
        // handleErrors
      }
    };
    loadUserData();
  }, [api, currentUser]);
  return (
    <>
      {isLoading ? <FullScreenLoadingIndicator /> :
        <div className='ChatsView'>
          {chats.length === 0 && <EmptyState text="No chats yet" />}
          {chats.map((chat) => (
            <div
              className='chatElement'
              key={chat.id}
              onClick={() => navigate(`/chats/${chat.listingId}`, {
                state: {
                  photoUrls: chat.listingPhotoUrls,
                  id: chat.listingId,
                  buyerId: chat.buyerId,
                  sellerId: chat.sellerId,
                  userFirstName: chat.sellerFirstName,
                  userLastName: chat.sellerLastName,
                  title: chat.listingTitle,
                  priceInCents: chat.priceInCents,
                  status: chat.listingStatus
                }
              })}
            >
              <div className="imagePreview" style={{ backgroundImage: `url("${chat.listingPhotoUrls[0]}")` }} />
              <div className="infoContainer">
                <div className="topInfo">
                  <p className='userName'>{currentUser?.id === chat.buyerId ? `${chat.sellerFirstName} ${chat.sellerLastName[0]}.` : chat.buyerName}</p>
                  <p className='date'>
                    {new Date(chat.updatedAt).toLocaleDateString('en-BE', {
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <p className="listingTitle">{chat.listingTitle}</p>
                <p className='lastMessage'>{chat.lastMessage.body}</p>
              </div>
            </div>
          ))}
        </div>
      }
    </>
  )
}


export default ChatsList;

interface ChatPreview {
  id: string;
  sellerId: string;
  sellerFirstName: string;
  sellerLastName: string;
  buyerId: string;
  buyerName: string;
  listingId: string;
  listingTitle: string;
  listingPhotoUrls: string[];
  listingStatus: string;
  priceInCents: number;
  currency: string;
  lastMessage: { id: string; body: string; senderId: string };
  createdAt: Date;
  updatedAt: Date;
}
