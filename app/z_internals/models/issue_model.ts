enum IssueStatus {
	OPEN = "open",
	IN_PROGRESS = "in_progress",
	CLOSED = "closed",
	RESOLVED = "resolved",
}

interface AuthorInfo extends Record<string, any> {
	id: number;
	full_name: string;
	profile_image: string | null;
}

interface IssueCategory extends Record<string, any> {
	id: number;
	name: string;
	description: string;
}

interface IssueModel {
	id: number;
	title: string;
	description: string;
	images: string[];
	location: string;
	status: string;
	created_at: string;
	updated_at: string;
	category: IssueCategory;
	reported_by: AuthorInfo;
	image_count: number;
}

export class Issue implements IssueModel {
	id: number;
	title: string;
	description: string;
	images: string[];
	location: string;
	status: string;
	created_at: string;
	updated_at: string;
	category: IssueCategory;
	reported_by: AuthorInfo;
	image_count: number;

	constructor(data: IssueModel) {
		this.id = data.id;
		this.title = data.title;
		this.description = data.description;

		this.images = data.images;
		this.location = data.location;
		this.status = data.status;
		this.created_at = data.created_at;
		this.updated_at = data.updated_at;
		this.category = data.category;
		this.reported_by = data.reported_by;
		this.image_count = data.image_count;
	}

	static fromJson(json: Record<string, any>): Issue {
		return new Issue({
			id: json.id,
			title: json.title,
			description: json.description,
			images: json.images,
			location: json.location,
			status: json.status,
			created_at: json.created_at,
			updated_at: json.updated_at,
			category: json.category,
			reported_by: json.reported_by,
			image_count: json.image_count,
		});
	}

	toJson(): Record<string, any> {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			images: this.images,
			location: this.location,
			status: this.status,
			created_at: this.created_at,
			updated_at: this.updated_at,
			category: this.category,
			reported_by: this.reported_by,
			image_count: this.image_count,
		};
	}

	get imageCount(): number {
		return this.image_count;
	}

	get imagesList(): string[] {
		return this.images;
	}

	get reportedBy(): AuthorInfo {
		return this.reported_by;
	}

	get categoryInfo(): IssueCategory {
		return this.category;
	}

	// Additional methods related to Issue can be added here
}
