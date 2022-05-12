import { useApi } from "../contexts/ApiProvider"
import { useEffect, useState, useRef, useCallback, KeyboardEvent } from "react"
import { mocks } from '../mocks';
import ListingPreview from "../components/ListingPreview";
import FiltersComponent from "../components/FiltersComponent";
import Header from '../components/Header';
import Footer from "../components/Footer";
import '../styling/HomeView.css';
import LocationPreviewComponent from "../components/LocationPreviewComponent";
import loader from '../assets/loader.gif';

export default function HomeView() {
  const api = useApi()

  const [listings, setListings] = useState<any[]>([]);
  const [FiltersAreVisible, setFiltersAreVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<boolean>(false)

  const offset = useRef<number>(0);

  const radiusField = useRef<HTMLInputElement>(null); // for geo modal

  const tagsField = useRef<{ [key: string]: string }>({}) // categories need to be decided {catName: false, }
  const sortByField = useRef<HTMLSelectElement>(null);
  const maxPriceField = useRef<HTMLInputElement>(null);
  const minPriceField = useRef<HTMLInputElement>(null);
  const conditionField = useRef<HTMLSelectElement>(null);
  const fields = { tagsField, sortByField, maxPriceField, minPriceField, conditionField }

  const latitudeField = useRef<HTMLSelectElement>(null);
  const longitudeField = useRef<HTMLSelectElement>(null);
  const searchField = useRef<HTMLInputElement>(null);

  const getListings = useCallback(async (offset: number) => {
    const longitude = 13.405 //CHANGE TO PULL FROM SOMEWHERE
    const latitude = 52.52 // CHANGE TO PULL FROM SOMEWHERE
    const tagString = Object.values(tagsField.current).join('+');
    const tags = tagString !== '' ? tagString : undefined;
    const radius = radiusField.current?.value || 10;
    const maxPrice = maxPriceField.current?.value || undefined;
    const minPrice = minPriceField.current?.value || 0;
    const sortBy = sortByField.current?.value || 'closest';
    const condition = conditionField.current?.value || 'all';
    // const latitude = latitudeField.current?.value || 'all';
    // const longitude = longitudeField.current?.value || 'all';
    const search = searchField.current?.value || undefined;
    const query = { search, offset, radius, condition, tags, maxPrice, minPrice, sortBy, latitude, longitude };
    // add 'search' to query
    const res = await api.get('/listings', query)
    return res;
  }, [api])



  async function handleScroll() {
    const res = await getListings(offset.current);
    if (res.ok) {
      offset.current = res.body.data.offset;
      setListings(res.body.data.listings);
    } else {
      //handleError
    }
  }
  const openFiltersModal = () => setFiltersAreVisible(true)
  const closeFiltersModal = () => setFiltersAreVisible(false)

  async function applyFilters() {
    closeFiltersModal();
    console.log(conditionField.current?.value)
    console.log(sortByField.current?.value)
    console.log(maxPriceField.current?.value)

    const res = await getListings(0);
    if (res.ok) {
      offset.current = res.body.data.offset;
      setListings(res.body.data.listings);

    } else {
      //handleError
    }
  }

  const loadData = async () => {
    const res = await getListings(0);
    if (res.ok) {
      offset.current = res.body.data.offset;
      setListings(res.body.data.listings);
      setLoadingError(false);
      console.log('hi here')
      searchField.current!.value = "";
    } else {
      // handleErrors
      setListings(mocks.listings);
      setLoadingError(false);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    loadData();
  }, [api, getListings])


  function pressEnter(event: KeyboardEvent<HTMLInputElement>): any {
    if (event.key === 'Enter') {
      loadData();
    }
  }


  return (
    <div className="body-page">
      <div className='body-header-container' >
        <Header />
      </div>
      <div className="body-content-background">
        <div className="body-frame">
          <LocationPreviewComponent />{/*Empty for now, but will possibly show preview of your location  */}

          <div className="global-search-area">
            <div className='search-bar-container'>
              <button onClick={() => getListings(0)}><i className="bi bi-search"></i></button>
              <input ref={searchField} className="main-input" placeholder="Search.." onKeyPress={(e) => pressEnter(e)} />
            </div>
            <div className='search-buttons-group' >
              <button className="search-location-button search-btn" onClick={openFiltersModal}>
                <p>
                  <i className="bi bi-geo-alt"></i>
                  Location
                </p>
              </button>
              <button className="search-filter-button search-btn" onClick={openFiltersModal}>
                <p>
                  Filter
                  <i className="bi bi-sliders"></i>
                </p>
              </button>
            </div>
          </div>

          <FiltersComponent
            filtersAreVisible={FiltersAreVisible}
            closeFiltersModal={closeFiltersModal}
            applyFilters={applyFilters}
            fields={fields}
          />
          <div className='listings-container' >
            {listings.map(listing => <ListingPreview key={listing.id} listing={listing} />)}
            {loadingError && <p>Couldn't load listings :/</p>}
            {isLoading && <img style={{ height: '20vw', maxHeight: '200px', borderRadius: '20px' }} src={loader} alt="Loading..." />}
          </div>
        </div>
      </div>
      <div className='body-footer-container'>
        <Footer />
      </div>
    </div>
  )
}
