"use client";

import { useEffect, useState } from "react";

const PromptCardList = ({ data }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((country) => (
            <div className='prompt_card'>
            <div className='flex justify-between items-start gap-5'>

                <div className='flex flex-col'>
                  <h3 className='font-satoshi font-semibold text-gray-900'>
                    {country.country}
                  </h3>
                  <p className='font-inter text-sm text-gray-500'>
                    Apperances: {country.appearances}
                  </p>
                  <p className='font-inter text-sm text-gray-500'>
                    Total Goals: {country.total_goals}
                  </p>
                </div>
            </div>
          </div>
      ))}
    </div>
  );
};

const ListCountries = () => {

  const [allCountries, setAllCountries] = useState([]);

  const fetchCountries = async () => {
    const response = await fetch("/api/country");
    let data = await response.json();
    data = data.splice(0, 6);

    setAllCountries(data);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <section className='feed'>
      <PromptCardList data={allCountries} />

  </section>
  );
};

export default  ListCountries;
