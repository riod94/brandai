import { Link } from "@heroui/link";

interface GalleryProps {
	preview?: boolean;
}

function Gallery({ preview = false }: GalleryProps) {
	const logos = [
		{
			id: 1,
			title: "Ayam Geprek",
			image: "/images/gallery/Ayam Geprek.png",
		},
		{
			id: 2,
			title: "Batagor",
			image: "/images/gallery/Batagor.png",
		},
		{
			id: 3,
			title: "Brand AI",
			image: "/images/gallery/BrandAi.png",
		},
		{
			id: 4,
			title: "Hompimpa",
			image: "/images/gallery/Hompimpa.png",
		},
		{
			id: 5,
			title: "Hopompa",
			image: "/images/gallery/Hopompa.png",
		},
		{
			id: 6,
			title: "KereHore",
			image: "/images/gallery/KereHore.png",
		},
		{
			id: 7,
			title: "Mekar Selalu",
			image: "/images/gallery/Mekar Selalu.png",
		},
		// {
		// 	id: 8,
		// 	title: "Mekar",
		// 	image: "/images/gallery/Mekar.png",
		// },
		{
			id: 9,
			title: "Mi Jagoan",
			image: "/images/gallery/Mi Jagoan.png",
		},
		{
			id: 10,
			title: "Pecel Lele",
			image: "/images/gallery/Pecel Lele.png",
		},
		{
			id: 11,
			title: "Sekar",
			image: "/images/gallery/Sekar.png",
		},
		{
			id: 12,
			title: "TicTacToe",
			image: "/images/gallery/TicTacToe.png",
		},
		{
			id: 13,
			title: "Together Vintage",
			image: "/images/gallery/Together Vintage.png",
		},
		// {
		// 	id: 14,
		// 	title: "Together",
		// 	image: "/images/gallery/Together.png",
		// },
	];

	const displayedLogos = preview ? logos.slice(0, 3) : logos;

	return (
		<section className="py-20 bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-6">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-primary/80 dark:text-primary/60 mb-4">
						Create logos like these in seconds
					</h2>
					<p className="text-lg max-w-2xl mx-auto">
						Get inspired by some of the amazing logos created using our
						AI-powered logo maker
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
					{displayedLogos.map((logo) => (
						<div
							key={logo.id}
							className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
						>
							<img
								src={logo.image}
								alt={logo.title}
								className="w-full h-full object-cover"
							/>
						</div>
					))}
				</div>
				{preview && (
					<div className="text-center">
						<Link
							href="/gallery"
							className="inline-block bg-white hover:bg-gray-50 text-primary/80 border border-gray-200 px-8 py-3 rounded-full text-lg font-medium transition-all duration-300"
						>
							View All Logos
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}

export default Gallery;
