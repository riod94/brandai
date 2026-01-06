CREATE TABLE "payment_method" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"account_number" text,
	"account_name" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"instructions" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "payment_method_id" text;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "proof_url" text;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_blocked" boolean DEFAULT false;