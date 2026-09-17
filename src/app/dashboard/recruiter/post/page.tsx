import { PostJobForm } from "@/components/jobs/post-job-form";
import { PageIntro } from "@/components/ui/primitives";

export default function PostJobPage() {
  return (
    <div className="bg-wash">
    <div className="mx-auto max-w-3xl px-5 py-16">
      <PageIntro eyebrow="Recruiter" title="Post a job" lede="Share a South African role with Creative CV job seekers." />
      <PostJobForm />
    </div>
    </div>
  );
}
