'use client';

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { benefitItems } from "../constants";
import Benefit from "./benefit";
import { CADLENLY_URL } from "@/app/constants";

interface PricingClientProps {
  originalPrices: number[];
}

const PricingClient: FC<PricingClientProps> = ({ originalPrices }) => {
  const [starter, plus, pro] = benefitItems;
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [loading, setLoading] = useState(true);
  const [convertedPrices, setConvertedPrices] = useState(originalPrices);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then(async (data) => {
        let country = data.country;
        let userCurrency = "USD";
        let userSymbol = "$";

        if (country === "AU" || country === "AUS") {
          userCurrency = "AUD";
          userSymbol = "A$";
        } else if (country === "US") {
          userCurrency = "USD";
          userSymbol = "$";
        } else if (["DE", "FR", "ES", "IT", "GB", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PT", "IE", "GR", "CZ", "PL", "HU", "SK", "SI", "HR", "BA", "ME", "MK", "AL", "RS", "BG", "RO", "MD", "UA", "BY", "RU", "LT", "LV", "EE", "GE", "AM", "AZ"].includes(country)) {
          userCurrency = "EUR";
          userSymbol = "€";
        }

        setCurrency(userCurrency);
        setSymbol(userSymbol);

        if (userCurrency !== "USD") {
          try {
            const rateRes = await fetch(
              `https://api.exchangerate.host/live?access_key=afe686e60effa99aeec17bafaa86a824&base=USD&symbols=${userCurrency}`
            );
            const rateData = await rateRes.json();
            const rate = rateData.quotes[`USD${userCurrency}`];
            if (rate) {
              setConvertedPrices(originalPrices.map(p => Math.round(p * rate)));
            }
          } catch (e) {
            console.error("Rate fetch failed", e);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [originalPrices]);

  const cards = [
    { title: "Hourly model", price: convertedPrices[0], billed: "Billed in 10-hour blocks", benefits: starter, theme: "white" },
    { title: "Volume package", price: convertedPrices[1], billed: "Billed in 50-hour blocks", benefits: plus, theme: "orange" },
    { title: "Monthly Retainer", price: convertedPrices[2], billed: "Billed in 100-hour blocks", benefits: pro, theme: "white" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 items-start justify-items-center">
      {cards.map((card, i) => (
        <div key={card.title} className="flex flex-col w-full max-w-[353px] md:max-w-[394px]">
          <div 
            className={`${card.theme === 'orange' ? 'bg-[#FFFAF8]' : 'bg-white'} border-[0.5px] md:border border-[#E5E7EB] rounded-t-[32px] flex flex-col justify-between`}
            style={{ paddingTop: '36px', paddingRight: '33px', paddingBottom: '32px', paddingLeft: '33px' }}
          >
            <div className="flex flex-col gap-[32px]">
              <div className="space-y-4">
                <h3 className="font-sans font-semibold text-[26px] leading-[1.15] tracking-[-2%] text-black m-0">
                  {card.title}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-black">
                    {symbol}{card.price}
                  </span>
                  <span className="text-sm font-bold text-[#FF7A59] lowercase tracking-wider">per hour</span>
                </div>
                <p className="font-sans font-medium text-[20px] leading-[28px] tracking-[-2%] text-black m-0">
                  {card.billed}
                </p>
              </div>

              <Link 
                href={CADLENLY_URL}
                target="_blank"
                className={`flex items-center justify-center border-[0.5px] md:border border-black font-manrope font-semibold text-[16px] leading-[32px] tracking-[-3%] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 mx-auto w-full md:w-[328px] ${
                  card.theme === 'orange' ? 'bg-[#FF7A59] text-white hover:bg-[#ff6a42]' : 'bg-white text-black hover:bg-gray-50'
                }`}
                style={{ height: '52px', borderRadius: '10px', paddingLeft: '35px', paddingRight: '35px', paddingTop: '10px', paddingBottom: '10px', gap: '8px' }}
              >
                Get started
              </Link>
            </div>
          </div>

          <div 
            className="bg-white border-[0.5px] md:border border-t-0 border-[#F3F4F6] rounded-b-[32px] h-auto min-h-[248px] md:h-[732px]"
            style={{ paddingTop: '32px', paddingRight: '33px', paddingBottom: '32px', paddingLeft: '33px' }}
          >
            <div className="flex flex-col gap-[16px] md:gap-[36px]">
              <h4 className="text-sm font-bold text-black tracking-wider m-0">Ideal for</h4>
              <div className="space-y-4">
                {card.benefits.labels.map((label: string) => (
                  <Benefit key={label} label={label} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingClient;
