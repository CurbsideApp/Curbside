import React, { useEffect, useState } from "react";
import "../styling/Profile.scss";
import ButtonSmall from "../components/ButtonSmall";
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import CardListings from "../components/CardListings";
import ProfileImage from "../components/ProfileImage";
import FullScreenLoadingIndicator from "../components/FullScreenLoadingIndicator";
import { User } from '../interfaces/User';
import { Listing } from '../interfaces/Listing';


function Profile() {
  const [userListings, setUserListings] = useState([]);
  const [favoriteList, setFavoriteList] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [activeListingSelection, setActiveListingSelection] = useState<ActiveListingSelection>({ myListings: true, myFavorites: false });
  const [user, setUser] = useState<User>();
  const api = useApi();
  const navigate = useNavigate()
  const { id } = useParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      const res = await api.get(`/users/${id}`);
      if (res.ok) {
        setUser(res.body.data.user);
        setUserListings(res.body.data.listings);
        setLoadingError(false);
      } else {
        navigate('/')
        setLoadingError(false);
        // handleErrors
      }
      setIsLoading(false);
    };

    const loadIsFavorite = async () => {
      if (currentUser && currentUser!.id) {
        const res = await api.get(`/favorites`);
        if (res.ok && res.body.data.favorites) {
          setFavoriteList(res.body.data.favorites)
        }
      }
    }
    loadIsFavorite();
    loadUserData();
  }, [api, navigate, id, currentUser]);

  const handleActivateMyListings = () => {
    setActiveListingSelection({
      myListings: true,
      myFavorites: false
    })
  }

  const handleActivateMyFavorites = () => {
    setActiveListingSelection({
      myListings: false,
      myFavorites: true
    })
  }

  return (
    <>
      {isLoading ? <FullScreenLoadingIndicator /> : <></>}
      {user ? (<section className="Profile">
        <div className="profile-about-info-wrapper">
          <ProfileImage user={user} />
          <div className="profile-basic-info-edit-wrapper">
            <p>
              {user.firstName} {user.lastName[0]}.
            </p>
            <Link to={`/set-profile/${user.id}`}>
              {currentUser && user.id === currentUser.id && <ButtonSmall content={"Edit"} fill={true} />}
            </Link>
          </div>
        </div>
        {currentUser && user.id === currentUser.id ? <nav className="profile-listings-shown-options-wrapper">
          <button onClick={handleActivateMyListings} className={`option-name ${activeListingSelection.myListings === true ? 'active' : ''}`} >My Listings</button>
          <button onClick={handleActivateMyFavorites} className={`option-name ${activeListingSelection.myFavorites === true ? 'active' : ''}`} >My Favorites</button>
        </nav> : <p className="option-name">Listings</p>}
        {activeListingSelection.myListings === true &&
          <CardListings favoriteList={favoriteList} setFavoriteList={setFavoriteList} listings={userListings} isLoading={isLoading} loadingError={loadingError} />
        }
        {activeListingSelection.myFavorites === true &&
          <CardListings favoriteList={favoriteList} setFavoriteList={setFavoriteList} listings={favoriteList} isLoading={isLoading} loadingError={loadingError} />
        }
      </section>) : (<></>)}
    </>
  )
}

interface ActiveListingSelection {
  myListings: boolean,
  myFavorites: boolean
}

export default Profile;
