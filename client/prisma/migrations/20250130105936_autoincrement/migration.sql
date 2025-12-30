-- AlterTable
CREATE SEQUENCE availabilityrange_rangeid_seq;
ALTER TABLE "AvailabilityRange" ALTER COLUMN "rangeId" SET DEFAULT nextval('availabilityrange_rangeid_seq');
ALTER SEQUENCE availabilityrange_rangeid_seq OWNED BY "AvailabilityRange"."rangeId";

-- AlterTable
CREATE SEQUENCE comment_commentid_seq;
ALTER TABLE "Comment" ALTER COLUMN "commentId" SET DEFAULT nextval('comment_commentid_seq');
ALTER SEQUENCE comment_commentid_seq OWNED BY "Comment"."commentId";

-- AlterTable
CREATE SEQUENCE excuse_excuseid_seq;
ALTER TABLE "Excuse" ALTER COLUMN "excuseId" SET DEFAULT nextval('excuse_excuseid_seq');
ALTER SEQUENCE excuse_excuseid_seq OWNED BY "Excuse"."excuseId";
