import { useApi } from '../contexts/ApiProvider';
import { useEffect, useState, useRef, useCallback, KeyboardEvent } from 'react';
import FiltersComponent from '../components/FiltersComponent';
import LocationRadius from '../components/LocationRadius';
import RoundedButton from '../components/RoundedButton';
import '../styling/HomeComponent.scss';
import { useAuth } from '../contexts/AuthContext';
import { LocationGroupInterface } from '../interfaces/LocationGroup';
import CardListings from '../components/CardListings';
import MapListings from '../components/MapListings';
import FullScreenLoadingIndicator from '../components/FullScreenLoadingIndicator';
import { Listing } from '../interfaces/Listing';

export default function HomeComponent() {
  const api = useApi();
  const [listings, setListings] = useState<any[]>([]);
  const [FiltersAreVisible, setFiltersAreVisible] = useState(false);
  const [locationIsVisible, setLocationIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [loadingError, setLoadingError] = useState<boolean>(false);
  const tagStack = useRef<string[]>([]);
  const [toggleComponent, setToggleComponent] = useState<boolean>(true);
  const [activeListing, setActiveListing] = useState<Listing | null | undefined>(null);
  const [favoriteList, setFavoriteList] = useState<any[]>([])
  const { currentUser } = useAuth();

  const [locationGroupField, setLocationGroupField] = useState<{
    latitude: number;
    longitude: number;
    radius: number;
    address: string;
  }>({
    latitude: 52.52,
    longitude: 13.405,
    radius: 25,
    address: 'Berlin',
  });

  const sortByField = useRef<HTMLSelectElement>(null);
  const maxPriceField = useRef<HTMLInputElement>(null);
  const minPriceField = useRef<HTMLInputElement>(null);
  const conditionField = useRef<HTMLSelectElement>(null);
  const fields = { sortByField, maxPriceField, minPriceField, conditionField, tagStack };

  const offset = useRef<number>(0);
  const searchField = useRef<HTMLInputElement>(null);

  const getListings = useCallback(
    async (offset: number, locationGroupField: LocationGroupInterface) => {
      const longitude = locationGroupField?.longitude || 13.38; //CHANGE TO PULL FROM SOMEWHERE
      const latitude = locationGroupField?.latitude || 52.52; // CHANGE TO PULL FROM SOMEWHERE
      const radius = locationGroupField?.radius || 50;
      const maxPrice = maxPriceField.current?.value || undefined;
      const minPrice = minPriceField.current?.value || 0;
      const sortBy = sortByField.current?.value || 'closest';
      const condition = conditionField.current?.value || 'all';
      const search = searchField.current?.value || undefined;
      const tagString = tagStack.current.map((el) => el.replace(/\s+/g, '')).join(' ');
      const tags = tagString !== '' ? tagString : undefined;
      const query = { search, offset, radius, condition, tags, maxPrice, minPrice, sortBy, latitude, longitude };
      // add 'search' to query
      const res = await api.get('/listings', query);
      return res;
    },
    []
  );

  const openFiltersModal = () => setFiltersAreVisible(true);
  const closeFiltersModal = () => setFiltersAreVisible(false);
  const openLocationModal = () => setLocationIsVisible(true);
  const closeLocationModal = () => setLocationIsVisible(false);

  async function applyFilters() {
    closeFiltersModal();
    closeLocationModal();

    const res = await getListings(0, locationGroupField);
    if (res.ok) {
      offset.current = res.body.data.offset;
      setListings(res.body.data.listings);
    } else {
      //handleError
    }
  }

  async function applyLocation(location : LocationGroupInterface){
    closeFiltersModal();
    closeLocationModal();
    setLocationGroupField(location)
    const res = await getListings(0, location);
    if (res.ok) {
      offset.current = res.body.data.offset;
      setListings(res.body.data.listings);
    } else {
      //handleError
    }
  }
  function pressEnter(event: KeyboardEvent<HTMLInputElement>): any {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }
  async function handleSearch() {
    const res = await getListings(0, locationGroupField);
    if (res.ok) {
      offset.current = res.body.data.offset;
      setListings(res.body.data.listings);
      // setLoadingError(false);
      searchField.current!.value = '';
    } else {
      // handleErrors
      // setLoadingError(false);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const loadData = async (userLocation :LocationGroupInterface) => {
      try {
        const res = await getListings(0, userLocation);
        // console.log(res.body.data)
        if (res.ok) {
          offset.current = res.body.data.offset;
          setListings(res.body.data.listings);
          // setLoadingError(false);
        } else {
          // setLoadingError(false);
        }

      } catch (e) {

      } finally {
      
        setIsLoading(false);
      
      }
    };

    if (currentUser) {
      const loadLocation = async () => {
        let userLocation;
        const res = await api.get(`/users/${currentUser?.id}`);
        if (res.ok) {
          userLocation = {
            latitude: res.body.data.user.latitude,
            longitude: res.body.data.user.longitude,
            radius: 25,
            address: res.body.data.user.city,
          };
          setLocationGroupField(userLocation);
        }
        if (!userLocation) {
          userLocation = {
            latitude: 52.52,
            longitude: 13.04,
            radius: 25,
            address: 'Berlin',
          };
        }
        if (userLocation) {
          loadData(userLocation);
        }
      } 
      loadLocation()
    } else {
      const userLocation = {
        latitude: 52.52,
        longitude: 13.04,
        radius: 25,
        address: 'Berlin'
      }
      loadData(userLocation);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadIsFavorite = async () => {
      if (currentUser && currentUser!.id) {
        const res = await api.get(`/favorites`);
        if (res.ok && res.body.data.favorites) {
          setFavoriteList(res.body.data.favorites)
        }
      } else {
        setFavoriteList([])
      }
    }
    loadIsFavorite();
  }, [currentUser]);

 if (isLoading) {
   return <FullScreenLoadingIndicator/>
 } else {
   return (<>
    <div className={`HomeView ${!currentUser ? 'without-user' : ''}`}>
      <div className="global-search-area">
        <div className="search-bar-container">
          <input ref={searchField} className="main-input" placeholder="Search..." onKeyPress={(e) => pressEnter(e)} />
          <button onClick={handleSearch}>
            <i className="bi bi-search"></i>
          </button>
        </div>
        <div className="search-buttons-group">
          <button className="search-btn" onClick={openLocationModal}>
            <i className="bi bi-geo-alt"></i>
            <span>{locationGroupField.address ? locationGroupField.address : 'Location'}</span>
          </button>
          <button className="search-btn" onClick={openFiltersModal}>
            <span>Filter</span>
            <i className="bi bi-sliders"></i>
          </button>
        </div>
      </div>

      <FiltersComponent
        filtersAreVisible={FiltersAreVisible}
        closeFiltersModal={closeFiltersModal}
        applyFilters={applyFilters}
        fields={fields}
      />
      <LocationRadius
        locationIsVisible={locationIsVisible}
        closeLocationModal={closeLocationModal}
        applyLocation={applyLocation}
        locationGroupField={locationGroupField}
        setLocationGroupField={setLocationGroupField}
      />

      {toggleComponent ? (
        <CardListings favoriteList={favoriteList} setFavoriteList={setFavoriteList} listings={listings} isLoading={isLoading} />
        // <CardListings favoriteList={favoriteList} setFavoriteList={setFavoriteList} listings={listings} isLoading={isLoading} loadingError={loadingError} />
      ) : (
        <MapListings
          listings={listings}
          position={{ latitude: locationGroupField.latitude, longitude: locationGroupField.longitude }}
          activeListing={activeListing}
          setActiveListing={setActiveListing}
        />
      )}
    </div>

    <div>
      <div
        className={`map-btn-float ${currentUser && 'with-user'} ${activeListing && 'with-listing'} ${currentUser && activeListing && 'with-user-and-listing'
          }`}
      >
        <RoundedButton
          onClick={() => {
            setToggleComponent((prev) => !prev);
            setActiveListing(null);
          }}
          content={
            toggleComponent ? (
              <i style={{ fontSize: '20px', color: 'white' }} className="bi bi-map"></i>
            ) : (
              <i style={{ fontSize: '24px', color: 'white' }} className="bi bi-grid"></i>
            )
          }
        />
      </div>
    </div>
  </>) } }