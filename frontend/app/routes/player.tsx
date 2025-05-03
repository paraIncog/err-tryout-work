import { Pleier } from "~/components/Pleier";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Player() {
	const episodes = [
		{
		  id: 123,
		  title: 'Audio Title',
		  description: 'Audio Description',
		  date: '2025-05-03T13:30:00Z',
		  imageUrl: 'https://s.err.ee/photo/crop/2017/10/11/412317hbd06t4.png',
		  audioUrl: 'https://example.com/audio.mp3',
		  duration: 245, // seconds
		},
	  ];
	return (
		<div className="">
			<Pleier episodeList={episodes} />
		</div>
	);
}
