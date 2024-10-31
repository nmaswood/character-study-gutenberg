import { Schema, SchemaType } from "@google/generative-ai";

export const BookAnalysisSchema: Schema = {
	type: SchemaType.OBJECT,
	properties: {
		error: {
			type: SchemaType.OBJECT,
			properties: {
				message: {
					type: SchemaType.STRING,
					description: "'NOT_FICTION' if the work is not fiction, otherwise a user facing clear error message",
				},
			},
			description: "Error if any",
			nullable: true,
		},
		characters: {
			description: "List of characters, maximum 5",
			type: SchemaType.ARRAY,
			items: {
				type: SchemaType.OBJECT,
				properties: {
					characterName: {
						type: SchemaType.STRING,
						description: "Name of the character",
						nullable: false,
					},
					tone: {
						type: SchemaType.STRING,
						description: "Description of the character tone",
						nullable: false,
					},
					traits: {
						type: SchemaType.ARRAY,
						description: "List of character traits, maximum 5",
						items: {
							type: SchemaType.STRING,
						},
						nullable: false,
					},
					relationships: {
						type: SchemaType.ARRAY,
						description: "List of relationships the character has, maximum 5",
						items: {
							type: SchemaType.STRING,
						},
						nullable: false,
					},
					goals: {
						type: SchemaType.ARRAY,
						description: "List of character's goals, maximum 5",
						items: {
							type: SchemaType.STRING,
						},
						nullable: false,
					},
					quotes: {
						type: SchemaType.ARRAY,
						description: "List of notable quotes from the character, maximum 5",
						items: {
							type: SchemaType.STRING,
						},
						nullable: false,
					},
				},
				required: ["characterName", "traits", "relationships", "goals", "quotes", "tone"],
			},
		},
		plotEvents: {
			description: "List of significant events and the relevant characters",
			type: SchemaType.ARRAY,
			items: {
				type: SchemaType.OBJECT,
				properties: {
					eventSummary: {
						description: "A summary of the event",
						type: SchemaType.STRING,
					},
					charactersInEvent: {
						description: "Full names of characters involved the event",
						type: SchemaType.ARRAY,
						items: {
							type: SchemaType.STRING,
						},
					},
				},
				required: ["charactersInEvent", "eventSummary"],
			},
		},
		shortSummary: { type: SchemaType.STRING },
	},

	required: ["shortSummary", "characters", "plotEvents"],
};
