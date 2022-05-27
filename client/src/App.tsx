import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ApiProvider from './contexts/ApiProvider';
import SignupView from './views/SignupView';
import SetProfileView from './views/SetProfileView';
import LoginView from './views/LoginView';
import AuthProvider from './contexts/AuthContext';
import AddListingView from './views/AddListingView';
import HomeView from './views/HomeView';
import ProfileView from './views/ProfileView';
import ChatView from './components/Chat';
import ListingDetailView from './views/ListingDetailView';
import ChatsView from './views/ChatsView';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ApiProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/home" element={<HomeView />} />
              <Route path="/learn-more" />
              <Route path="/login" element={<LoginView />} />
              <Route path="/signup" element={<SignupView />} />
              <Route path="/set-profile/:id" element={<SetProfileView />} />
              <Route path="/listing/:id" element={<ListingDetailView />} />
              <Route path="/profile/:id" element={<ProfileView />} />
              <Route path="/favorites" />
              <Route path="/chats" element={<ChatsView />} />
              <Route path="/chats/:listingId" element={<ChatView />} />
              <Route path="/add-listing" element={<AddListingView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ApiProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
