"use client";

import NumberedCard from "./NumberedCard";
import SectionHeader from "./SectionHeader";
import Button from "./Button";

const NumberedCards = ({ title, subtitle, cards }) => {
  return (
    <section className="bg-transparent py-8 px-5 sm:py-12 sm:px-8">
      <div className="max-w-[var(--spacing-measures-max-width-lg)] mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-8">
          <SectionHeader title={title} subtitle={subtitle} />
        </div>

        {/* Cards Container */}
        <div className="space-y-8 sm:space-y-8">
          {cards.map((card, index) => (
            <NumberedCard
              key={index}
              number={index + 1}
              text={card.text}
              iconShape={card.iconShape}
              iconColor={card.iconColor}
            />
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="text-center mt-8 sm:text-left sm:mt-8">
          <Button variant="default" size="large">
            Create CommunityRule
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NumberedCards;
