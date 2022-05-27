import check from '../assets/check.svg';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import '../styling/ListingDetail.scss';
import ButtonWide from '../components/ButtonWide';
import SimpleMap from '../components/SimpleMap';
import ImageCarousel from '../components/ImageCarousel';
import { useAuth } from '../contexts/AuthContext';
import { Listing } from '../interfaces/Listing';
import FullScreenLoadingIndicator from '../components/FullScreenLoadingIndicator';
import ProfileImage from '../components/ProfileImage';
import Modal from 'react-bootstrap/esm/Modal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const stockimgLink = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';

const ListingDetail = () => {
  const [listing, setListing] = useState<Listing>();
  const api = useApi();
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [errorNotLoggedIn, setErrorNotLoggedIn] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<{ buyerName: string; buyerId: string; buyerPhotoUrl?: string }[]>([]);
  const [showMarkAsSoldOptionWithoutCandidates, setShowMarkAsSoldOptionWithoutCandidates] = useState<boolean>();

  useEffect(() => {
    const loadListingData = async () => {
      const res = await api.get(`/listings/${id}`);
      if (res.ok) {
        setLoading(false);
        setListing(res.body.data.listing);
      } else {
        setLoading(false);
        console.log('failing to load listing data');
        // handleErrors
      }
    };
    const loadIsFavorite = async () => {
      if (currentUser && currentUser!.id) {
        const res = await api.get(`/favorites`);
        if (
          res.ok &&
          res.body.data.favorites &&
          res.body.data.favorites.findIndex((element: any) => element.id === id) >= 0
        ) {
          setIsFavorite(true);
        }
      } else {
        setIsFavorite(false);
      }
    };
    loadListingData();
    loadIsFavorite();
  }, [api, id, currentUser]);

  const openCandidates = async () => {
    try {
      const res = await api.get(`/chats/${listing!.id}`);
      if (res.body.data.length === 0) {
        setShowMarkAsSoldOptionWithoutCandidates(true);
      }
      setCandidates(res.body.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMarkAsSold = async (buyerId?: string) => {
    try {
      setLoading(true);
      const response = await api.patch(`/listings/${listing!.id}`, {
        status: listing!.status === 'available' ? 'sold' : 'available',
        buyerId,
      });
      setListing((prevListing: any) => ({ ...prevListing, status: response.body.data.listing.status }));
      setLoading(false);
    } catch (e) {
      console.log('Error handling listing status update.');
      setLoading(false);
    }
  };

  const handleMarkAsAvailable = async () => {
    try {
      setLoading(true);
      const response = await api.delete(`/transactions/${listing!.id}`, undefined);
      if (response.ok) {
        setListing((prevListing: any) => ({ ...prevListing, status: 'available' }));
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const toggleFavorite = async () => {
    if (currentUser) {
      console.log('logging');
      if (isFavorite) {
        const response = await api.delete(`/favorites`, { favoriteId: id });
        if (!response.ok) {
          return;
        }
      } else {
        const response = await api.patch(`/favorites`, { favoriteId: id });
        if (!response.ok) {
          return;
        }
      }
      setIsFavorite((prev) => !prev);
    } else {
      setErrorNotLoggedIn(true);
      setTimeout(() => setErrorNotLoggedIn(false), 2000);
    }
  };

  return (
    <div className={candidates.length > 0 ? 'ListingDetail noscroll' :'ListingDetail'}>
      <div>
        {candidates.length > 0 && (
          <div className="candidatesWrapper" onClick={() => setCandidates([])}>
            <div className="candidatesCard">
              {candidates.map((candidate) => (
                <div className="candidate">
                  <img
                    style={{
                      height: '30px',
                      width: '30px',
                      objectFit: 'cover',
                      borderRadius: '22.5px',
                    }}
                    src={candidate.buyerPhotoUrl ?? stockimgLink}
                    alt="buyer"
                  ></img>
                  <p>{candidate.buyerName}</p>
                  <img
                    src={check}
                    alt="confirm"
                    className="check"
                    onClick={() => handleMarkAsSold(candidate.buyerId)}
                  ></img>
                </div>
              ))}
            </div>
          </div>
        )}
        {loading ? <FullScreenLoadingIndicator /> : <></>}
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {listing !== undefined ? (
            <section>
              <section className="listing-owner-info-wrapper">
                <ProfileImage
                  user={{ id: listing.userId, photoUrl: listing.userPhotoUrl, firstName: listing.userFirstName }}
                />

                <section className="listing-owner-name-buttons-wrapper">
                  <p className="listing-owner-name">{`${listing.userFirstName} ${listing.userLastName.slice(
                    0,
                    1
                  )}.`}</p>
                </section>
              </section>
              {currentUser && listing.userId !== currentUser.id ? (
                <section className="listing-button-wrapper">
                  <ButtonWide
                    clickFunction={() => navigate(`/chats/${listing.id}`, { state: { ...listing, sellerId: listing.userId, buyerId: currentUser.id } })}
                    content={'Contact seller'}
                    fill={true}
                  />
                </section>
              ) : !currentUser ? (
                <ButtonWide
                  fill={true}
                  content="Sign up to contact"
                  clickFunction={() => {
                    navigate('/signup');
                  }}
                ></ButtonWide>
              ) : listing!.status === 'available' ? (
                <ButtonWide fill={true} content="Mark as sold" clickFunction={openCandidates}></ButtonWide>
              ) : (
                <ButtonWide fill={false} content="Mark as available" clickFunction={handleMarkAsAvailable}></ButtonWide>
              )}
              <section className="listing-details-gallery-wrapper">
                <ImageCarousel carouselItems={listing.photoUrls} />
              </section>
              <section className="listing-details-data-wrapper">
                <div className="price-favorite-button-wrapper">
                  <h4>{`${(listing.priceInCents / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'EUR',
                  })}`}</h4>

                  <button onClick={toggleFavorite} className="favorite-heart-button">
                    {isFavorite ? (
                      <div className="heart-wrapper">
                        <FavoriteIcon fontSize="large" htmlColor="rgba(255, 66, 66, 1)"></FavoriteIcon>
                      </div>
                    ) : (
                      <div className="heart-wrapper">
                        <FavoriteBorderIcon fontSize="large" htmlColor="rgba(255, 66, 66, 1)"></FavoriteBorderIcon>
                      </div>
                    )}
                    {<p className={`${errorNotLoggedIn && 'display-log-in-message'}`}>Log in to save listings</p>}
                  </button>
                </div>
                <h4>{listing.title}</h4>
                <p>
                  <span className="listing-detail-title">Condition:</span>
                  {listing.condition === 'gentlyUsed' ? 'gently used' : listing.condition}
                </p>
                <p>
                  <span className="listing-detail-title">Description: </span>
                  {listing.description}
                </p>
                <p className="listing-detail-title">Location: </p>
              </section>
              <SimpleMap position={{ lng: listing.longitude, lat: listing.latitude }} radius={1} />
            </section>
          ) : (
            <></>
          )}
        </div>

        <Modal
          size="sm"
          centered
          show={showMarkAsSoldOptionWithoutCandidates}
          onHide={() => setShowMarkAsSoldOptionWithoutCandidates(false)}
        >
          <Modal.Header closeButton>Mark this item as sold?</Modal.Header>
          <Modal.Body>
            <div className="ratingModalWrapper">
              <p>No users have initiated a chat with you about this item. Are you sure you want to mark it as sold?</p>
              <div className="cancelAndConfirmButtons">
                <ButtonWide
                  fill={false}
                  clickFunction={() => setShowMarkAsSoldOptionWithoutCandidates(false)}
                  content="Cancel"
                ></ButtonWide>
                <ButtonWide
                  fill={true}
                  clickFunction={() => {
                    handleMarkAsSold();
                    setShowMarkAsSoldOptionWithoutCandidates(false);
                  }}
                  content="Save"
                ></ButtonWide>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ListingDetail;
