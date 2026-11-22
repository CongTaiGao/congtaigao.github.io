// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "minicloud-simulation",
		title: "MiniCloud Simulation",
		description: "A Docker based cloud lab for web services, storage, identity, and monitoring.",
		image: "",
		showImage: false,
		category: "other",
		techStack: ["Docker", "Flask", "MySQL", "Prometheus"],
		status: "completed",
		sourceCode: "https://github.com/CongTaiGao/minicloud-simulation",
		startDate: "",
	},
	{
		id: "travel-booking-system",
		title: "Travel Booking System",
		description: "A travel agency simulation that connects customers, agencies, and service providers through a booking workflow.",
		image: "",
		showImage: false,
		category: "web",
		techStack: ["HTML"],
		status: "completed",
		sourceCode: "https://github.com/CongTaiGao/travel-booking-system",
		startDate: "",
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
