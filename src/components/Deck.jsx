/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Card from './Card';

const Deck = ({ addScore, resetScore, TOTAL_POKEMONS }) => {
  const TOTAL_CARDS = 3;
  const [seenPokemons, setSeenPokemons] = useState([]);
  const [currentPokemons, setCurrentPokemons] = useState([]);
  const [currentNames, setCurrentNames] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [isLoading, setIsLoading] = useState('true');

  const createBatch = () => {
    let batch = [];
    // Generates random indexes for the new cards
    for (let i = 0; i < TOTAL_CARDS; i++) {
      let randomIndex = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;
      while (batch.indexOf(randomIndex) === 0)
        randomIndex = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;

      // For the last card, guaranteedly generates a never seen pokemon
      if (i === TOTAL_CARDS - 1) {
        while (seenPokemons.includes(randomIndex)) {
          randomIndex = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;
          while (batch.indexOf(randomIndex) === 0)
            randomIndex = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;
        }
      }
      batch.push(randomIndex);
    }

    // https://javascript.info/array-methods#shuffle-an-array
    for (let i = batch.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [batch[i], batch[j]] = [batch[j], batch[i]];
    }
    setCurrentPokemons(batch);
  };

  const evaluateCardIndex = (index) => {
    if (!seenPokemons.includes(index)) {
      let newSeenPokemons = [...seenPokemons, index];
      setSeenPokemons(newSeenPokemons);
      addScore();
    } else {
      resetScore();
      setSeenPokemons([]);
    }
    createBatch();
  };

  async function fetchData() {
    setIsLoading(true);
    let images = [];
    let names = [];

    for (let pokemonIndex of currentPokemons) {
      let response = await fetch(
        'https://pokeapi.co/api/v2/pokemon/' + pokemonIndex
      );
      let data = await response.json();
      let imageSource = data.sprites.front_default;
      let pokemonName = data.name;
      names.push(pokemonName);
      images.push(imageSource);
    }
    setCurrentNames(names);
    setCurrentImages(images);
    setIsLoading(false);
  }

  useEffect(() => {
    createBatch();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPokemons]);

  return (
    <div className='deck'>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        currentPokemons.map((e, cardIndex) => (
          <Card
            key={cardIndex}
            pokemonIndex={currentPokemons[cardIndex]}
            evaluateCardIndex={evaluateCardIndex}
            imageSource={currentImages[cardIndex]}
            pokemonName={currentNames[cardIndex]}
          />
        ))
      )}
    </div>
  );
};

export default Deck;
