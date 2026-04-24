export interface IAnnouncer {
	id: number;
	status: "published" | "draft" | "archived";
	date_created: string;
	date_updated: string | null;

	name: string;

	avatar: string | null;

	pronouns: string | null;
	nationalities: string | null;

	photo_credits: string | null;
}

export interface ILocalizedAnnouncer {
	id: number;
	name: string;
	avatar: string | null;
	pronouns: string | null;
	nationalities: string | null;
	photo_credits: string | null;
}

export interface IAnnouncersRequestData {
	data: IAnnouncer[];
}
