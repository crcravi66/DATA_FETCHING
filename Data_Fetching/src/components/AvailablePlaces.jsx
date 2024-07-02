import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js'

// const places = localStorage.getItem();

export default function AvailablePlaces({ onSelectPlace }) {
  // todo : Fetch avilable places from backend API

  const [isFetching, setIsFetching] = useState(false)
  const [avilablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState()

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true)

      try {
        const places = await fetchAvailablePlaces()

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlace = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          )
          setAvailablePlaces(sortedPlace);
          setIsFetching(false)
        })

        setAvailablePlaces(places);

      } catch (error) {
        setError({ message: error.message || 'Could not fetch places, please try again later' });
      }

      setIsFetching(false)
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An Error occurred!" message={error.message} />
  }

  /* 
    useEffect(() => {
      fetch('http://localhost:3000/places')
        .then((response) => {
          return response.json();
        })
        .then((resData) => {
          setAvailablePlaces(resData.places);
        });
    }, []); */

  return (
    <Places
      title="Available Places"
      places={avilablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data ..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
