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
		id: "chatgpt",
		name: "ChatGPT",
		description: { en: "Outline write-ups, explain concepts, and draft small examples." },
		icon: "material-symbols:smart-toy",
		category: "chat",
		url: "https://chatgpt.com/",
		tags: ["Writing", "Learning"],
	},
	{
		id: "claude",
		name: "Claude",
		description: { en: "Review technical drafts and work through long notes." },
		icon: "material-symbols:code",
		category: "writing",
		url: "https://claude.ai/",
		tags: ["Review", "Documentation"],
	},
	{
		id: "perplexity",
		name: "Perplexity",
		description: { en: "Find source material and follow references during research." },
		icon: "material-symbols:search",
		category: "search",
		url: "https://www.perplexity.ai/",
		tags: ["Research", "Sources"],
	},
];
