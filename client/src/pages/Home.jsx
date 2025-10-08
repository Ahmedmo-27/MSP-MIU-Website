import React from 'react';
import HeroSection from './Home/HeroSection/HeroSection';
import FeedSection from './Home/FeedSection/FeedSection';
import EventsSection from './Home/EventsSection/EventsSection';
import SponsorsSection from './Home/SponsorsSection/SponsorsSection';
import MemberSection from './Home/MemberSection/MemberSection';

export const Home = () => {
	const isMember = true; // placeholder membership flag
	return (
		<main className="HomePage" aria-label="MSP Home">
			<HeroSection />
			<FeedSection isMember={isMember} />
			<EventsSection />
			<SponsorsSection />
			<MemberSection isMember={isMember} />
		</main>
	);
};

export default Home;