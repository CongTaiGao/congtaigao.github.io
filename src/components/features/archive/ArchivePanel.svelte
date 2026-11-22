<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { formatDateToYYYYMMDD } from "@utils/date-utils";
import { comparePublishedDatesDescending } from "@utils/post-date-utils";
import { onMount } from "svelte";
import type { ArchivePanelProps, Group, Post } from "./types";

let {
	tags = $bindable([]),
	categories = $bindable([]),
	sortedPosts = [],
}: ArchivePanelProps = $props();

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

let groups = $state<Group[]>([]);

function formatDate(date: Date, dateOnly: boolean) {
	return formatDateToYYYYMMDD(date, dateOnly).slice(5);
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

onMount(async () => {
	let filteredPosts: Post[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	// 按发布时间倒序排序，确保不受置顶影响
	filteredPosts = filteredPosts
		.slice()
		.sort((a, b) =>
			comparePublishedDatesDescending(
				a.data.published,
				b.data.published,
				a.id,
				b.id,
			),
		);

	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const category = post.data.category?.trim() || "Uncategorized";
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(post);
			return acc;
		},
		{} as Record<string, Post[]>,
	);

	groups = Object.entries(grouped)
		.map(([category, posts]) => ({ category, posts }))
		.sort(
			(a, b) =>
				b.posts.length - a.posts.length ||
				a.category.localeCompare(b.category),
		);
});
</script>

<div class="card-base space-y-3 p-4 md:p-6">
	{#each groups as group (group.category)}
		<details class="archive-category" open={groups.length === 1}>
			<summary class="archive-category-summary">
				<span class="archive-category-name">{group.category}</span>
				<span class="archive-category-count">
					{group.posts.length}
					{i18n(
						group.posts.length === 1
							? I18nKey.postCount
							: I18nKey.postsCount,
					)}
				</span>
				<svg class="archive-category-chevron" viewBox="0 0 24 24" aria-hidden="true">
					<path d="m9 18 6-6-6-6" />
				</svg>
			</summary>

			<div class="archive-category-posts">
				{#each group.posts as post (post.id)}
					<a
						href={post.url || `/posts/${post.id}/`}
						aria-label={post.data.title}
						class="group btn-plain block! h-10 w-full rounded-lg hover:text-[initial]"
					>
						<div class="flex h-full flex-row items-center justify-start">
							<div class="w-[15%] text-right text-sm text-50 md:w-[10%]">
								{formatDate(post.data.published, post.data._publishedDateOnly)}
							</div>
							<div class="dash-line relative flex h-full w-[15%] items-center md:w-[10%]">
								<div class="z-50 mx-auto h-1 w-1 rounded bg-[oklch(0.5_0.05_var(--hue))] outline-4 outline-(--card-bg) transition-all group-hover:h-5 group-hover:bg-(--primary) group-hover:outline-(--btn-plain-bg-hover) group-active:outline-(--btn-plain-bg-active)"></div>
							</div>
							<div class="w-[70%] overflow-hidden text-ellipsis whitespace-nowrap pr-8 text-left font-bold text-75 transition-all group-hover:translate-x-1 group-hover:text-(--primary) md:max-w-[65%] md:w-[65%]">
								{post.data.title}
							</div>
							<div class="hidden overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm text-30 transition md:block md:w-[15%]">
								{formatTag(post.data.tags)}
							</div>
						</div>
					</a>
				{/each}
			</div>
		</details>
	{/each}
</div>

<style>
	.archive-category {
		border: 1px solid var(--line-divider);
		border-radius: 1rem;
		overflow: hidden;
	}

	.archive-category-summary {
		align-items: center;
		cursor: pointer;
		display: flex;
		gap: 0.75rem;
		list-style: none;
		min-height: 3.5rem;
		padding: 0.75rem 1rem;
	}

	.archive-category-summary::-webkit-details-marker {
		display: none;
	}

	.archive-category-summary:hover {
		background: var(--btn-plain-bg-hover);
	}

	.archive-category-name {
		color: var(--btn-content);
		flex: 1;
		font-size: 1rem;
		font-weight: 700;
	}

	.archive-category-count {
		color: var(--btn-content);
		font-size: 0.875rem;
		opacity: 0.65;
	}

	.archive-category-chevron {
		fill: none;
		height: 1.1rem;
		stroke: var(--primary);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2;
		transform: rotate(0deg);
		transition: transform 180ms ease;
		width: 1.1rem;
	}

	.archive-category[open] .archive-category-chevron {
		transform: rotate(90deg);
	}

	.archive-category-posts {
		border-top: 1px solid var(--line-divider);
		padding: 0.4rem 0.75rem 0.75rem;
	}
</style>
