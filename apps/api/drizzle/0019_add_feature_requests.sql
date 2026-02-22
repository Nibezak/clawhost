CREATE TABLE IF NOT EXISTS "feature_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'awaiting_approval' NOT NULL,
	"rejection_reason" text,
	"upvote_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "feature_upvotes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"feature_request_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "feature_requests" ADD CONSTRAINT "feature_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "feature_upvotes" ADD CONSTRAINT "feature_upvotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "feature_upvotes" ADD CONSTRAINT "feature_upvotes_feature_request_id_feature_requests_id_fk" FOREIGN KEY ("feature_request_id") REFERENCES "public"."feature_requests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "feature_upvotes_user_feature" ON "feature_upvotes" USING btree ("user_id","feature_request_id");
CREATE INDEX IF NOT EXISTS "feature_requests_user_id_idx" ON "feature_requests" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "feature_requests_status_idx" ON "feature_requests" USING btree ("status");
CREATE INDEX IF NOT EXISTS "feature_requests_upvote_count_idx" ON "feature_requests" USING btree ("upvote_count");
CREATE INDEX IF NOT EXISTS "feature_upvotes_feature_request_id_idx" ON "feature_upvotes" USING btree ("feature_request_id");