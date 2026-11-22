import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
	title: "Welcome",
	content: "I’m Po. I use this site to share security notes and software projects.",
	closable: true,
	link: {
		enable: true,
		text: "About me",
		url: "/about/",
		external: false,
	},
};
