import CTASection from "@/components/CTASection";
import Faq from "@/components/FAQ";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";

export default function Home() {
	return (
		<div className="min-h-screen">
			<Hero />
			<Features />
			<HowItWorks />
			<Gallery />
			{/* <Pricing />
			<Testimonials />
			<Faq /> */}
			<CTASection />
		</div>
	);
}
