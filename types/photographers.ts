export interface IPhotographer {
	id: number;
	status: "published" | "draft" | "archived";
	date_created: string;
	date_updated: string | null;

	name: string;
	slug: string;

	logo: string | null;
	avatar: string | null;

	portfolio: string | null;

	pronouns: string | null;
	photo_credits: string | null;
}

export interface ILocalizedPhotographer {
	id: number;

	name: string;
	slug: string;

	logo: string | null;
	avatar: string | null;

	portfolio: string | null;

	pronouns: string | null;
	photo_credits: string | null;
}

export interface IPhotographersRequestData {
	data: IPhotographer[];
}
