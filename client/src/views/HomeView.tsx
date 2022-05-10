import { useApi } from "../contexts/ApiProvider"
import { useEffect, useState, useRef, useCallback } from "react"
import { mocks } from '../mocks';
import ListingPreview from "../components/ListingPreview";
export default function HomeView () {
  const api = useApi()

  const [listings, setListings] = useState<any[]>([]);
  
  const offset = useRef<number>(0);
  const tagsField = useRef<{[key:string]:string}>({})
  const radiusField = useRef<HTMLInputElement>(null);
  const sortByField = useRef<HTMLSelectElement>(null);
  const maxPriceField = useRef<HTMLInputElement>(null);
  const minPriceField =  useRef<HTMLInputElement>(null); 
  const conditionField = useRef<HTMLSelectElement>(null);

  const getListings = useCallback(async (offset:number) => {
    const tagString = Object.values(tagsField.current).join('+');
    const tags = tagString !== '' ? tagString : undefined;
    const radius = radiusField.current?.value || 10;
    const maxPrice = maxPriceField.current?.value || undefined;
    const minPrice = minPriceField.current?.value || 0;
    const sortBy = sortByField.current?.value || 'closest';
    const condition = conditionField.current?.value || 'all';
    const query = {offset:offset, radius, condition, tags, maxPrice, minPrice, sortBy};
    return  await api.get('/listings', query);
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

  async function applyFilters() {
    const res = await getListings(0); 
    if (res.ok) {
      offset.current = res.body.data.offset;
      setListings(res.body.data.listings);
    } else {
      //handleError
    }
  }

  useEffect(()=> {
    const loadData = async () => {
      const res = await getListings(0);
      if (res.ok) {
        offset.current = res.body.data.offset;
        setListings(res.body.data.listings);
      } else {
        setListings(mocks.listings)
        // handleErrors
      }
    }
    loadData();
  }, [api, getListings]) 
  
  return (
    <>
      {listings.length > 0 && listings.map(listing => <ListingPreview key={listing.id} listing={listing}/>)}
    </>
  )
}
