export type AIToolCategory =
	| "chat"
	| "coding"
	| "image"
	| "audio"
	| "video"
	| "writing"
	| "search"
	| "other";

export type AIToolFrequency =
	| "daily"
	| "weekly"
	| "occasional"
	| "experimental";

export type LocaleString = Partial<
	Record<"en" | "zh_CN" | "zh_TW" | "ja", string>
>;

export function getLocaleString(value: LocaleString, lang: string): string {
	return value[lang as keyof LocaleString] ?? value["en"] ?? "";
}

export interface AITool {
	id: string;
	name: string;
	description: LocaleString;
	icon: string;
	category: AIToolCategory;
	frequency?: AIToolFrequency;
	url?: string;
	usage?: LocaleString;
	tags?: string[];
	color?: string;
}

export const aiToolsData: AITool[] = [
	{
		id: "chatgpt-codex",
		name: "ChatGPT/Codex",
		description: {
			en: "AI assistance for coding, debugging, research, and development workflows.",
		},
		icon: "material-symbols:smart-toy",
		category: "coding",
		url: "https://chatgpt.com/",
		tags: ["Coding", "Research"],
	},
	{
		id: "gemini",
		name: "Gemini",
		description: {
			en: "An AI assistant for learning, research, and exploring technical ideas.",
		},
		icon: "material-symbols:auto-awesome",
		category: "chat",
		url: "https://gemini.google.com/",
		tags: ["Learning", "Research"],
	},
	{
		id: "claude",
		name: "Claude",
		description: {
			en: "An AI assistant for working through technical material and drafting clear explanations.",
		},
		icon: "material-symbols:forum-outline",
		category: "chat",
		url: "https://claude.ai/",
		tags: ["Reading", "Writing"],
	},
];
