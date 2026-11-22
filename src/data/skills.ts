export type SkillCategory =
	| "Security"
	| "Systems"
	| "Version Control"
	| "Containers"
	| "Programming"
	| "Development";

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: SkillCategory;
	color: string;
}

export const skillsData: Skill[] = [
	{
		id: "burp-suite",
		name: "Burp Suite",
		description:
			"Web security testing, HTTP request inspection, and hands-on application security labs.",
		icon: "simple-icons:burpsuite",
		category: "Security",
		color: "#FF6633",
	},
	{
		id: "linux",
		name: "Linux",
		description:
			"Command-line workflows, shell utilities, file permissions, and system navigation.",
		icon: "logos:linux-tux",
		category: "Systems",
		color: "#FCC624",
	},
	{
		id: "git-github",
		name: "Git & GitHub",
		description:
			"Version control, commits, branches, and collaborative repository workflows.",
		icon: "logos:github-icon",
		category: "Version Control",
		color: "#24292F",
	},
	{
		id: "docker",
		name: "Docker",
		description:
			"Container fundamentals, image management, and reproducible development environments.",
		icon: "logos:docker-icon",
		category: "Containers",
		color: "#2496ED",
	},
	{
		id: "python",
		name: "Python",
		description:
			"Scripting and automation for small tools, security labs, and development tasks.",
		icon: "logos:python",
		category: "Programming",
		color: "#3776AB",
	},
	{
		id: "vscode",
		name: "Visual Studio Code",
		description:
			"Everyday coding workflows with extensions, integrated terminals, and debugging tools.",
		icon: "logos:visual-studio-code",
		category: "Development",
		color: "#007ACC",
	},
];
